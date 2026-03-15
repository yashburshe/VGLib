import { useState} from 'react';
import { useNavigate} from 'react-router-dom';

import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import NavBar from '../components/Nav';

export default function LoginPage() {
    const [isLoginScreen, setIsLoginScreen] = useState(true);
    const navigate = useNavigate();
    return (
        <>
            <NavBar/>
            <div>
                <div>
                    {isLoginScreen ? (
                        <LoginForm 
                            onSignUpClick={() => setIsLoginScreen(false)} 
                            onLoginSuccess={() => navigate("/")}
                        />
                    ) : (
                        <RegistrationForm 
                            onLoginClick={() => setIsLoginScreen(true)} 
                            onRegisterSuccess={()=> navigate("/")}
                        />
                    )}
                </div>
            </div>
        </>
    );
}