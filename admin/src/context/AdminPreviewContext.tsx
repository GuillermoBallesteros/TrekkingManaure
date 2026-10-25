import { createContext, useContext, useState, type ReactNode } from 'react';
import { cupos } from '../../../shared/config';
import { demoParticipants } from '../data/demo';
import type { Participant, PaymentStatus } from '../types/participante';

type PreviewContext = {
  participants: Participant[];
  capacity: number;
  setCapacity: (value: number) => void;
  setPaymentStatus: (id: string, status: PaymentStatus) => void;
};

const Context = createContext<PreviewContext | null>(null);

export function AdminPreviewProvider({ children }: { children: ReactNode }) {
  const [participants, setParticipants] = useState(demoParticipants);
  const [capacity, setCapacity] = useState<number>(cupos.iniciales);

  function setPaymentStatus(id: string, status: PaymentStatus) {
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === id ? { ...participant, status } : participant,
      ),
    );
  }

  return (
    <Context.Provider value={{ participants, capacity, setCapacity, setPaymentStatus }}>
      {children}
    </Context.Provider>
  );
}

export function useAdminPreview() {
  const context = useContext(Context);
  if (!context) throw new Error('El panel requiere AdminPreviewProvider.');
  return context;
}
