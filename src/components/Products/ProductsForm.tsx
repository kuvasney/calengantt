import { useState, useEffect } from "react";
import { useProductsApi } from "@/hooks/useProductsApi";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoaderComponent from "../Loader/LoaderComponent";
import FormMessages from "../FormMessages/FormMessages";
import { HiTrash } from "react-icons/hi";
import type { ProductStep, Product } from "@/types/products";

interface ProductsFormProps {
  initialProduct?: Product;
  onSuccess?: () => void;
}

export default function ProductsForm({
  initialProduct,
  onSuccess,
}: ProductsFormProps) {
  const { postProduct, updateProduct } = useProductsApi();
  const currentUser = useCurrentUser();

  const isEditing = !!initialProduct;

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productStepName, setProductStepName] = useState<string[]>([""]);
  const [productStepDays, setProductStepDays] = useState<number[]>([]);
  const [actualStepIndex, setActualStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string[]>([]);

  // Popular formulário ao editar
  useEffect(() => {
    if (initialProduct) {
      setProductName(initialProduct.value);
      setProductDescription(initialProduct.description || "");
      const stepNames = initialProduct.steps.map((s) => s.name);
      const stepDays = initialProduct.steps.map((s) => s.days);
      setProductStepName(stepNames);
      setProductStepDays(stepDays);
    }
  }, [initialProduct]);

  function handleAddStep(step: React.FormEvent) {
    step.preventDefault();
    setActualStepIndex(actualStepIndex + 1);
    setProductStepName([...productStepName, ""]);
    setProductStepDays([...productStepDays, 0]);
  }

  function handleRemoveStep(index: number) {
    if (productStepName.length === 1) {
      setFormErrors((prev) => [
        ...prev,
        "Um produto deve ter ao menos uma etapa.",
      ]);
      return;
    }

    const newStepNames = productStepName.filter((_, i) => i !== index);
    const newStepDays = productStepDays.filter((_, i) => i !== index);
    setProductStepName(newStepNames);
    setProductStepDays(newStepDays);
    setActualStepIndex(actualStepIndex - 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors([]);
    setSuccessMessage([]);
    setIsLoading(true);

    if (!productName.trim()) {
      setFormErrors((prev) => [...prev, "O nome do produto é obrigatório."]);
      setIsLoading(false);
      return;
    }

    const steps: ProductStep[] = productStepName.map((name, index) => ({
      name: name.trim() || `Etapa ${index + 1}`,
      days: productStepDays[index] || 0,
      order: index + 1,
    }));

    const productData = {
      value: productName.trim(),
      description: productDescription.trim(),
      userId: currentUser?.id || "",
      steps,
    };

    try {
      let productResponse;

      if (isEditing && initialProduct) {
        // Atualizar produto existente
        productResponse = await updateProduct(
          initialProduct.id,
          productData as Product,
        );
      } else {
        // Criar novo produto
        productResponse = await postProduct(productData as Product);
      }

      if (!productResponse) {
        throw new Error("Resposta inválida ao salvar o produto");
      }

      setSuccessMessage(
        isEditing
          ? ["Produto atualizado com sucesso!"]
          : ["Produto criado com sucesso!"],
      );

      if (!isEditing) {
        // Só limpa se for criação
        setProductName("");
        setProductDescription("");
        setProductStepName([""]);
        setProductStepDays([0]);
        setActualStepIndex(0);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar o produto:", error);
      setFormErrors((prev) => [
        ...prev,
        "Erro ao salvar o produto. Por favor, tente novamente.",
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="products-form__wrapper">
      <h2>{isEditing ? "Editar produto" : "Adicionar Novo Produto"}</h2>
      <form className="form-regular products-form" onSubmit={handleSubmit}>
        {isLoading && <LoaderComponent />}
        <fieldset className="fieldset-regular">
          <legend>{isEditing ? "Editar Produto" : "Sobre o Produto"}</legend>
          <div className="form-field--pretty">
            <label htmlFor="productName">Nome do Produto:</label>
            <input
              type="text"
              id="productName"
              value={productName}
              placeholder="Nome que será exibido na lista de produtos"
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div className="form-field--pretty">
            <label htmlFor="productDescription">Descrição do Produto:</label>
            <textarea
              id="productDescription"
              value={productDescription}
              placeholder="A descrição do produto é opcional"
              onChange={(e) => setProductDescription(e.target.value)}
            ></textarea>
          </div>
        </fieldset>
        <label>Etapas do Produto:</label>
        {productStepName.map((stepName, index) => (
          <fieldset key={index} className="fieldset-regular">
            <legend>Etapa {index + 1}</legend>
            <div className="form-inline">
              <div className="form-field--pretty">
                <label htmlFor={`stepName-${index}`}>
                  Nome da Etapa: <br />
                  <span className="label-text--small">
                    Se mais de uma etapa pode ser feita no mesmo dia, adicione
                    todas.
                  </span>
                </label>
                <input
                  type="text"
                  id={`stepName-${index}`}
                  value={stepName}
                  placeholder="Este nome será exibido no detalhe"
                  required
                  onChange={(e) => {
                    const newStepNames = [...productStepName];
                    newStepNames[index] = e.target.value;
                    setProductStepName(newStepNames);
                  }}
                />
              </div>
              <div className="form-field--pretty">
                <label htmlFor={`stepDays-${index}`}>Duração (dias):</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Mínima de 1 dia"
                  required
                  id={`stepDays-${index}`}
                  value={
                    productStepDays[index] === 0 ? "" : productStepDays[index]
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    // Permite apenas números inteiros positivos ou vazio
                    if (/^\d*$/.test(value)) {
                      const newStepDays = [...productStepDays];
                      newStepDays[index] = value === "" ? 0 : Number(value);
                      setProductStepDays(newStepDays);
                    } else {
                      setFormErrors((prev) => [
                        ...prev,
                        "A duração de uma etapa deve ser de pelo menos 1 dia",
                      ]);
                    }
                  }}
                />
              </div>
            </div>
            {index !== 0 && (
              <button
                type="button"
                className="btn-small"
                onClick={() => handleRemoveStep(index)}
              >
                <HiTrash />
                Remover Etapa
              </button>
            )}
          </fieldset>
        ))}
        <button
          type="button"
          className="btn-default btn-small"
          onClick={handleAddStep}
        >
          Adicionar etapa
        </button>
        {formErrors.length > 0 && (
          <FormMessages
            messages={formErrors}
            type="error"
            duration={5000}
            key={formErrors.join()}
          />
        )}
        {successMessage.length > 0 && (
          <FormMessages
            messages={successMessage}
            type="success"
            duration={5000}
            key={successMessage.join()}
          />
        )}
        <button type="submit" className="btn-default btn-submit">
          {isEditing ? "Atualizar Produto" : "Salvar Produto"}
        </button>
      </form>
    </div>
  );
}
