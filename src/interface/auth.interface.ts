export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  re_password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface ActivateAccountRequest {
  uid: string;
  token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmForm {
  new_password: string;
  re_new_password: string;
}

export interface PasswordResetConfirmRequest
  extends PasswordResetConfirmForm {
  uid: string;
  token: string;
}
