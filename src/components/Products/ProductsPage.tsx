import { useEffect, useCallback, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import { useProductsApi } from "@/hooks/useProductsApi";
import { setProductsList } from "@/stores/productsSlice";
import ProductsForm from "@/components/Products/ProductsForm";
import EditProductModal from "@/components/Products/EditProductModal";

import {
  HiPencil,
  HiTrash,
  HiBriefcase,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";

import type { Product } from "@/types/products";
import "./products.scss";

export default function ProductsPage() {
  const productsList = useAppSelector((state) => state.products.productsList);
  const { getProducts, deleteProduct } = useProductsApi();
  const dispatch = useAppDispatch();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showingProductDetails, setShowingProductDetails] = useState<
    number | null
  >(null);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      if (data) {
        dispatch(setProductsList(data));
      }
    } catch (error) {
      console.error("Erro ao buscar os produtos:", error);
    }
  }, [getProducts, dispatch]);

  function showMore(product: number) {
    if (showingProductDetails === product) {
      setShowingProductDetails(null);
      return;
    }
    setShowingProductDetails(product);
  }

  function handleEditProduct(product: Product) {
    setEditingProduct(product);
  }

  function handleDeleteProduct(product: Product) {
    if (
      window.confirm(
        `Tem certeza que deseja remover o produto ${product.value}?`
      )
    ) {
      // Chama API para deletar
      deleteProduct(product.id)
        .then(() => {
          fetchProducts(); // Recarrega lista após exclusão
        })
        .catch((error) => {
          console.error("Erro ao deletar o produto:", error);
        });
    }
  }
  function handleCloseModal() {
    setEditingProduct(null);
  }

  function handleEditSuccess() {
    fetchProducts(); // Recarrega lista após edição
  }

  useEffect(() => {
    // Só carrega se a store estiver vazia
    if (productsList.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, productsList.length]);

  return (
    <div className="products-page">
      <h3>Produtos cadastrados</h3>
      {productsList.length === 0 ? (
        <p>Você não tem nenhum produto cadastrado.</p>
      ) : (
        <ul className="products-page__products-list list-regular">
          {productsList.map((product) => (
            <li key={product.id}>
              <ul className="list-regular">
                <li onClick={() => showMore(product.id)}>
                  <HiBriefcase /> {product.value}{" "}
                  <button className="btn-small--flat">
                    {showingProductDetails === product.id ? (
                      <>
                        <HiChevronUp /> recolher
                      </>
                    ) : (
                      <>
                        detalhes <HiChevronDown />
                      </>
                    )}
                  </button>
                </li>
                {showingProductDetails === product.id && (
                  <>
                    {product.description ? (
                      <li className="products-page__description">
                        <b>Descrição:</b> {product.description} <br />
                      </li>
                    ) : null}
                    <li>
                      <dl>
                        <dt>Etapas:</dt>
                        <dd>
                          Total de dias:{" "}
                          {product.steps.reduce(
                            (total, step) => total + step.days,
                            0
                          )}
                        </dd>
                        {product.steps.map((step, index) => (
                          <dd key={index}>
                            {step.order}. {step.name} - {step.days} dias
                          </dd>
                        ))}
                      </dl>
                    </li>
                  </>
                )}
              </ul>
              {showingProductDetails === product.id && (
                <div className="btn-wrapper">
                  <button
                    className="btn-small"
                    onClick={() => handleEditProduct(product)}
                  >
                    <HiPencil /> Editar
                  </button>
                  <button
                    className="btn-small"
                    onClick={() => handleDeleteProduct(product)}
                  >
                    <HiTrash /> Remover produto {product.value}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {editingProduct && (
        <EditProductModal
          isOpen={!!editingProduct}
          onClose={handleCloseModal}
          product={editingProduct}
          onSuccess={handleEditSuccess}
        />
      )}

      <section className="products-page__form-section">
        <ProductsForm onSuccess={fetchProducts} />
      </section>
    </div>
  );
}
