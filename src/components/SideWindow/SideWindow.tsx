import type { ReactNode } from "react";
import "./SideWindow.scss";

interface SideWindowProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  title?: string;
  position?: "left" | "right";
}

export default function SideWindow({
  isOpen,
  onClose,
  children,
  title,
  position = "right",
}: SideWindowProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="side-window__overlay" onClick={onClose} />
      <div
        className={`side-window side-window--${position}`}
        data-open={isOpen}
      >
        <div className="side-window__header">
          {title && (
            <h2 className="side-window__title calangar-font">{title}</h2>
          )}
          <button
            className="side-window__close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <div className="side-window__content">{children}</div>
      </div>
    </>
  );
}
