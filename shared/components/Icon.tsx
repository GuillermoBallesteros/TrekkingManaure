const icons = {
  mountain: (
    <>
      <path d="M3 20l6.5-11 3.5 5.5 2.5-4L21 20H3z" />
      <path d="M8.2 12.3l1.3 1.2 1.4-1.2 1.4 1.4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3 10h18" />
      <path d="M8 14h2M14 14h2M8 17.5h2M14 17.5h2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0111 0" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M16 14.3c2.8.2 4.5 2.1 4.5 5.7" />
    </>
  ),
  shirt: (
    <>
      <path d="M8 3.5L4 6l1.5 5 2.5-1v10.5h8V10l2.5 1L20 6l-4-2.5c-.6 1.5-1.9 2.3-4 2.3S8.6 5 8 3.5z" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="11.5" rx="1.8" />
      <path d="M3.5 13.5h17M12 9v11.5" />
      <path d="M12 9C9.5 9 8 8 8 6.4 8 5 9.1 4 10.4 4 12 4 12 6.5 12 9zM12 9c2.5 0 4-1 4-2.6C16 5 14.9 4 13.6 4 12 4 12 6.5 12 9z" />
    </>
  ),
  droplet: (
    <>
      <path d="M12 3s6 6.4 6 11a6 6 0 01-12 0c0-4.6 6-11 6-11z" />
    </>
  ),
  fire: (
    <>
      <path d="M12 3c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2 .7-3.4 2-4.6.2 2 1.4 3 2.4 3.2C10.6 9.4 11.4 6 12 3z" />
    </>
  ),
  food: (
    <>
      <path d="M7 3v8a2.5 2.5 0 005 0V3M9.5 11v10" />
      <path d="M17 3c-1.8 1-2.5 3-2.5 5.5S15.2 13 17 13v8" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="6.5" width="18" height="13" rx="2.5" />
      <circle cx="12" cy="13" r="3.6" />
      <path d="M8.5 6.5L10 3.8h4l1.5 2.7" />
    </>
  ),
  medical: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5.5c0 4.4-3 7.9-7 9.5-4-1.6-7-5.1-7-9.5V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  tent: (
    <>
      <path d="M12 4L3 20h18L12 4z" />
      <path d="M12 4v16M8 20l4-7 4 7" />
    </>
  ),
  hotel: (
    <>
      <path d="M3 20V6h11v14M14 20V10h7v10M3 20h18" />
      <path d="M6.5 9.5h2M6.5 13h2M6.5 16.5h2M17 13h1M17 16.5h1" />
    </>
  ),
  check: (
    <>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 018 0v2.5" />
    </>
  ),
  arrow: (
    <>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </>
  ),
  snow: (
    <>
      <path d="M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17" />
      <path d="M9 4.5L12 7l3-2.5M9 19.5L12 17l3 2.5" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20.5 11.6A8.4 8.4 0 016.6 19l-3.1.9.9-3A8.4 8.4 0 1120.5 11.6z" />
      <path d="M9 8.6c.3.9 1.6 2.8 2.9 3.5.9.5 2 .8 2.4.4l.6-.8" />
    </>
  ),
  sheet: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M3.5 9h17M3.5 14.5h17M9.5 3.5v17M15 3.5v17" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 15v3.5A1.5 1.5 0 005.5 20h13a1.5 1.5 0 001.5-1.5V15" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.6v.2" />
    </>
  ),
  phone: (
    <>
      <path d="M5 3.5h3l1.5 4-2 1.5a12 12 0 006.5 6.5l1.5-2 4 1.5v3c0 1.1-.9 2-2 2C10.8 19.8 4.2 13.2 3.5 5.5c0-1.1.9-2 2-2z" />
    </>
  ),
  id: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="9" cy="11" r="2.2" />
      <path d="M5.5 16.2c.5-1.6 1.8-2.4 3.5-2.4s3 .8 3.5 2.4M15 10h4M15 13h4M15 16h2.5" />
    </>
  ),
  flag: (
    <>
      <path d="M6 21V4M6 4h11l-1.6 4L17 12H6" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M6 18 18 6" />
    </>
  ),
  search: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="m15 15 6 6" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
};

export type IconName = keyof typeof icons;

export default function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg className={`ico ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}
