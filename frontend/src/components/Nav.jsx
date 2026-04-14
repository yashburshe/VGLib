import { Container, Nav, Navbar, Image, NavDropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";

import { useUser } from "./UserContext.jsx";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();

  const onLogout = () => {
    setUser(null);
    navigate("/login");
  };

  function userProfileIcon() {
    if (!user || location.pathname === "/login") return null;
    return user.profile_picture_url &&
      user.profile_picture_url.trim() !== "" ? (
      <Image
        src={user.profile_picture_url}
        roundedCircle
        alt="user profile icon"
        className="icon"
      />
    ) : (
      <PersonCircle
        size={20}
        style={{ marginRight: "6px", marginBottom: "2px" }}
        className="icon"
      />
    );
  }

  function userProfileLink() {
    if (!user || location.pathname === "/login") {
      return <Nav.Link href="/login">Login</Nav.Link>;
    }
    return (
      <NavDropdown
        title={
          <span className="d-inline-flex align-items-center gap-2">
            {user.username}
            {userProfileIcon()}
          </span>
        }
        align="end"
      >
        <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={onLogout}>Log Out</NavDropdown.Item>
      </NavDropdown>
    );
  }

  const accountLabel =
    user && user.username !== "" ? user.username : "My Account";
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">VGLib</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {" "}
            {/* Left aligned*/}
            <Nav.Link href="/top">Top</Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/games">Games</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
          </Nav>
          {userProfileLink()}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
