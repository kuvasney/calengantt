import { useAppSelector } from "@/stores/hooks";
import ProductsForm from "@/components/Products/ProductsForm";

export default function Products() {
  const productsList = useAppSelector((state) => state.products.productsList);

  return (
    <div className="products-page">
      <h2>Produtos</h2>
      {productsList.length === 0 ? (
        <p>Você não tem nenhum produto cadastrado.</p>
      ) : (
        <ul>
          {productsList.map((product) => (
            <li key={product.id}>
              {product.value} - {product.description}
            </li>
          ))}
        </ul>
      )}
      <section className="products-page__form-section">
        <ProductsForm />
      </section>
    </div>
  );
}
