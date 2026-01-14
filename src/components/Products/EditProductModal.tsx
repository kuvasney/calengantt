import Modal from "../Modal/Modal";
import ProductsForm from "./ProductsForm";
import type { Product } from "@/types/products";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSuccess: () => void;
}

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: EditProductModalProps) {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar ${product.value}`}>
      <ProductsForm initialProduct={product} onSuccess={handleSuccess} />
    </Modal>
  );
}
