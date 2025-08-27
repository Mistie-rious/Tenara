import { Link } from "react-router-dom";
import AuthLayout from "../components/shared/AuthLayout";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account"
  
    >
      <LoginForm />
    </AuthLayout>
  );
}
