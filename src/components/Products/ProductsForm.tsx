import { useState, useEffect } from "react";
import { useProductsApi } from "@/hooks/useProductsApi";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoaderComponent from "../Loader/LoaderComponent";
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
  const [productStepDays, setProductStepDays] = useState<number[]>([0]);
  const [actualStepIndex, setActualStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      setErrorMessage("Um produto deve ter ao menos uma etapa.");
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
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!productName.trim()) {
      setErrorMessage("O nome do produto é obrigatório.");
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
          productData as Product
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
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!"
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
      setErrorMessage("Erro ao salvar o produto. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="form-regular products-form" onSubmit={handleSubmit}>
      {isLoading && <LoaderComponent />}
      <fieldset>
        <legend>
          {isEditing ? "Editar Produto" : "Adicionar Novo Produto"}
        </legend>
        <div className="form-field">
          <label htmlFor="productName">Nome do Produto:</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="productDescription">Descrição do Produto:</label>
          <textarea
            id="productDescription"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          ></textarea>
        </div>
      </fieldset>
      <label>Etapas do Produto:</label>
      {productStepName.map((stepName, index) => (
        <fieldset key={index}>
          <legend>Etapa {index + 1}</legend>
          <div className="form-inline">
            <div className="form-field size3-field">
              <label htmlFor={`stepName-${index}`}>Nome da Etapa:</label>
              <input
                type="text"
                id={`stepName-${index}`}
                value={stepName}
                onChange={(e) => {
                  const newStepNames = [...productStepName];
                  newStepNames[index] = e.target.value;
                  setProductStepName(newStepNames);
                }}
              />
            </div>
            <div className="form-field size2-field">
              <label htmlFor={`stepDays-${index}`}>Duração (dias):</label>
              <input
                type="number"
                id={`stepDays-${index}`}
                value={productStepDays[index]}
                onChange={(e) => {
                  const newStepDays = [...productStepDays];
                  newStepDays[index] = Number(e.target.value);
                  setProductStepDays(newStepDays);
                }}
              />
            </div>
          </div>
          <button
            type="button"
            className="btn-danger btn-small"
            onClick={() => handleRemoveStep(index)}
          >
            Remover Etapa
          </button>
        </fieldset>
      ))}
      <button
        type="button"
        className="btn-default btn-small"
        onClick={handleAddStep}
      >
        Adicionar Etapa
      </button>
      {errorMessage && (
        <div className="products-form__error-message">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="products-form__success-message">{successMessage}</div>
      )}
      <button type="submit" className="btn-default btn-submit">
        {isEditing ? "Atualizar Produto" : "Salvar Produto"}
      </button>
    </form>
  );
}
