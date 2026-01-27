import { useState } from "react";
import { HiLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

interface PasswordProps {
  onStateChange: (password: string) => void;
  value?: string;
}

export default function PassworInput({ onStateChange, value }: PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="input-field--pretty">
      <label htmlFor="password" className="login-form__password">
        <span className="form-icon">
          <HiLockClosed />
        </span>
        Senha:
        <button
          className="btn-flat login-form__see-password"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <HiOutlineEye /> : <HiOutlineEyeOff />}
        </button>
      </label>
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
        value={value}
        onChange={(e) => onStateChange(e.target.value)}
      />
    </div>
  );
}
