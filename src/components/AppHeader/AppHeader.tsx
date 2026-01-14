import { APP_CONFIG } from "@/config/app";
import AppNav from "./AppNav";
import UserInfo from "../UserInfo/UserInfo";

import "./appHeader.scss";

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__title">
        {APP_CONFIG.appName} <span>beta</span>
      </div>
      <AppNav />
      <UserInfo />
    </header>
  );
}
