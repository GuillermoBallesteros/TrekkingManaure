// Empaquetador ZIP sin compresión (método "store"), suficiente para un .xlsx.
export type ZipEntry = { path: string; content: string };

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date: Date) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1);
  const day = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, day };
}

class ByteWriter {
  private chunks: Uint8Array[] = [];
  length = 0;

  bytes(data: Uint8Array) {
    this.chunks.push(data);
    this.length += data.length;
  }

  numbers(values: [number, 2 | 4][]) {
    const size = values.reduce((sum, [, width]) => sum + width, 0);
    const view = new DataView(new ArrayBuffer(size));
    let offset = 0;
    for (const [value, width] of values) {
      if (width === 2) view.setUint16(offset, value, true);
      else view.setUint32(offset, value, true);
      offset += width;
    }
    this.bytes(new Uint8Array(view.buffer));
  }

  toBlob(type: string) {
    return new Blob(this.chunks as BlobPart[], { type });
  }
}

export function createZip(entries: ZipEntry[], type: string) {
  const encoder = new TextEncoder();
  const { time, day } = dosDateTime(new Date());
  const writer = new ByteWriter();
  const central = new ByteWriter();

  for (const entry of entries) {
    const name = encoder.encode(entry.path);
    const data = encoder.encode(entry.content);
    const crc = crc32(data);
    const offset = writer.length;

    writer.numbers([
      [0x04034b50, 4],
      [20, 2],
      [0x0800, 2],
      [0, 2],
      [time, 2],
      [day, 2],
      [crc, 4],
      [data.length, 4],
      [data.length, 4],
      [name.length, 2],
      [0, 2],
    ]);
    writer.bytes(name);
    writer.bytes(data);

    central.numbers([
      [0x02014b50, 4],
      [20, 2],
      [20, 2],
      [0x0800, 2],
      [0, 2],
      [time, 2],
      [day, 2],
      [crc, 4],
      [data.length, 4],
      [data.length, 4],
      [name.length, 2],
      [0, 2],
      [0, 2],
      [0, 2],
      [0, 2],
      [0, 4],
      [offset, 4],
    ]);
    central.bytes(name);
  }

  const centralOffset = writer.length;
  const centralBytes = central.toBlob('');
  const end = new ByteWriter();
  end.numbers([
    [0x06054b50, 4],
    [0, 2],
    [0, 2],
    [entries.length, 2],
    [entries.length, 2],
    [central.length, 4],
    [centralOffset, 4],
    [0, 2],
  ]);

  return new Blob([writer.toBlob(''), centralBytes, end.toBlob('')], { type });
}
