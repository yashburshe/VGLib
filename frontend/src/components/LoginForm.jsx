import { useState } from 'react';

import { login } from '../js/user';
import { Button, Container, Form, Alert } from 'react-bootstrap';

export default function LoginForm({ onSignUpClick, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); //clear previous errors

    if (!username || !password) {
      setError('Please enter both a username and password');
      return;
    }
    (await login(username, password))
      ? onLoginSuccess()
      : setError('Invalid username or password');
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '420px' }}>
      <h2 className="mb-4">Log in</h2>

      {error && <Alert variant="danger">{error}</Alert>}

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
