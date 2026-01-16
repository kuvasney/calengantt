import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserApi } from "@/hooks/useUserApi";
import { APP_CONFIG } from "@/config/app";
import { useAppDispatch } from "@/stores/hooks";
import LoaderComponent from "../Loader/LoaderComponent";
import SocialLogin from "../SocialLogin";
import { CgEye, CgEyeAlt, CgLock } from "react-icons/cg";
import type { UserCredentials, LoginResponse } from "@/types/user";

import "./loginForm.scss";
import FormMessages from "../FormMessages/FormMessages";

export default function LoginForm() {
  const { userLogin } = useUserApi();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      <form className="login-form" onSubmit={handleLogin}>
        <fieldset className="fieldset-regular">
          <legend>
            Identifique-se para acessar o{" "}
            <span className="calangar-font">{APP_CONFIG.appName}</span>
          </legend>
          <div className="input-field-pretty">
            <span className="form-icon">@</span>
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
          <div className="input-field-pretty">
            <span className="form-icon">
              <CgLock />
            </span>
            <label htmlFor="password" className="login-form__password">
              Senha:
              <button
                className="btn-flat login-form__see-password"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <CgEye /> : <CgEyeAlt />}
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
            <Link
              to="/forgot-password"
              className="link-default login-form__forgot-password"
            >
              Esqueci minha senha
            </Link>
          </div>
          <div className="form-field login-form__submit-field">
            <button className="btn-submit login-form__submit" type="submit">
              Entrar
            </button>
            {loading && <LoaderComponent />}
          </div>
          {error && <FormMessages type="error">{error}</FormMessages>}
          <SocialLogin />
        </fieldset>
      </form>
    </div>
  );
}
