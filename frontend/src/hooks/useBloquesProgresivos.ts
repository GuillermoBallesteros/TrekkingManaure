import { useEffect, useState, type RefObject } from 'react';

type CampoFormulario = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * Muestra los bloques del formulario uno a uno. Cada bloque marcado con `data-bloque` es
 * visible cuando todos los campos del bloque anterior son válidos. Un bloque ya mostrado se
 * queda visible aunque después se cambie un dato.
 */
export function useBloquesProgresivos(formRef: RefObject<HTMLFormElement | null>) {
  const [visibles, setVisibles] = useState(1);

  function revisar() {
    const form = formRef.current;
    if (!form) return;

    const bloques = Array.from(form.querySelectorAll<HTMLElement>('[data-bloque]'));
    let cuantos = 1;

    // El último bloque (el de envío) no se evalúa: aparece cuando todos los anteriores están listos.
    for (let indice = 0; indice < bloques.length - 1; indice += 1) {
      const campos = bloques[indice].querySelectorAll<CampoFormulario>('input, select, textarea');
      const completo = Array.from(campos).every((campo) => campo.checkValidity());
      if (!completo) break;
      cuantos = indice + 2;
    }

    setVisibles((actual) => Math.max(actual, cuantos));
  }

  // Tras cada render (por ejemplo, al desmarcar una opción) se vuelve a revisar.
  useEffect(() => {
    revisar();
  });

  return { visibles, revisar };
}
