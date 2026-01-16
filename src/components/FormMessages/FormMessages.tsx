import { HiExclamation, HiCheckCircle } from "react-icons/hi";

import "./formMessages.scss";

type FormMessageProps = {
  type: "error" | "success" | "info";
  children: React.ReactNode;
};

export default function FormMessages({ type, children }: FormMessageProps) {
  return (
    <div className={`form-message form-${type}`}>
      <span className="icon">
        {type === "success" ? <HiCheckCircle /> : <HiExclamation />}
      </span>
      {children}
    </div>
  );
}
