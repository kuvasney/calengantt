import { useState } from "react";
import { APP_CONFIG } from "@/config/app";
import { useUserApi } from "@/hooks/useUserApi";
import LoaderComponent from "@/components/Loader/LoaderComponent";
import { Link } from "react-router-dom";
import { HiOutlineCalendar, HiOutlineMail } from "react-icons/hi";
import FormMessages from "@/components/FormMessages/FormMessages";

export default function ForgotPassword() {
  const { passwordEmailRecovery } = useUserApi();
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Por favor, insira seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      await passwordEmailRecovery(email);
      setSuccessMessage("E-mail de recuperação enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
      setError("Erro ao tentar enviar o e-mail. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
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
        <form className="form-regular" onSubmit={handleSubmit}>
          <fieldset className="fieldset-regular">
            <legend>Insira seu e-mail para recuperar sua senha</legend>
            <div className="input-field--pretty">
              <span className="form-icon">
                <HiOutlineMail />
              </span>
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {loading && <LoaderComponent />}
            {successMessage && (
              <FormMessages type="success">{successMessage}</FormMessages>
            )}
            {error && <FormMessages type="error">{error}</FormMessages>}

            <div className="input-field">
              <button type="submit" className="btn-default">
                Enviar E-mail de Recuperação
              </button>
            </div>
          </fieldset>
        </form>
        <p>
          <Link className="link-default" to="/">
            Voltar para o login
          </Link>
        </p>
      </div>
    </section>
  );
}
