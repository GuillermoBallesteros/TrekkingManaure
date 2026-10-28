/**
 * Props de un radio que se desmarca con un segundo clic sobre la opción ya marcada.
 * `vacio` es el valor que significa "sin elegir".
 */
export function opcionDesmarcable<T>(actual: T, valor: T, cambiar: (valor: T) => void, vacio: T) {
  return {
    checked: actual === valor,
    onClick: () => {
      if (actual === valor) cambiar(vacio);
    },
    onChange: () => cambiar(valor),
  };
}
