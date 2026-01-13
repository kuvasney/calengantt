import { useState } from "react";

interface EditFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => Promise<void>;
  title: string;
  fieldLabel: string;
  fieldType?: "text" | "date";
  currentValue: string;
}

export default function EditFieldModal({
  isOpen,
  onClose,
  onSave,
  title,
  fieldLabel,
  fieldType = "text",
  currentValue,
}: EditFieldModalProps) {
  const [value, setValue] = useState(currentValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!value.trim()) {
      setError("Campo obrigatório");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSave(value);
      onClose();
    } catch (err) {
      setError("Erro ao salvar. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-field">
            <label htmlFor="edit-field">{fieldLabel}</label>
            <input
              type={fieldType}
              id="edit-field"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="modal-footer">
          <button
            className="btn-default"
            onClick={onClose}
            disabled={loading}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={loading}
            type="button"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
