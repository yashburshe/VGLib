import { useState } from "react";
import PropTypes from "prop-types";

import { login } from "../js/user";
import { Button, Container, Form, Alert } from "react-bootstrap";

import { useUser } from "./UserContext.jsx";
import { getUser } from "../js/user";

export default function LoginForm({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSignUpClick,
  onLoginSuccess,
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
    (await login(username, password))
      ? (setUser(await getUser()), onLoginSuccess())
      : setError("Invalid username or password");
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "420px" }}>
      <h2 className="mb-4">Log in</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            isInvalid={!!error && !username}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
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
          Log in
        </Button>
      </Form>

      <div className="mt-3 text-center">
        <a role="button" onClick={onSignUpClick}>
          Don’t have an account? Sign up here
        </a>
      </div>
    </Container>
  );
}

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onUsernameChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onSignUpClick: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func.isRequired,
};
