import {
  SignUpForm,
} from "../../components/__molecules/AuthForms/AuthForms";
import AuthShell from "../../components/__molecules/AuthForms/AuthShell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create account"
      subtitle="Register with the fields expected by your Express auth route."
      switchHref="/auth/sign-in"
      switchLabel="Already have an account? Sign in"
    >
      <SignUpForm />
    </AuthShell>
  );
}
