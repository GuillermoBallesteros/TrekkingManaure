import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { autenticacion } from '../../services';
import { CLAVE_MAX, CLAVE_MIN, CORREO_MAX } from '../../data/auth/sesion';
import {
  validarCredenciales,
  type Credenciales,
  type ErroresAcceso,
} from '../../utils/auth/validaciones';

/** Formulario de acceso: valida por campo al enviar y, desde entonces, mientras se escribe. */
export function useLogin() {
  const [valores, setValores] = useState<Credenciales>({ correo: '', clave: '' });
  const [recordar, setRecordar] = useState(false);
  const [mostrarClave, setMostrarClave] = useState(false);
  const [errores, setErrores] = useState<ErroresAcceso>({});
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [pendiente, setPendiente] = useState(false);

  useEffect(() => {
    document.title = 'Acceso · Perijá Admin';
  }, []);

  function cambiar(campo: keyof Credenciales) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const siguientes = { ...valores, [campo]: event.target.value };
      setValores(siguientes);
      setError('');
      if (enviado) setErrores(validarCredenciales(siguientes));
    };
  }

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendiente) return;
    setEnviado(true);
    setError('');
    const encontrados = validarCredenciales(valores);
    setErrores(encontrados);
    const primero = (Object.keys(encontrados) as (keyof Credenciales)[])[0];
    if (primero) {
      document.getElementById('admin-' + primero)?.focus();
      return;
    }

    setPendiente(true);
    const resultado = await autenticacion.iniciarSesion(valores, recordar);
    setPendiente(false);
    if (!resultado.ok) {
      setErrores(resultado.campos ?? {});
      setError(resultado.error);
      return;
    }
    // Conserva la página que se pidió (por ejemplo #/pagos) o abre la vista general.
    if (!location.hash.startsWith('#/')) location.hash = '#/resumen';
  }

  const campo = (nombre: keyof Credenciales) => ({
    id: 'admin-' + nombre,
    value: valores[nombre],
    onChange: cambiar(nombre),
    'aria-invalid': errores[nombre] ? true : undefined,
    'aria-describedby': errores[nombre] ? 'admin-' + nombre + '-error' : undefined,
  });

  return {
    correo: { ...campo('correo'), maxLength: CORREO_MAX, error: errores.correo },
    clave: {
      ...campo('clave'),
      type: mostrarClave ? 'text' : 'password',
      minLength: CLAVE_MIN,
      maxLength: CLAVE_MAX,
      error: errores.clave,
    },
    claveAyuda: 'Mínimo ' + CLAVE_MIN + ' caracteres.',
    mostrarClave,
    alternarClave: () => setMostrarClave((actual) => !actual),
    recordar,
    cambiarRecordar: (event: ChangeEvent<HTMLInputElement>) => setRecordar(event.target.checked),
    error,
    pendiente,
    enviar,
  };
}
