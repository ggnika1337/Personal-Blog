import {
  SignInForm,
} from "../../components/__molecules/AuthForms/AuthForms";
import AuthShell from "../../components/__molecules/AuthForms/AuthShell";

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in"
      subtitle="Use your backend account to manage your profile and blogs."
      switchHref="/auth/sign-up"
      switchLabel="Need an account? Sign up"
    >
      <SignInForm />
    </AuthShell>
  );
}
