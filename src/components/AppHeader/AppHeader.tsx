import { APP_CONFIG } from "@/config/app";
import AppNav from "./AppNav";

import "./appHeader.scss";

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__title calangar-font">
        <img
          className="app-logo"
          src="/images/calangar.png"
          alt="Calangar Logo"
        />
        {APP_CONFIG.appName} <span>beta</span>
      </div>
      <AppNav />
    </header>
  );
}
