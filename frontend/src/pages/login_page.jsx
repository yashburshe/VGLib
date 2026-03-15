import { useState} from 'react';

import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import NavBar from '../components/Nav';

export default function LoginPage() {
    const [isLoginScreen, setIsLoginScreen] = useState(true);

    return (
        <>
            <NavBar/>
            <div>
                <div>
                    {isLoginScreen ? (
                        <LoginForm onSignUpClick={() => setIsLoginScreen(false)}/>
                    ) : (
                        <RegistrationForm onLoginClick={() => setIsLoginScreen(true)}/>
                    )}
                </div>
            </div>
        </>
    );
}