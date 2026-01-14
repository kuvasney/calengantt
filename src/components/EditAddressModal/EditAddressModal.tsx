import { useState } from "react";
import Modal from "../Modal/Modal";

interface Address {
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  city: string;
  state: string;
}

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => Promise<void>;
  currentAddress: Address;
}

export default function EditAddressModal({
  isOpen,
  onClose,
  onSave,
  currentAddress,
}: EditAddressModalProps) {
  const [address, setAddress] = useState<Address>(currentAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (
      !address.zipCode ||
      !address.street ||
      !address.city ||
      !address.state
    ) {
      setError("Preencha os campos obrigatórios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSave(address);
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
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Endereço"
      footer={footer}
    >
      <div className="form-field">
        <label htmlFor="zipCode">CEP *</label>
        <input
          type="text"
          id="zipCode"
          value={address.zipCode}
          onChange={(e) => handleChange("zipCode", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="street">Rua *</label>
        <input
          type="text"
          id="street"
          value={address.street}
          onChange={(e) => handleChange("street", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="number">Número</label>
        <input
          type="text"
          id="number"
          value={address.number}
          onChange={(e) => handleChange("number", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="complement">Complemento</label>
        <input
          type="text"
          id="complement"
          value={address.complement || ""}
          onChange={(e) => handleChange("complement", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="neighborhood">Bairro</label>
        <input
          type="text"
          id="neighborhood"
          value={address.neighborhood}
          onChange={(e) => handleChange("neighborhood", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="city">Cidade *</label>
        <input
          type="text"
          id="city"
          value={address.city}
          onChange={(e) => handleChange("city", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="state">Estado *</label>
        <input
          type="text"
          id="state"
          value={address.state}
          onChange={(e) => handleChange("state", e.target.value)}
          disabled={loading}
          maxLength={2}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
    </Modal>
  );
}
