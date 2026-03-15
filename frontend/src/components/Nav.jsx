import { Link } from "react-router-dom";

export default function NavBar({ userID }) {
  return (
    <header className="mb-auto">
        <div>
          <Link className="nav-link" to="/">
            <h1 className="float-md-start mb-0">VGLib</h1>
          </Link>
          <nav className="nav nav-masthead justify-content-center float-md-end">
            <Link className="nav-link" to="/">
              Top
            </Link>
            <Link className="nav-link" to="/lists">
              Lists
            </Link>
            <Link className="nav-link" to="/users">
              Users
            </Link>
            <Link className="nav-link" to="/profile">
              My Account
            </Link>
          </nav>
        </div>
      </header>
  );
}