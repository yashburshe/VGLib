//Modal for users to create a new modal

import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { updateUser } from "../js/user.js";
import { useUser } from "./UserContext.jsx";

export default function EditProfileModalButton({ userProp }) {
  const [show, setShow] = useState(false);
  const { user, setUser } = useUser();

  //ensure that react component is rerendered when userProp is loaded
  useEffect(() => setUser(userProp), [userProp]);

  //TODO use error to useState and display error messages in the modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(user);
    setShow(false);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Edit Profile
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                value={user.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Profile Banner</Form.Label>
              <Form.Control
                name="profile_banner_phrase"
                value={user.profile_banner_phrase}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Profile Art Link</Form.Label>
              <Form.Control
                name="profile_picture_url"
                value={user.profile_picture_url}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Update Profile
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
