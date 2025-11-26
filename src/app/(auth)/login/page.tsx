import { LoginForm } from "@/feature/auth/components/login-form";
import { requireUnauth } from "@/lib/auth-utils";

export default async function Login() {
  await requireUnauth();

  return <LoginForm />;
}
