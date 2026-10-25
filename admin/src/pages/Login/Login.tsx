import './Login.css';
import Brand from '../../../../shared/components/Brand';
import Icon from '../../../../shared/components/Icon';

export default function Login() {
  return (
    <main className="admin-access">
      <section className="admin-access__form">
        <a href="#/acceso" aria-label="Trekking Perijá, acceso">
          <Brand />
        </a>
        <span className="eyebrow">Detrás de una gran experiencia</span>
        <h1>
          El equipo que
          <br />
          hace posible <em>el desafío</em>
        </h1>
        <p>
          Un espacio para organizar a los participantes, acompañar cada reserva y preparar el
          camino.
        </p>
        <div className="admin-access__fields">
          <label htmlFor="admin-email">Correo administrativo</label>
          <input id="admin-email" type="email" disabled placeholder="Tu correo de acceso" />
          <label htmlFor="admin-password">Contraseña</label>
          <input id="admin-password" type="password" disabled placeholder="Tu contraseña" />
        </div>
        <a href="#/resumen" className="btn btn--primary btn--block">
          Explorar vista previa <Icon name="arrow" />
        </a>
        <small className="admin-access__note">
          <Icon name="lock" /> El acceso seguro se conectará más adelante. Esta vista no solicita
          credenciales.
        </small>
      </section>
      <section className="admin-access__art" aria-label="Desafío Perijá 13K">
        <div className="admin-access__mountain">
          <Icon name="mountain" />
        </div>
        <span>ORGANIZAR · ACOMPAÑAR · CONECTAR</span>
        <h2>
          Desafío
          <br />
          <span className="brush">Perijá</span>
          <br />
          <em>13K</em>
        </h2>
        <p>Manaure · Cesar · Colombia</p>
      </section>
    </main>
  );
}
