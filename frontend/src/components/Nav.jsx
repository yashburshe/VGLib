import { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Image, NavDropdown} from 'react-bootstrap'; 
import { PersonCircle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router';

import { getUser } from '../js/user';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState();
  
  useEffect(() => {
    const fetchUser = async () => {
      setUser(await getUser());
    };
    fetchUser();
  }, []);

  //Handle User Nav Bar Item on right hand side (only if user is logged in)
  function userItem() {
    if (!user || location.pathname === '/login') return  (<></>);

    const userImage = user.profile_picture_url 
      && user.profile_picture_url.trim() !== ""
    ? <Image 
        src={user.profile_picture_url} roundedCircle
        alt="user profile icon" 
        className="icon"
      />
    : <PersonCircle 
        size={20} 
        style={{marginRight: "6px", marginBottom: "2px"}}
        className="icon"
      />;

    const onLogout = () => {
      localStorage.removeItem('token');
      navigate('/login');
    };

    return (<>
      <Nav className="ms-auto"> {/* Right aligned*/}
        <NavDropdown title={
          <>
            {accountLabel}
            {userImage}
          </>
        }
        align="end"
        >
          <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
          <NavDropdown.Divider/>
          <NavDropdown.Item onClick={onLogout}>
            Log Out
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </>
    );
  }




  const accountLabel = user && user.username !== "" ? user.username : "My Account"; 
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">VGLib</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"> {/* Left aligned*/}
            <Nav.Link href="/top">Top</Nav.Link>
            <Nav.Link href="/lists">Lists</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
          </Nav>
          {userItem()}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}