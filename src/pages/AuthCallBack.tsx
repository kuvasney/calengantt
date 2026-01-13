import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/stores/hooks";
import { useUserApi } from "@/hooks/useUserApi";

export default function AuthCallBack() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { getUserProfile } = useUserApi();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Evitar processamento duplo (React StrictMode)
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const googleAccessToken = urlParams.get("accessToken");
    const googleRefreshToken = urlParams.get("refreshToken");

    if (googleAccessToken && googleRefreshToken) {
      // Salvar tokens no sessionStorage
      sessionStorage.setItem("accessToken", googleAccessToken);
      sessionStorage.setItem("refreshToken", googleRefreshToken);

      // Buscar dados do usuário usando o hook
      getUserProfile()
        .then((user) => {
          // Salvar usuário na store e sessionStorage
          sessionStorage.setItem("user", JSON.stringify(user));
          dispatch({ type: "user/setUser", payload: user });

          // Redirecionar para a página do calendário
          navigate("/calendar", { replace: true });
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do usuário:", error);
          navigate("/?error=fetch_user_failed", { replace: true });
        });
    } else {
      // Em caso de erro, redirecionar para a página de login
      navigate("/?error=missing_tokens", { replace: true });
    }
  }, [navigate, dispatch, getUserProfile]);

  return (
    <div>
      <div>
        <h1>Autenticando...</h1>
        <p>Aguarde enquanto redirecionamos você.</p>
      </div>
    </div>
  );
}
