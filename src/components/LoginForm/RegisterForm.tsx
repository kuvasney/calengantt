import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserApi } from "@/hooks/useUserApi";
import { APP_CONFIG } from "@/config/app";
import LoaderComponent from "../Loader/LoaderComponent";
// import SocialLogin from "../SocialLogin";
import FormMessages from "../FormMessages/FormMessages";
import { CgLock, CgUser, CgEye, CgEyeAlt } from "react-icons/cg";

import "./loginForm.scss";

export default function RegisterForm() {
  const { registerUser } = useUserApi();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    setSuccessMessage([]);

    if (!fullName || !email || !password) {
      setFormErrors((prev) => [
        ...prev,
        "Por favor, preencha todos os campos.",
      ]);
      return;
    }

    setLoading(true);
    try {
      await registerUser({ fullName, email, password });
      setSuccessMessage(["Registro bem-sucedido!"]);
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      setFormErrors((prev) => [
        ...prev,
        "Erro ao tentar registrar. Por favor, tente novamente.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleRegister}>
        <fieldset className="fieldset-regular">
          <legend>
            Registre-se para acessar o{" "}
            <span className="calangar-font">{APP_CONFIG.appName}</span>
          </legend>
          <div className="input-field--pretty">
            <span className="form-icon">
              <CgUser />
            </span>
            <label htmlFor="fullName">Nome Completo:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="input-field--pretty">
            <span className="form-icon">@</span>
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-field--pretty">
            <label htmlFor="password" className="login-form__password">
              <span className="form-icon">
                <CgLock />
              </span>
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
            />
          </div>
          {formErrors.length > 0 && (
            <FormMessages type="error" messages={formErrors} />
          )}
          {successMessage.length > 0 && (
            <div className="form-success">
              <FormMessages type="success" messages={successMessage} />
              Você pode agora fazer <Link to="/">login</Link>.
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="btn-default" disabled={loading}>
              {loading ? <LoaderComponent /> : "Registrar"}
            </button>
          </div>
          {/* <SocialLogin /> */}
        </fieldset>
      </form>
    </div>
  );
}
