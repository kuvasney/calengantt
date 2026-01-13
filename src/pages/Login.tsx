import { Link } from "react-router-dom";
import { APP_CONFIG } from "@/config/app";
import LoginForm from "@/components/LoginForm/LoginForm";

export default function Login() {
  return (
    <section className="login-page">
      <div className="login-page__main-content">
        <h2>Bem vindo ao {APP_CONFIG.appName}</h2>
      </div>
      <div className="login-page__login-form">
        <LoginForm />
        <Link to="/calendar">Ir para o Calendário</Link>
      </div>
    </section>
  );
}
