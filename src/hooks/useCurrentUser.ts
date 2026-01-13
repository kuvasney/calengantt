import { useAppSelector } from "@/stores/hooks";

export function useCurrentUser() {
  const { currentUser } = useAppSelector((state) => state.user);

  if (currentUser) {
    return currentUser;
  }

  const userData = sessionStorage.getItem("user");
  if (userData) {
    return JSON.parse(userData);
  }

  return null;
}
