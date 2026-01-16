import { Link } from "react-router-dom";
import { APP_CONFIG } from "@/config/app";
import RegisterForm from "@/components/LoginForm/RegisterForm";
import { HiOutlineCalendar } from "react-icons/hi";

import "@/assets/styles/main_page.scss";

export default function Register() {
  return (
    <section className="register-page">
      <div className="login-page__main-content">
        <h1>
          <span className="calangar-font">
            Bem vindo ao {APP_CONFIG.appName}
          </span>
        </h1>
        <div>
          <img src="/images/calangar.png" alt="Calangar Logo" width={100} />
          <HiOutlineCalendar size={100} color="var(--main-color)" />
        </div>
        <h2>
          Um calendário online para profissionais que precisam organizar seus
          serviços!
        </h2>
        <p className="login-page__create-account">
          Já tem uma conta?{" "}
          <Link className="link-default" to="/">
            Voltar para o Login
          </Link>
          .
        </p>
      </div>
      <div className="register-page__register-form">
        <RegisterForm />
      </div>
    </section>
  );
}
