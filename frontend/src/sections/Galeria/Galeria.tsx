import { useEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react';
import CloudImage from '../../../../shared/components/CloudImage';
import Icon from '../../../../shared/components/Icon';
import Modal from '../../../../shared/components/Modal';
import { galleryImages } from '../../../../shared/data/galeria';
import { presets } from '../../../../shared/data/imagenes';
import { cloudinaryUrl } from '../../../../shared/utils/cloudinary';
import './Galeria.css';

export default function Galeria() {
  const [selected, setSelected] = useState<number | null>(null);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const strip = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const total = galleryImages.length;
  const image = selected === null ? null : galleryImages[selected];
  const isOpen = selected !== null;
  selectedRef.current = selected;

  function goTo(index: number) {
    setSelected((index + total) % total);
  }

  function move(step: number) {
    goTo((selectedRef.current ?? 0) + step);
  }

  function onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function onTouchEnd(event: TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || total < 2) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) move(dx < 0 ? 1 : -1);
  }

  useEffect(() => {
    const container = strip.current;
    const thumb = selected === null ? null : (container?.children[selected] as HTMLElement | null);
    if (!container || !thumb) return;
    container.scrollTo({
      left: thumb.offsetLeft - container.clientWidth / 2 + thumb.clientWidth / 2,
      behavior: 'smooth',
    });
  }, [selected]);

  useEffect(() => {
    if (!isOpen || total < 2) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        move(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        move(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <section className="section gallery" id="galeria">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">El camino en imágenes</span>
          <h2 className="section-title">
            El Perijá se <em>vive y se recuerda</em>
          </h2>
          <p className="section-sub">
            Los paisajes, los lugares y los momentos que vas a encontrar en el Desafío Perijá.
          </p>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={'gallery-item reveal ' + (item.poster ? 'gallery-item--poster' : '')}
              data-delay={Math.min(index, 4)}
              onClick={() => setSelected(index)}
              aria-label={'Ampliar ' + item.title}
            >
              <CloudImage
                publicId={item.publicId}
                preset={presets.galeriaMiniatura}
                alt={item.description}
                loading="lazy"
                width={item.poster ? 1200 : undefined}
                height={item.poster ? 2594 : undefined}
              />
              <span className="gallery-item__zoom">
                <Icon name="camera" />
              </span>
              <span className="gallery-item__caption">
                <small>{item.poster ? 'LA INVITACIÓN' : 'DESAFÍO PERIJÁ'}</small>
                <strong>{item.title}</strong>
                <span>
                  Ver imagen <Icon name="arrow" />
                </span>
              </span>
            </button>
          ))}
        </div>
        <p className="note gallery-note">Imágenes de Manaure y de la Serranía del Perijá.</p>
      </div>
      <Modal
        open={image !== null}
        title={image?.title || 'Galería'}
        onClose={() => setSelected(null)}
        className="gallery-modal"
      >
        {image && (
          <div className="visor">
            <div className="visor__escenario">
              <div className="visor__foto" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <div className="visor__pista">
                  {galleryImages.map((item, index) => (
                    <div
                      key={item.id}
                      className={'visor__slide' + (index === selected ? ' activa' : '')}
                      style={
                        {
                          '--foto': `url("${cloudinaryUrl(item.publicId, 96, presets.galeriaFondo)}")`,
                        } as CSSProperties
                      }
                      aria-hidden={index !== selected}
                    >
                      {failed[item.id] ? (
                        <p className="visor__error">No se pudo cargar esta imagen.</p>
                      ) : (
                        <CloudImage
                          className="visor__img"
                          publicId={item.publicId}
                          preset={presets.galeriaVisor}
                          alt={item.description}
                          draggable={false}
                          onError={() => setFailed((prev) => ({ ...prev, [item.id]: true }))}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {total > 1 && (
              <div className="visor__tira" ref={strip}>
                {galleryImages.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={'visor__mini' + (index === selected ? ' activo' : '')}
                    aria-label={'Ver ' + item.title}
                    aria-current={index === selected}
                    onClick={() => goTo(index)}
                  >
                    <CloudImage
                      publicId={item.publicId}
                      preset={presets.galeriaMini}
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            )}
            <p className="visor__pie">
              <span>{image.description}</span>
              {total > 1 && (
                <strong className="visor__cuenta">
                  {(selected ?? 0) + 1} / {total}
                </strong>
              )}
            </p>
          </div>
        )}
      </Modal>
    </section>
  );
}
