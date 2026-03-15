import { useState} from 'react';

import { login } from '../js/user';

export default function LoginForm({ onSignUpClick}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            <div>
                <h2>Log in</h2>
                <form>
                    <div className="mb-3">
                        <label 
                            htmlFor="username" 
                            className="form-label">
                                Username
                        </label>
                        <input type="text" 
                            className="form-control" 
                            id="username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label 
                            type="password" 
                            className="form-label" 
                            htmlFor="password">
                            Password
                        </label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button 
                        className="btn btn-primary" 
                        type="submit" 
                        onClick={async (e) => {
                            e.preventDefault();
                            await login(username, password);
                        }}
                     >Log in</button>
                </form>
                <div>
                    <a onClick={onSignUpClick}> 
                        Don't have an account? Sign up here
                    </a>
                </div>
            </div>
        </>
    );
}