import type { ReactNode } from 'react';

export default function ModalBackdrop({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <>
      <div
        id="modal-backdrop"
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(2px)', zIndex: 40 }}
      />
      {children}
    </>
  );
}
