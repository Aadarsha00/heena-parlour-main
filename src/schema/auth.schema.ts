import * as yup from "yup";
import type {
  PasswordResetConfirmForm,
  PasswordResetRequest,
  RegisterRequest,
} from "../interface/auth.interface";

//login
export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

//signup
export const registerSchema: yup.ObjectSchema<RegisterRequest> = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  re_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  first_name: yup.string().trim().required("First name is required"),
  last_name: yup.string().trim().required("Last name is required"),
  phone_number: yup
    .string()
    .matches(/^\+?\d{9,15}$/, "Use 9–15 digits, optionally beginning with +")
    .required("Phone number is required"),
});

export const passwordResetRequestSchema: yup.ObjectSchema<PasswordResetRequest> =
  yup.object({
    email: yup
      .string()
      .email("Enter a valid email address")
      .required("Email is required"),
  });

export const passwordResetConfirmSchema: yup.ObjectSchema<PasswordResetConfirmForm> =
  yup.object({
    new_password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("New password is required"),
    re_new_password: yup
      .string()
      .oneOf([yup.ref("new_password")], "Passwords must match")
      .required("Please confirm your new password"),
  });
