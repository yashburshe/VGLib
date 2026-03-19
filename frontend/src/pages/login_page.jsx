import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import { Container } from "react-bootstrap";

export default function LoginPage() {
  const [isLoginScreen, setIsLoginScreen] = useState(true);
  const navigate = useNavigate();
  return (
    <>
      <Container className="mt-4">
        <div>
          {isLoginScreen ? (
            <LoginForm
              onSignUpClick={() => setIsLoginScreen(false)}
              onLoginSuccess={() => navigate("/profile")}
            />
          ) : (
            <RegistrationForm
              onLoginClick={() => setIsLoginScreen(true)}
              onRegisterSuccess={() => navigate("/profile")}
            />
          )}
        </div>
      </Container>
    </>
  );
}
