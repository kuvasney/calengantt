import { useState } from "react";
import Modal from "../../Modal/Modal";

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

  const footer = (
    <>
      {/* <button
        className="btn-default"
        onClick={onClose}
        disabled={loading}
        type="button"
      >
        Cancelar
      </button> */}
      <button
        className="btn-default"
        onClick={handleSave}
        disabled={loading}
        type="button"
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      <div className="input-field--pretty">
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
    </Modal>
  );
}
