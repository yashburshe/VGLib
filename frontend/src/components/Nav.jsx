import { Container, Nav, Navbar, NavbarBrand, NavbarToggle } from "react-bootstrap";

export default function NavBar({ userID }) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <NavbarBrand href="/">VGLib</NavbarBrand>
        <NavbarToggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Top</Nav.Link>
            <Nav.Link href="/lists">Lists</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
            <Nav.Link href="/profile">My Account</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}