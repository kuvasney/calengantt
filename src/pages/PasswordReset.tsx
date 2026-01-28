import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineCalendar } from "react-icons/hi";
import { APP_CONFIG } from "@/config/app";
import { useUserApi } from "@/hooks/useUserApi";
import PasswordInput from "@/components/PasswordInput";
import FormMessages from "@/components/FormMessages/FormMessages";
import LoaderComponent from "@/components/Loader/LoaderComponent";

export default function PasswordReset() {
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { updateUserPassword } = useUserApi();

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors([]);
    setLoading(true);

    const url = window.location.href;
    const params = new URL(url).searchParams;
    const token = params.get("token");

    if (!password) {
      setFormErrors(["É necessário preencher uma senha!"]);
      setLoading(false);
      return;
    }

    if (!token) {
      setFormErrors(["Requisição inválida"]);
      setLoading(false);
      return;
    }
    try {
      await updateUserPassword(token, password);
      setSuccessMessage(["Senha alterada com sucesso!"]);
      setLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setFormErrors([error.message]);
      } else {
        setFormErrors(["Erro inesperado"]);
      }
      setLoading(false);
    }
  }
  if (loading) {
    return <LoaderComponent />;
  }
  return (
    <section className="register-page">
      <div className="forgot-password-page__main-content">
        <h2>
          Recuperar sua senha do{" "}
          <span className="calangar-font">{APP_CONFIG.appName}</span>
        </h2>
        <div>
          <img src="/images/calangar.png" alt="Calangar Logo" width={100} />
          <HiOutlineCalendar size={100} color="var(--main-color)" />
        </div>
      </div>
      <div className="forgot-password-page__form-content">
        <form
          className="form-regular"
          onSubmit={(event) => handleResetSubmit(event)}
        >
          <fieldset className="fieldset-regular">
            <legend>Digite sua nova senha</legend>

            <PasswordInput onStateChange={setPassword} value={password} />
            {formErrors.length > 0 && (
              <p>
                <FormMessages type="error" messages={formErrors} />
                <Link className="link-default" to="/forgot-password">
                  Solicite aqui um novo email de recuperação de senha
                </Link>
              </p>
            )}
            <div className="input-field">
              <button className="btn-default btn-submit" type="submit">
                Atualizar senha
              </button>
            </div>
            {successMessage.length > 0 && (
              <p className="error-text">
                <FormMessages type="success" messages={successMessage} />
                <Link className="link-default" to="/">
                  Voltar para o login
                </Link>
              </p>
            )}
          </fieldset>
        </form>
      </div>
    </section>
  );
}
