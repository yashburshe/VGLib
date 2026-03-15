import { useState} from 'react';

export default function RegistrationForm({onLoginClick, onRegisterSuccess}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //TODO: set confirm password and password complexity rules. Ensure that password hash is sent to backend, not raw password
    return (
        <>
            <div>
                <h2>Register</h2>
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
                            const success = await register(username, password);
                            if (success) {
                                onRegisterSuccess();
                            }
                        }}
                    >Register
                    </button>
                </form>
                <div>
                    <a onClick={onLoginClick}>
                        Already have an account? Sign in here
                    </a>
                </div>
            </div>
        </>
    );
}