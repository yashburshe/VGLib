import { useState} from 'react';

import { login } from '../js/user';
import { Button, Container, Form } from 'react-bootstrap';

export default function LoginForm({onSignUpClick, onLoginSuccess}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            <Container>
                <h2>Log in</h2>
                <Form className='mb-3'>
                    <Form.Group className="mb-3">
                        <Form.Label 
                            htmlFor="username" 
                            className="form-label">
                                Username
                        </Form.Label>
                        <Form.Control type="text" 
                            className="form-control" 
                            id="username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label 
                            type="password" 
                            className="form-label" 
                            htmlFor="password">
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
                            const success = await login(username, password);
                            if (success) {
                                onLoginSuccess();
                            }
                        }}
                     >Log in</Button>
                </Form>
                    <a className='a' onClick={onSignUpClick}> 
                        Don't have an account? Sign up here
                    </a>
            </Container>
        </>
    );
}