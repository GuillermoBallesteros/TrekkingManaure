import { useEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react';
import { galleryImages } from '../../../../shared/data/galeria';
import { presets } from '../../../../shared/data/imagenes';
import { cloudinaryUrl } from '../../../../shared/utils/cloudinary';
import { classNames } from '../../utils/comun/classNames';

/** Cuadrícula de la galería y visor con flechas, deslizamiento y tira de miniaturas. */
export function useGaleria() {
  const [selected, setSelected] = useState<number | null>(null);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const strip = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const total = galleryImages.length;
  const image = selected === null ? null : galleryImages[selected];
  const isOpen = selected !== null;

  function goTo(index: number) {
    setSelected((index + total) % total);
  }

  // Parte del valor más reciente: varios toques seguidos no se pierden entre renders.
  function move(step: number) {
    setSelected((current) => ((((current ?? 0) + step) % total) + total) % total);
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

  return {
    items: galleryImages.map((item, index) => ({
      id: item.id,
      className: classNames('gallery-item reveal', item.poster && 'gallery-item--poster'),
      delay: Math.min(index, 4),
      open: () => setSelected(index),
      ariaLabel: 'Ampliar ' + item.title,
      publicId: item.publicId,
      alt: item.description,
      width: item.poster ? 1200 : undefined,
      height: item.poster ? 2594 : undefined,
      kicker: item.poster ? 'LA INVITACIÓN' : 'DESAFÍO PERIJÁ',
      title: item.title,
    })),
    modal: {
      open: image !== null,
      title: image?.title || 'Galería',
      close: () => setSelected(null),
    },
    visor: image && {
      onTouchStart,
      onTouchEnd,
      slides: galleryImages.map((item, index) => ({
        id: item.id,
        className: classNames('visor__slide', index === selected && 'activa'),
        style: {
          '--foto': `url("${cloudinaryUrl(item.publicId, 96, presets.galeriaFondo)}")`,
        } as CSSProperties,
        hidden: index !== selected,
        failed: failed[item.id],
        publicId: item.publicId,
        alt: item.description,
        onError: () => setFailed((prev) => ({ ...prev, [item.id]: true })),
      })),
      stripRef: strip,
      // Con una sola imagen no hay tira de miniaturas ni contador.
      minis:
        total > 1
          ? galleryImages.map((item, index) => ({
              id: item.id,
              className: classNames('visor__mini', index === selected && 'activo'),
              ariaLabel: 'Ver ' + item.title,
              current: index === selected,
              select: () => goTo(index),
              publicId: item.publicId,
            }))
          : null,
      description: image.description,
      counter: total > 1 ? (selected ?? 0) + 1 + ' / ' + total : null,
    },
  };
}
