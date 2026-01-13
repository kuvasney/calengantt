import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserApi } from "@/hooks/useUserApi";
import { APP_CONFIG } from "@/config/app";
import LoaderComponent from "../Loader/LoaderComponent";

import "./loginForm.scss";

export default function RegisterForm() {
  const { registerUser } = useUserApi();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ fullName, email, password });
      setSuccessMessage("Registro bem-sucedido!");
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      setError("Erro ao tentar registrar. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <form className="form-regular login-form" onSubmit={handleRegister}>
        <fieldset>
          <legend>Registre-se para acessar o {APP_CONFIG.appName}</legend>
          <div className="form-field size3-field">
            <label htmlFor="fullName">Nome Completo:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="form-field size3-field">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          {successMessage && (
            <div className="form-success">
              {successMessage} Você pode agora fazer <Link to="/">login</Link>.
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="btn-default" disabled={loading}>
              {loading ? <LoaderComponent /> : "Registrar"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
