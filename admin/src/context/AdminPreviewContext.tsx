import { createContext, useContext, useState, type ReactNode } from 'react';
import { cupos } from '../../../shared/config';
import { todayInColombia } from '../../../shared/utils/format';
import { demoRegistrations } from '../data/comun/demo';
import type { PaymentReview, Registration } from '../types/participante';
import {
  appendApprovedPayment,
  applyReview,
  type NewPayment,
} from '../utils/pagos/actualizaciones';

type PreviewContext = {
  registrations: Registration[];
  today: string;
  capacity: number;
  setCapacity: (value: number) => void;
  reviewPayment: (
    registrationId: string,
    paymentId: string,
    review: PaymentReview,
    reason?: string | null,
  ) => void;
  addPayment: (registrationId: string, payment: NewPayment) => void;
  focusPaymentId: string | null;
  setFocusPaymentId: (id: string | null) => void;
};

const Context = createContext<PreviewContext | null>(null);

export function AdminPreviewProvider({ children }: { children: ReactNode }) {
  const [registrations, setRegistrations] = useState(demoRegistrations);
  const [capacity, setCapacity] = useState<number>(cupos.iniciales);
  const [focusPaymentId, setFocusPaymentId] = useState<string | null>(null);
  const today = todayInColombia();

  function reviewPayment(
    registrationId: string,
    paymentId: string,
    review: PaymentReview,
    reason: string | null = null,
  ) {
    setRegistrations((current) => applyReview(current, registrationId, paymentId, review, reason));
  }

  function addPayment(registrationId: string, payment: NewPayment) {
    setRegistrations((current) => appendApprovedPayment(current, registrationId, payment, today));
  }

  return (
    <Context.Provider
      value={{
        registrations,
        today,
        capacity,
        setCapacity,
        reviewPayment,
        addPayment,
        focusPaymentId,
        setFocusPaymentId,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAdminPreview() {
  const context = useContext(Context);
  if (!context) throw new Error('El panel requiere AdminPreviewProvider.');
  return context;
}
