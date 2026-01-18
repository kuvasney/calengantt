import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductsPage from "@/components/Products/ProductsPage";
import SideWindow from "@/components/SideWindow/SideWindow";

export default function Products() {
  const navigate = useNavigate();

  const [isSideWindowOpenned, setIsSideWindowOpenned] = useState<boolean>(true);

  async function handleClosePage() {
    setIsSideWindowOpenned(false);
    navigate("/calendar");
  }

  return (
    <SideWindow
      isOpen={isSideWindowOpenned}
      onClose={handleClosePage}
      title="Produtos"
    >
      <ProductsPage />
    </SideWindow>
  );
}
