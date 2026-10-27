import { precios } from '../../../../shared/config';
import { formatMoney } from '../../../../shared/utils/format';
import Icon from '../../../../shared/components/Icon';
import CloudImage from '../../../../shared/components/CloudImage';
import { imagenes, presets } from '../../../../shared/data/imagenes';
import './Extras.css';

export default function Extras() {
  return (
    <div style={{ marginTop: '3rem' }}>
      <div className="section-head reveal" style={{ marginBottom: '1.2rem' }}>
        <span className="eyebrow">Adicionales</span>
        <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>
          Súmale <em>más experiencia</em>
        </h2>
      </div>
      <div className="extras">
        <article className="extra reveal" data-delay="1">
          <CloudImage
            className="extra__foto"
            publicId={imagenes.extras.acompanante}
            preset={presets.extra}
            alt="Pareja de senderistas desayunando en una terraza, con mochilas y bastones junto a la mesa"
            loading="lazy"
          />
          <Icon name="users" />
          <h3>Acompañante</h3>
          <strong>{formatMoney(precios.acompanante)}</strong>
          <small>Acompañante sin pago de kit. Cubre hospedaje y las 3 comidas.</small>
          <div className="extra__chips">
            <span>Hospedaje</span>
            <span>3 comidas</span>
          </div>
        </article>
        <article className="extra reveal" data-delay="2">
          <CloudImage
            className="extra__foto"
            publicId={imagenes.extras.cuatrimoto}
            preset={presets.extra}
            alt="Guía en cuatrimoto por los caminos de montaña de Manaure"
            loading="lazy"
          />
          <Icon name="mountain" />
          <h3>Cuatrimoto</h3>
          <strong>
            {formatMoney(precios.cuatrimoto)}{' '}
            <small style={{ fontFamily: 'var(--textos)', fontSize: '.5em' }}>aprox.</small>
          </strong>
          <small>Por pareja. Merienda incluida.</small>
        </article>
        <article className="extra reveal" data-delay="3">
          <CloudImage
            className="extra__foto"
            publicId={imagenes.extras.parapente}
            preset={presets.extra}
            alt="Vuelo en parapente biplaza sobre Manaure"
            loading="lazy"
          />
          <Icon name="flag" />
          <h3>Parapente</h3>
          <strong>
            {formatMoney(precios.parapente)}{' '}
            <small style={{ fontFamily: 'var(--textos)', fontSize: '.5em' }}>aprox.</small>
          </strong>
          <small>Por persona. Merienda incluida.</small>
        </article>
      </div>
      <p className="note" style={{ marginTop: '.9rem' }}>
        Las actividades adicionales se eligen al reservar y se suman al total de tu inscripción.
      </p>
    </div>
  );
}
