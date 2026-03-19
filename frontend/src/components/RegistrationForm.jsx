import { useState } from "react";

import { register } from "../js/user";
import { Button, Container, Form, Alert } from "react-bootstrap";

export default function RegistrationForm({ onLoginClick, onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  
  const handleSubmit = async (e) => {
      e.preventDefault();
      setError(""); //clear previous errors

      if (!username || !password) {
          setError("Please enter both a username and password");
          return;
      }
      await register(username, password) 
          ? onRegisterSuccess() 
          : setError("Invalid username already taken");

  };

  //TODO: set confirm password and password complexity rules. Ensure that password hash is sent to backend, not raw password
    return (
        <Container className="mt-4" style={{ maxWidth: "420px" }}>
            <h2 className="mb-4">Create Account</h2>

            {error && (
                <Alert variant="danger">
                    {error}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        isInvalid={!!error && !username}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isInvalid={!!error && !password}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Register
                </Button>
            </Form>

            <div className="mt-3 text-center">
                <a role="button" onClick={onLoginClick}>
                    Already have an account? Sign in here
                </a>
            </div>
        </Container>
    )
}