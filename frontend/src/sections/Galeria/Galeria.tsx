import { useEffect, useState } from 'react';
import Icon from '../../../../shared/components/Icon';
import Modal from '../../../../shared/components/Modal';
import { galleryImages } from '../../../../shared/data/galeria';
import './Galeria.css';

const upcoming = [
  {
    title: 'Senderos y paisajes',
    text: 'La belleza de nuestro territorio',
    icon: 'mountain' as const,
  },
  { title: 'En el camino', text: 'Cada paso cuenta una historia', icon: 'camera' as const },
  { title: 'Momentos compartidos', text: 'La experiencia se vive juntos', icon: 'users' as const },
];

export default function Galeria() {
  const [selected, setSelected] = useState<number | null>(null);
  const image = selected === null ? null : galleryImages[selected];

  function move(direction: number) {
    setSelected((current) =>
      current === null ? null : (current + direction + galleryImages.length) % galleryImages.length,
    );
  }

  useEffect(() => {
    if (selected === null || galleryImages.length < 2) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setSelected((current) => (current === null ? null : (current + 1) % galleryImages.length));
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setSelected((current) =>
          current === null ? null : (current - 1 + galleryImages.length) % galleryImages.length,
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected]);

  return (
    <section className="section gallery" id="galeria">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">El camino en imágenes</span>
          <h2 className="section-title">
            El Perijá se <em>vive y se recuerda</em>
          </h2>
          <p className="section-sub">
            Un espacio para los paisajes, las personas y los momentos del Desafío Perijá. Aquí
            reuniremos las fotografías generales del evento.
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
              <img
                src={item.src}
                alt={item.description}
                loading="lazy"
                width={item.poster ? 1024 : undefined}
                height={item.poster ? 1536 : undefined}
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
          {galleryImages.length === 1 &&
            upcoming.map((item, index) => (
              <div
                key={item.title}
                className={
                  'gallery-placeholder reveal ' + (index === 2 ? 'gallery-placeholder--wide' : '')
                }
                data-delay={index + 1}
              >
                <span className="gallery-placeholder__index">0{index + 1}</span>
                <Icon name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <small>Próximamente · Fotos del evento</small>
              </div>
            ))}
        </div>
        <p className="note gallery-note">
          Las fotografías generales se incorporarán a esta galería. El material disponible ahora es
          el afiche del evento.
        </p>
      </div>
      <Modal
        open={image !== null}
        title={image?.title || 'Galería'}
        onClose={() => setSelected(null)}
        className="gallery-modal"
      >
        {image && (
          <>
            <img src={image.src} alt={image.description} className="gallery-modal__image" />
            <div className="gallery-modal__footer">
              <span>{image.description}</span>
              {galleryImages.length > 1 && (
                <div>
                  <button
                    type="button"
                    className="modal__close"
                    aria-label="Imagen anterior"
                    onClick={() => move(-1)}
                  >
                    ←
                  </button>
                  <span>
                    {(selected || 0) + 1} / {galleryImages.length}
                  </span>
                  <button
                    type="button"
                    className="modal__close"
                    aria-label="Imagen siguiente"
                    onClick={() => move(1)}
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
