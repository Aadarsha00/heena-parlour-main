import * as yup from "yup";
import type { RegisterRequest } from "../interface/auth.interface";

//login
export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

//signup
export const registerSchema: yup.ObjectSchema<RegisterRequest> = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  re_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  first_name: yup.string().optional(),
  last_name: yup.string().optional(),
});
