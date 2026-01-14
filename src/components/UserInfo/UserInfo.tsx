import { useAppDispatch } from "@/stores/hooks";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import "./userInfo.scss";

export default function UserInfo() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useCurrentUser();

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    dispatch({ type: "user/clearUser" });
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-info">
      <span className="user-name">Olá, {user.name}</span>
      <button className="btn-small btn-logout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
