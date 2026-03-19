import { useState } from "react";

import { register } from "../js/user";
import { Button, Container, Form } from "react-bootstrap";

export default function RegistrationForm({ onLoginClick, onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //TODO: set confirm password and password complexity rules. Ensure that password hash is sent to backend, not raw password
  return (
    <>
      <Container className="col-lg-6">
        <h2>Register</h2>
        <Form className="mb-3">
          <Form.Group className="mb-3">
            <Form.Label htmlFor="username" className="form-label">
              Username
            </Form.Label>
            <Form.Control
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label
              type="password"
              className="form-label"
              htmlFor="password"
            >
              Password
            </Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button
            className="btn btn-primary"
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              const success = await register(username, password);
              if (success) {
                onRegisterSuccess();
              }
            }}
          >
            Register
          </Button>
        </Form>
        <a className="a" onClick={onLoginClick}>
          Already have an account? Sign in here
        </a>
      </Container>
    </>
  );
}
