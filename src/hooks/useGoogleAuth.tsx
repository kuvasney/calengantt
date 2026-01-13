export default function useGoogleAuth() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const loginWithGoogle = () => {
    // Redireciona para rota do backend que inicia OAuth
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/api/auth/google`;
  };
  return {
    clientId: googleClientId,
    loginWithGoogle,
  };
}
