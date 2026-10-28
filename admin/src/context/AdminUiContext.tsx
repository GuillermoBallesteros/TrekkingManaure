import { createContext, useContext, useState, type ReactNode } from 'react';

// Estado de interfaz del panel que comparten varias páginas. Los datos de reservas no viven
// aquí: se leen con useReservas() y se cambian con reservasApi (shared/reservas).
type UiContext = {
  /** Pago que la página de Pagos debe abrir seleccionado al llegar desde otra vista. */
  focusPaymentId: string | null;
  setFocusPaymentId: (id: string | null) => void;
};

const Context = createContext<UiContext | null>(null);

export function AdminUiProvider({ children }: { children: ReactNode }) {
  const [focusPaymentId, setFocusPaymentId] = useState<string | null>(null);

  return (
    <Context.Provider value={{ focusPaymentId, setFocusPaymentId }}>{children}</Context.Provider>
  );
}

export function useAdminUi() {
  const context = useContext(Context);
  if (!context) throw new Error('El panel requiere AdminUiProvider.');
  return context;
}
