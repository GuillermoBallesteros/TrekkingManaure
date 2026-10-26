import { useEffect, useRef } from 'react';
import { aliados } from '../../../../shared/data/aliados';
import './Aliados.css';

const VELOCIDAD_BASE = 38; // px por segundo hacia la izquierda
const VELOCIDAD_MAXIMA = 4000;

export default function Aliados() {
  const cajaRef = useRef<HTMLDivElement>(null);
  const pistaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const caja = cajaRef.current;
    const pista = pistaRef.current;
    if (!caja || !pista) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let x = 0;
    let velocidad = 0;
    let mitad = 0;
    let arrastrando = false;
    let ultimoX = 0;
    let ultimoT = 0;
    let cuadroId = 0;
    let previo = performance.now();

    const limitar = (valor: number) =>
      Math.max(-VELOCIDAD_MAXIMA, Math.min(VELOCIDAD_MAXIMA, valor));

    const medir = () => {
      const tarjetas = pista.children;
      const primera = tarjetas[0] as HTMLElement | undefined;
      const copia = tarjetas[aliados.length] as HTMLElement | undefined;
      if (primera && copia) mitad = copia.offsetLeft - primera.offsetLeft;
    };

    const cuadro = (ahora: number) => {
      const dt = Math.min((ahora - previo) / 1000, 0.05);
      previo = ahora;
      if (!arrastrando) {
        x += (-VELOCIDAD_BASE + velocidad) * dt;
        velocidad *= Math.exp(-3 * dt);
      }
      if (mitad > 0) {
        while (x <= -mitad) x += mitad;
        while (x > 0) x -= mitad;
      }
      pista.style.transform = `translate3d(${x}px, 0, 0)`;
      cuadroId = requestAnimationFrame(cuadro);
    };

    const alBajar = (evento: PointerEvent) => {
      arrastrando = true;
      velocidad = 0;
      ultimoX = evento.clientX;
      ultimoT = performance.now();
      caja.classList.add('is-arrastrando');
      try {
        caja.setPointerCapture(evento.pointerId);
      } catch {
        // sin captura el arrastre funciona igual mientras el puntero siga encima
      }
    };
    const alMover = (evento: PointerEvent) => {
      if (!arrastrando) return;
      const ahora = performance.now();
      const dx = evento.clientX - ultimoX;
      x += dx;
      velocidad = limitar(0.6 * velocidad + 0.4 * (dx / (Math.max(ahora - ultimoT, 1) / 1000)));
      ultimoX = evento.clientX;
      ultimoT = ahora;
    };
    const alSoltar = () => {
      if (!arrastrando) return;
      arrastrando = false;
      if (performance.now() - ultimoT > 90) velocidad = 0;
      caja.classList.remove('is-arrastrando');
    };
    const alRodar = (evento: WheelEvent) => {
      if (Math.abs(evento.deltaX) <= Math.abs(evento.deltaY)) return;
      evento.preventDefault();
      velocidad = limitar(velocidad - evento.deltaX * 5);
    };

    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(caja);
    caja.addEventListener('pointerdown', alBajar);
    caja.addEventListener('pointermove', alMover);
    caja.addEventListener('pointerup', alSoltar);
    caja.addEventListener('pointercancel', alSoltar);
    caja.addEventListener('wheel', alRodar, { passive: false });
    cuadroId = requestAnimationFrame(cuadro);

    return () => {
      cancelAnimationFrame(cuadroId);
      observador.disconnect();
      caja.removeEventListener('pointerdown', alBajar);
      caja.removeEventListener('pointermove', alMover);
      caja.removeEventListener('pointerup', alSoltar);
      caja.removeEventListener('pointercancel', alSoltar);
      caja.removeEventListener('wheel', alRodar);
      pista.style.transform = '';
    };
  }, []);

  return (
    <section className="section aliados" id="aliados">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Con el apoyo de</span>
          <h2 className="section-title">
            Aliados del <em>Perijá</em>
          </h2>
        </div>
      </div>
      <div className="logo-marquee reveal" ref={cajaRef}>
        <div className="logo-marquee__track" ref={pistaRef}>
          {[...aliados, ...aliados].map((aliado, indice) => (
            <div
              key={indice}
              className="logo-card"
              aria-hidden={indice >= aliados.length ? true : undefined}
            >
              <img
                src={aliado.src}
                alt={indice < aliados.length ? aliado.name : ''}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
