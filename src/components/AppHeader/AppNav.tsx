import { Link } from "react-router-dom";

export default function AppNav() {
  return (
    <nav className="app-nav">
      <ul>
        <li>
          <Link to="/calendar">Calendário</Link>
        </li>
        <li>
          <Link to="/products">Produtos</Link>
        </li>
      </ul>
    </nav>
  );
}
