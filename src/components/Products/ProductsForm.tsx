import { useState } from "react";
import { useProductsApi } from "@/hooks/useProductsApi";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoaderComponent from "../Loader/LoaderComponent";
import type { ProductStep, Product } from "@/types/products";

export default function ProductsForm() {
  const { postProduct } = useProductsApi();
  const currentUser = useCurrentUser();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productStepName, setProductStepName] = useState<string[]>([""]);
  const [productStepDays, setProductStepDays] = useState<number[]>([0]);
  const [actualStepIndex, setActualStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  async function handleAddProduct(e: React.FormEvent) {
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
    console.log("current user:", currentUser);
    const productData = {
      value: productName.trim(),
      description: productDescription.trim(),
      userId: currentUser?.id || "",
      steps,
    };

    try {
      const productResponse = await postProduct(productData as Product);
      if (!productResponse) {
        throw new Error("Resposta inválida ao criar o produto");
      }

      setSuccessMessage("Produto criado com sucesso!");
      setProductName("");
      setProductDescription("");
      setProductStepName([""]);
      setProductStepDays([0]);
      setActualStepIndex(0);
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
      setErrorMessage("Erro ao criar o produto. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="form-regular products-form" onSubmit={handleAddProduct}>
      {isLoading && <LoaderComponent />}
      <fieldset>
        <legend>Adicionar Novo Produto</legend>
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
        Salvar Produto
      </button>
    </form>
  );
}
