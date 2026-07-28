import api from "../components/axios/api.axios";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../interface/auth.interface";

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/auth/jwt/create/", data);

  // Store tokens after successful login
  const { access, refresh } = response.data;
  if (access) {
    localStorage.setItem("access", access);
  }
  if (refresh) {
    localStorage.setItem("refresh", refresh);
  }
  window.dispatchEvent(new Event("localStorageChange"));

  return response.data;
};

export const registerUser = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await api.post("/auth/users/", data);  
  return response.data;
};

export interface CurrentUser {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await api.get("/auth/users/me/");
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post("/auth/logout/");
};
