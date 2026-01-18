import { HiRefresh } from "react-icons/hi";
import "./refreshButton.scss";

interface RefreshButtonProps {
  onClick: () => void;
  label?: string;
}

export default function RefreshButton({ onClick, label }: RefreshButtonProps) {
  return (
    <button
      className="btn-default"
      type="button"
      onClick={onClick}
      title={label || "Atualizar"}
    >
      <span className="icon">
        <HiRefresh />
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}
