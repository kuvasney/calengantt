import useGoogleAuth from "@/hooks/useGoogleAuth";

export default function SocialLogin() {
  const { loginWithGoogle } = useGoogleAuth();
  return (
    <div className="login-form__alternative-login">
      <p>Ou utilize suas credenciais:</p>
      <div className="form-field">
        <button className="btn-google" type="button" onClick={loginWithGoogle}>
          <span className="icon" />
          Utilize sua conta Google
        </button>
      </div>
    </div>
  );
}
