import './Galeria.css';
import Icon from '../../../../shared/components/Icon';
import Modal from '../../../../shared/components/Modal';
import { galleryImages } from '../../../../shared/data/galeria';
import { useState } from 'react';

export default function Galeria() {
  const [selected, setSelected] = useState<number | null>(null);
  const image = selected === null ? null : galleryImages[selected];

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Los recuerdos también se organizan</span>
          <h1>
            Galería del <em>evento</em>
          </h1>
          <p>El material visual compartido con la página pública.</p>
        </div>
        <span className="admin-pill">{galleryImages.length} imagen disponible</span>
      </div>
      <div className="admin-gallery-grid">
        {galleryImages.map((item, index) => (
          <button
            className="admin-media-card"
            type="button"
            key={item.id}
            onClick={() => setSelected(index)}
            aria-label={'Ampliar ' + item.title}
          >
            <img src={item.src} alt={item.description} />
            <span>
              <strong>{item.title}</strong>
              <small>{item.poster ? 'Afiche del evento' : 'Fotografía general'}</small>
            </span>
          </button>
        ))}
        <article className="admin-upload-placeholder">
          <Icon name="camera" />
          <h2>Más historias por compartir</h2>
          <p>
            Aquí se organizarán las fotografías generales del evento y su publicación en la galería.
          </p>
          <button className="btn btn--ghost" disabled>
            <Icon name="upload" /> Carga por integrar
          </button>
          <small>Los archivos originales existentes se conservan en el proyecto.</small>
        </article>
      </div>
      <Modal
        open={image !== null}
        title={image?.title || 'Galería'}
        onClose={() => setSelected(null)}
      >
        <img className="admin-image-preview" src={image?.src} alt={image?.description || ''} />
      </Modal>
    </>
  );
}
