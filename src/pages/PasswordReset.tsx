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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUserPassword } = useUserApi();

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = window.location.href;
    const params = new URL(url).searchParams;
    const token = params.get("token");

    if (!password) {
      setError("É necessário preencher uma senha!");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Requisição inválida");
      setLoading(false);
      return;
    }
    try {
      await updateUserPassword(token, password);
      setSuccess("Senha alterada com sucesso!");
      setLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro inesperado");
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
            {error !== "" && (
              <>
                <FormMessages type="error">
                  <p className="error-text">{error}</p>
                </FormMessages>
                <p>
                  <Link className="link-default" to="/forgot-password">
                    Solicite aqui um novo email de recuperação de senha
                  </Link>
                </p>
              </>
            )}
            <div className="input-field">
              <button className="btn-default btn-submit" type="submit">
                Atualizar senha
              </button>
            </div>
            {success !== "" && (
              <FormMessages type="success">
                <p className="error-text">{success}</p>
                <Link className="link-default" to="/">
                  Voltar para o login
                </Link>
              </FormMessages>
            )}
          </fieldset>
        </form>
      </div>
    </section>
  );
}
