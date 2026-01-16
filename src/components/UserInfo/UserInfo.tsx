import { useCurrentUser } from "@/hooks/useCurrentUser";
import { HiUser } from "react-icons/hi";
import "./userInfo.scss";

export default function UserInfo() {
  const user = useCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="user-info">
      <HiUser /> <span className="user-name">Olá, {user.name}</span>
    </div>
  );
}
