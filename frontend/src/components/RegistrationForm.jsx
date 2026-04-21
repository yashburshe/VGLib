import { useState } from "react";

import { getUser, login, register } from "../js/user";
import { Button, Container, Form, Alert } from "react-bootstrap";
import { useUser } from "./UserContext.jsx";

export default function RegistrationForm({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onLoginClick,
  onRegisterSuccess,
}) {
  const [error, setError] = useState("");
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); //clear previous errors

    if (!username || !password) {
      setError("Please enter both a username and password");
      return;
    }

    const registrationSuccess = await register(username, password);
    if (!registrationSuccess) {
      setError("Invalid: username already taken");
      return;
    }

    const loginSuccess = await login(username, password);
    if (!loginSuccess) {
      setError("Account created. Please log in.");
      onLoginClick();
      return;
    }

    setUser(await getUser());
    onRegisterSuccess();
  };

  //TODO: set confirm password and password complexity rules. Ensure that password hash is sent to backend, not raw password
  return (
    <Container className="mt-4" style={{ maxWidth: "420px" }}>
      <h2 className="mb-4">Create Account</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            isInvalid={!!error && !username}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            isInvalid={!!error && !password}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={!username.trim() || !password.trim()}
        >
          Register
        </Button>
      </Form>

      <div className="mt-3 text-center">
        <a role="button" onClick={onLoginClick}>
          Already have an account? Sign in here
        </a>
      </div>
    </Container>
  );
}
