import { useState, useEffect } from "react";
import { HiExclamation, HiCheckCircle, HiX } from "react-icons/hi";

import "./formMessages.scss";

type FormMessageProps = {
  type: "error" | "success" | "info";
  messages: string[];
  duration?: number;
  onClose?: () => void;
  autoHide?: boolean;
};

export default function FormMessages({
  type,
  messages,
  duration = 4000,
  onClose,
  autoHide = true,
}: FormMessageProps) {
  const [isVisible, setIsVisible] = useState(false); // Inicializa como false para animação de entrada

  // Efeito para disparar a animação de entrada no mount (com delay mínimo para evitar cascading renders)
  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 0); // Delay mínimo para permitir render inicial invisível
    return () => clearTimeout(enterTimer);
  }, []);

  // Efeito para disparar a animação de saída após duration
  useEffect(() => {
    if (!autoHide || !isVisible) return;

    const exitTimer = setTimeout(() => {
      setIsVisible(false);
      // Aguarda a animação de saída antes de chamar onClose
      setTimeout(() => {
        onClose?.();
      }, 300); // Tempo da transição CSS
    }, duration);

    return () => clearTimeout(exitTimer);
  }, [autoHide, duration, onClose, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  return (
    <>
      {messages.length > 0 && (
        <div
          className={`form-messages form-${type} ${isVisible ? "isVisible" : "isHidden"}`}
        >
          <button
            className="btn-small--flat form-messages__close"
            type="button"
            onClick={handleClose}
          >
            fechar <HiX />
          </button>
          {messages.map((message, index) => (
            <div className={`form-message form-${type}`} key={index}>
              <span className="icon">
                {type === "success" ? <HiCheckCircle /> : <HiExclamation />}
              </span>
              {message}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
