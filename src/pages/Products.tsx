import { useEffect, useCallback, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import { useProductsApi } from "@/hooks/useProductsApi";
import { setProductsList } from "@/stores/productsSlice";
import ProductsForm from "@/components/Products/ProductsForm";
import EditProductModal from "@/components/Products/EditProductModal";

import type { Product } from "@/types/products";

export default function Products() {
  const productsList = useAppSelector((state) => state.products.productsList);
  const { getProducts, deleteProduct } = useProductsApi();
  const dispatch = useAppDispatch();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
      <h2>Produtos</h2>
      {productsList.length === 0 ? (
        <p>Você não tem nenhum produto cadastrado.</p>
      ) : (
        <ul>
          {productsList.map((product) => (
            <li key={product.id}>
              <ul>
                <li>
                  <b>Nome do produto:</b> {product.value}
                </li>
                {product.description ? (
                  <li>
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
              </ul>
              <div className="btn-wrapper">
                <button
                  className="btn-default btn-small"
                  onClick={() => handleEditProduct(product)}
                >
                  Editar produto {product.value}
                </button>
                <button
                  className="btn-default btn-small"
                  onClick={() => handleDeleteProduct(product)}
                >
                  Remover produto {product.value}
                </button>
              </div>
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
        <ProductsForm />
      </section>
    </div>
  );
}
