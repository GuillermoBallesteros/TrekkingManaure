import { contacto, evento } from '../../../../shared/config';
import { metodoPago, versionTerminos } from '../../../../shared/reservas';

// Términos y condiciones que acepta cada persona al reservar. BORRADOR: debe revisarlo un
// abogado antes de publicar. Si cambia el texto, cambia también versionTerminos en
// shared/reservas/data/catalogos.ts: cada reserva guarda la versión que aceptó.

export const VERSION_TERMINOS = versionTerminos;

export const CONDICIONES: readonly { titulo: string; parrafos: readonly string[] }[] = [
  {
    titulo: '1. La actividad',
    parrafos: [
      'El ' +
        evento.nombre +
        ' es un recorrido a pie de ' +
        evento.distanciaKm +
        ' km por la montaña de la Serranía del Perijá, en ' +
        evento.lugar +
        ', hasta el ' +
        evento.llegada.toLowerCase() +
        '. La salida es a las ' +
        evento.horaSalidaTexto +
        ' desde ' +
        evento.encuentro +
        ', con horario puntual.',
      'El terreno es irregular: hay pendientes fuertes, piedras sueltas, barro, raíces y cruces de agua. Es una actividad física exigente que pide buena condición y preparación personal.',
    ],
  },
  {
    titulo: '2. Riesgos que conozco y acepto',
    parrafos: [
      'Caídas, resbalones, torceduras, esguinces, fracturas, golpes, cortes y raspaduras.',
      'Frío intenso, lluvia, niebla, viento y cambios bruscos del clima que pueden causar hipotermia, sobre todo de noche en el páramo.',
      'Efectos de la altura y del esfuerzo: mareo, dolor de cabeza, falta de aire, deshidratación, calambres, agotamiento y sobreesfuerzo cardiovascular.',
      'Picaduras o mordeduras de insectos y animales, contacto con plantas que irritan la piel y reacciones alérgicas.',
      'Agravamiento de enfermedades o condiciones que ya tenga, aunque las haya declarado.',
      'Desorientación o extravío si me aparto de la ruta o del grupo.',
      'La organización cuenta con atención médica y paramédicos durante todo el recorrido. Si se necesita atención adicional después de los primeros auxilios, la cubre mi EPS o el seguro que corresponda.',
      'Las actividades extra (cuatrimoto y parapente) tienen riesgos propios y las prestan operadores aliados con sus propias normas, que también debo cumplir.',
    ],
  },
  {
    titulo: '3. Salud y declaración',
    parrafos: [
      'Declaro que la información de salud que entrego es verdadera y completa: enfermedades, alergias, discapacidad, EPS y si practico deporte.',
      'Si tengo una condición de salud, consulté o consultaré a mi médico antes de participar. No participaré si estoy enfermo o lesionado el día del evento.',
      'Entiendo que la organización, los guías o los paramédicos pueden impedir que inicie o continúe el recorrido si mi estado pone en riesgo mi seguridad o la del grupo.',
    ],
  },
  {
    titulo: '4. Normas durante el recorrido',
    parrafos: [
      'Seguiré en todo momento las instrucciones de la organización, los guías, los paramédicos y las autoridades.',
      'No me apartaré de la ruta marcada ni del grupo. Llevaré abrigo, ropa térmica, impermeable, calzado de montaña y agua.',
      'No consumiré bebidas alcohólicas ni sustancias psicoactivas antes ni durante la actividad.',
      'La organización puede retirar del recorrido a quien incumpla estas normas.',
    ],
  },
  {
    titulo: '5. Áreas protegidas y medio ambiente',
    parrafos: [
      'Respetaré las indicaciones y normas de las áreas protegidas y de las autoridades ambientales.',
      'No dejaré basura: me llevo todo lo que traigo. No extraeré plantas, animales, piedras ni otros elementos naturales. No haré fuego fuera de los lugares autorizados y no me saldré de los senderos.',
    ],
  },
  {
    titulo: '6. Pagos y cupos',
    parrafos: [
      'El pago se hace por ' +
        metodoPago.label +
        '. El cupo queda confirmado cuando la organización verifica que el pago llegó.',
      'Si elegí apartar, pagaré el restante en la fecha que escogí, a más tardar el ' +
        evento.plazoTexto +
        '. Si no lo pago en esa fecha, el cupo del kit se libera.',
      'El hotel antes del evento se cobra por noche y por persona, según las fechas que elegí.',
    ],
  },
  {
    titulo: '7. Menores de edad',
    parrafos: [
      'Si el participante que hace la reserva es menor de 18 años, debe enviar por WhatsApp la autorización firmada por su madre, padre o tutor legal. Sin ese documento la organización no aprueba el pago.',
      'Si el acompañante es menor de edad, viaja bajo la responsabilidad del participante que hace la reserva.',
    ],
  },
  {
    titulo: '8. Hoja de consentimiento en el lugar',
    parrafos: [
      'Al llegar al punto de encuentro, cada participante firmará una hoja de consentimiento. Sin firmarla no se puede iniciar el recorrido.',
    ],
  },
  {
    titulo: '9. Datos personales',
    parrafos: [
      'Autorizo a la organización del evento a tratar mis datos personales, incluidos los de salud, que son datos sensibles, para gestionar la inscripción, los pagos, la seguridad durante la actividad y el contacto en caso de emergencia, conforme a la Ley 1581 de 2012.',
      'Entrego los datos de salud de forma voluntaria para mi seguridad. Puedo conocer, actualizar, corregir o pedir que se eliminen mis datos escribiendo al WhatsApp de la organización (+' +
        contacto.whatsapp +
        ').',
      'Si registro los datos de mi acompañante, declaro que él o ella los conoce y autoriza su tratamiento en los mismos términos.',
    ],
  },
  {
    titulo: '10. Uso de imagen (opcional)',
    parrafos: [
      'Si lo autorizo con la casilla correspondiente, la organización puede usar fotos y videos en los que aparezca durante el evento para su difusión. No autorizarlo no afecta mi inscripción.',
    ],
  },
  {
    titulo: '11. Veracidad de los datos',
    parrafos: [
      'Declaro que todos los datos de esta reserva son verdaderos. La organización puede anular una reserva con datos falsos o incompletos.',
    ],
  },
];
