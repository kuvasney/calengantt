import { CgRedo } from "react-icons/cg";
import "./refreshButton.scss";

interface RefreshButtonProps {
  onClick: () => void;
  label?: string;
}

export default function RefreshButton({ onClick, label }: RefreshButtonProps) {
  return (
    <button
      className="btn-default iconic refresh-button"
      type="button"
      onClick={onClick}
      title={label || "Atualizar"}
    >
      <span className="icon">
        <CgRedo />
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}
