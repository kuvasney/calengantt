import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/config/app";
import RegisterForm from "@/components/LoginForm/RegisterForm";

export default function Register() {
  const navigate = useNavigate();
  return (
    <section className="register-page">
      <div className="register-page__main-content">
        <h2>Bem vindo ao {APP_CONFIG.appName}</h2>
      </div>
      <div className="register-page__register-form">
        <p>
          Já possui uma conta?{" "}
          <button onClick={() => navigate("/")}>Faça login</button>
        </p>
        <RegisterForm />
      </div>
    </section>
  );
}
