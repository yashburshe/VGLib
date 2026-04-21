import { Container, Nav, Navbar, Image, NavDropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";

import { logout } from "../js/user.js";
import { useUser } from "./UserContext.jsx";

import "../css/navBar.css";
import SearchBar from "./SearchBar.jsx";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();

  const isSearchPage = location.pathname === "/search";
  const isLoginPage = location.pathname === "/login";

  const onLogout = async () => {
    await logout();
    setUser(null);
    navigate("/");
  };

  const UserIcon = () => {
    return user?.profile_picture_url &&
      user.profile_picture_url.trim() !== "" ? (
      <Image
        src={user.profile_picture_url}
        roundedCircle
        alt="user profile icon"
        className="icon"
      />
    ) : (
      <PersonCircle className="icon" alt="user profile icon" />
    );
  };

  const AccountDropdown = () => {
    if (isLoginPage) return <></>;
    else if (!user)
      return (
        <Nav>
          <Nav.Link href="/login">Log in</Nav.Link>
        </Nav>
      );
    else
      return (
        <Nav>
          <NavDropdown
            title={
              <span className="d-inline-flex align-items-center gap-2">
                {user.username}
                <UserIcon />
              </span>
            }
            align="end"
          >
            <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={onLogout}>Log Out</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      );
  };

  return (
    <Navbar expand="lg" bg="light">
      <Container>
        <Navbar.Brand href="/">VGLib</Navbar.Brand>
        <Navbar.Toggle aria-controls="nav" />

        <Navbar.Collapse id="nav">
          {/* LEFT LINKS */}
          <Nav className="me-auto">
            <Nav.Link href="/top">Top</Nav.Link>
            <Nav.Link href="/games">Games</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
          </Nav>

          {/* CENTER SEARCH BAR — expands fully */}
          {!isSearchPage && (
            <div className="flex-grow-1 d-flex align-items-center mx-3">
              <SearchBar />
            </div>
          )}

          {/* RIGHT ACCOUNT DROPDOWN */}
          <AccountDropdown />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
