export type User = {
  id: string; // UUID do backend
  email: string;
  name: string;
  avatar?: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
  role?: "admin" | "user";
};

export interface UserCredentials {
  email: string;
  password: string;
}

export interface SingleUserRegistrationData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
