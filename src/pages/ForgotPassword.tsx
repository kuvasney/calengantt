import { useState } from "react";
import { useUserApi } from "@/hooks/useUserApi";
import LoaderComponent from "@/components/Loader/LoaderComponent";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const { passwordEmailRecovery } = useUserApi();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailSent(false);

    if (!email) {
      setError("Por favor, insira seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      await passwordEmailRecovery(email);
      setEmailSent(true);
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
      setError("Erro ao tentar enviar o e-mail. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="forgot-password-page">
      <div className="forgot-password-page__main-content">
        <h2>Recuperar Senha</h2>
      </div>
      <div className="forgot-password-page__form-content">
        <form className="form-regular" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Insira seu e-mail para recuperar sua senha</legend>
            <div className="form-field size3-field">
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
            {error && <div className="form-error-message">{error}</div>}
            {emailSent && (
              <div className="form-success-message">
                Se seu e-mail estiver cadastrado, você receberá instruções para
                recuperar sua senha.
              </div>
            )}
            <div className="form-actions">
              <button type="submit" className="btn-default">
                Enviar E-mail de Recuperação
              </button>
            </div>
          </fieldset>
        </form>
        <p>
          <Link to="/">Voltar para o login</Link>
        </p>
      </div>
    </section>
  );
}
