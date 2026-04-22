import {
  Container,
  Nav,
  Navbar,
  Image,
  NavDropdown,
  Button,
} from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";

import { logout } from "../js/user.js";
import { useUser } from "./UserContext.jsx";
import { getUserLists } from "../js/list.js";

import "../css/navBar.css";
import SearchBar from "./SearchBar.jsx";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();
  const [userLists, setUserLists] = useState(new Map());
  useEffect(() => {
    //load in list of listIDs that contain the given game
    async function fetchLists() {
      const lists = await getUserLists();
      const kvPairs = lists.map((list) => [list.listID, list.name]);
      setUserLists(new Map(kvPairs));
    }
    fetchLists();
  }, [user]);

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

  const MyListsDropdown = () => {
    if (isLoginPage || !user) return <></>;

    return (
      <Nav>
        <NavDropdown title="My Lists">
          {[...userLists].map(([listID, name]) => (
            <NavDropdown.Item href={`/lists/${listID}`} key={listID}>
              {name}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      </Nav>
    );
  };

  const AccountDropdown = () => {
    if (isLoginPage) return <></>;
    else if (!user)
      return (
        <Nav className="ms-lg-2">
          <Button href="/login" variant="primary">
            Create Account
          </Button>
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

        <Navbar.Collapse id="nav" className="align-items-lg-center">
          {/* Search appears first in collapsed mobile nav */}
          {!isSearchPage && (
            <div className="search-bar-container order-1 order-lg-2">
              <SearchBar />
            </div>
          )}

          {/* LEFT LINKS */}
          <Nav className="me-auto order-2 order-lg-1">
            <Nav.Link href="/top">Top</Nav.Link>
            <Nav.Link href="/games">Games</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
            <MyListsDropdown />
          </Nav>

          {/* RIGHT ACCOUNT DROPDOWN */}
          <div className="order-3 order-lg-3 nav-account-container">
            <AccountDropdown />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
