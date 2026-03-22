import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import { Container } from "react-bootstrap";

export default function LoginPage() {
  const [isLoginScreen, setIsLoginScreen] = useState(true);
  const navigate = useNavigate();
  const onSuccess = () => {
    console.log("login/registration success!");
    navigate("/profile");
  };
  return (
    <>
      <Container className="mt-4">
        <div>
          {isLoginScreen ? (
            <LoginForm
              onSignUpClick={() => setIsLoginScreen(false)}
              onLoginSuccess={onSuccess}
            />
          ) : (
            <RegistrationForm
              onLoginClick={() => setIsLoginScreen(true)}
              onRegisterSuccess={onSuccess}
            />
          )}
        </div>
      </Container>
    </>
  );
}
