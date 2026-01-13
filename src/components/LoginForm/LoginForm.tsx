import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserApi } from "@/hooks/useUserApi";
import useGoogleAuth from "@/hooks/useGoogleAuth";
import { APP_CONFIG } from "@/config/app";
import { useAppDispatch } from "@/stores/hooks";
import LoaderComponent from "../Loader/LoaderComponent";

import type { UserCredentials, LoginResponse } from "@/types/user";

import "./loginForm.scss";

export default function LoginForm() {
  const { userLogin } = useUserApi();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loginWithGoogle } = useGoogleAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Por favor, preencha o e-mail e a senha.");
      return;
    }

    setLoading(true);
    try {
      const loginData: UserCredentials = { email: username, password };
      const loginResponse: LoginResponse = await userLogin(
        loginData as UserCredentials
      );
      if (loginResponse) {
        sessionStorage.setItem("accessToken", loginResponse.accessToken);
        sessionStorage.setItem("refreshToken", loginResponse.refreshToken);
        sessionStorage.setItem("user", JSON.stringify(loginResponse.user));
        dispatch({ type: "user/setUser", payload: loginResponse.user });
        navigate("/calendar");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Erro ao tentar fazer login. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <form className="form-regular login-form" onSubmit={handleLogin}>
        <fieldset>
          <legend>Identifique-se para acessar o {APP_CONFIG.appName}</legend>
          <div className="form-field size3-field">
            <label htmlFor="username">E-mail:</label>
            <input
              type="email"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-field size3-field">
            <label htmlFor="password" className="login-form__password">
              Senha:
              <button
                className="btn-link login-form__see-password"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar senha" : "Ver senha"}
              </button>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <button
              className="btn-google login-form__google-login"
              type="button"
              onClick={loginWithGoogle}
            >
              Entrar com Google
            </button>
          </div>
          <div className="form-field login-form__submit-field">
            <button className="btn-default login-form__submit" type="submit">
              Entrar
            </button>
            {loading && <LoaderComponent />}
          </div>
          {error && <div className="login-form__error-message">{error}</div>}
          <div className="form-field">
            <a href="/forgot-password" className="login-form__forgot-password">
              Esqueci minha senha
            </a>
          </div>
        </fieldset>
      </form>
      <div className="login-form__data-info">
        <p>
          Caso você ainda não tenha uma conta,{" "}
          <a href="/register">registre-se aqui</a>.
        </p>
      </div>
    </div>
  );
}
