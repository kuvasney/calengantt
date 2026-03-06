import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/stores/hooks";
import {
  HiMenu,
  HiOutlineCalendar,
  HiOutlineLogout,
  HiOutlineBriefcase,
  HiOutlineBeaker,
} from "react-icons/hi";

import UserInfo from "../UserInfo/UserInfo";

export default function AppNav() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [menuOpened, setMenuOpened] = useState(false);

  const closeMenu = () => setMenuOpened(false);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    dispatch({ type: "user/clearUser" });
    closeMenu();
    navigate("/");
  };
  return (
    <nav className={menuOpened ? "app-nav openned" : "app-nav"}>
      <button
        className="btn-flat btn-menu"
        onClick={() => setMenuOpened(!menuOpened)}
      >
        <HiMenu />
      </button>
      <div
        className={
          menuOpened ? "app-nav__navigator openned" : "app-nav__navigator"
        }
      >
        <UserInfo />
        <ul>
          <li>
            <Link to="/calendar" onClick={closeMenu}>
              <HiOutlineCalendar /> Calendário
            </Link>
          </li>
          <li>
            <Link to="/products" onClick={closeMenu}>
              <HiOutlineBeaker /> Produtos
            </Link>
          </li>
          <li>
            <Link to="/projects" onClick={closeMenu}>
              <HiOutlineBriefcase /> Projetos
            </Link>
          </li>
          <li>
            <button className="btn-flat" onClick={handleLogout}>
              <HiOutlineLogout /> Sair
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
