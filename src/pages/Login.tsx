import { APP_CONFIG } from "@/config/app";
import LoginForm from "@/components/LoginForm/LoginForm";
import { CgCalendar } from "react-icons/cg";

import "@/assets/styles/main_page.scss";

export default function Login() {
  return (
    <section className="login-page">
      <div className="login-page__top">
        <div className="login-page__main-content">
          <h1>
            <span className="calangar-font">
              Bem vindo ao {APP_CONFIG.appName}
            </span>
          </h1>
          <div>
            <img src="/images/calangar.png" alt="Calangar Logo" width={100} />
            <CgCalendar size={100} color="var(--main-color)" />
          </div>
          <h2>
            Um calendário online para profissionais que precisam organizar seus
            serviços!
          </h2>
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
