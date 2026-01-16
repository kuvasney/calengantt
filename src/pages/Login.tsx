import { Link } from "react-router-dom";
import { APP_CONFIG } from "@/config/app";
import LoginForm from "@/components/LoginForm/LoginForm";
import { HiOutlineCalendar } from "react-icons/hi";

import "@/assets/styles/main_page.scss";

export default function Login() {
  return (
    <section className="login-page">
      <div className="login-page__top">
        <div className="login-page__main-content">
          <h1>
            <span className="calangar-font">Bem vindo ao</span>
          </h1>
          <div className="calango calangar-font">{APP_CONFIG.appName}</div>
          <div>
            <HiOutlineCalendar size={100} color="var(--main-color)" />
          </div>
          <h2>
            Um calendário online para profissionais que precisam organizar seus
            serviços!
          </h2>
          <p className="login-page__create-account">
            Caso você ainda não tenha uma conta,{" "}
            <Link className="link-default" to="/register">
              registre-se aqui
            </Link>
            .
          </p>
        </div>
        <div className="login-page__login-form">
          <LoginForm />
        </div>
      </div>
      <div className="login-page__about">
        <h2>Mas o que é {APP_CONFIG.appName}?</h2>
        <p>
          O {APP_CONFIG.appName} é uma aplicação web desenvolvida para ajudar
          você a gerenciar seu <strong>calendário profissional</strong> de forma
          prática e intuitiva.
        </p>
        <p>
          Nossa missão é proporcionar uma experiência agradável e eficiente na
          organização do seu tempo, permitindo que você se concentre no que mais
          importa.
        </p>
      </div>
    </section>
  );
}
