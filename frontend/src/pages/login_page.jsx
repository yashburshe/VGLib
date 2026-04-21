import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import { Button, ButtonGroup, Container } from "react-bootstrap";

export default function LoginPage() {
  const [isLoginScreen, setIsLoginScreen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSuccess = () => {
    console.log("login/registration success!");
    navigate("/profile");
  };

  return (
    <Container className="mt-4">
      <div className="d-flex flex-column align-items-center">
        <h1 className="mb-3 fs-3 fw-bold">Welcome to VGLib</h1>
        <ButtonGroup className="mb-3" aria-label="Auth mode switch">
          <Button
            variant={isLoginScreen ? "outline-primary" : "primary"}
            className="fw-semibold px-4"
            onClick={() => setIsLoginScreen(false)}
          >
            Create Account
          </Button>
          <Button
            variant={isLoginScreen ? "primary" : "outline-primary"}
            className="fw-semibold px-4"
            onClick={() => setIsLoginScreen(true)}
          >
            Log In
          </Button>
        </ButtonGroup>

        {isLoginScreen ? (
          <LoginForm
            username={username}
            password={password}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onSignUpClick={() => setIsLoginScreen(false)}
            onLoginSuccess={onSuccess}
          />
        ) : (
          <RegistrationForm
            username={username}
            password={password}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onLoginClick={() => setIsLoginScreen(true)}
            onRegisterSuccess={onSuccess}
          />
        )}
      </div>
    </Container>
  );
}
