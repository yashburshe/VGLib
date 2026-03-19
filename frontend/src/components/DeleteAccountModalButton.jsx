//Button and Modal for users to delete their account

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

import { deleteUser } from '../js/user';

export default function DeleteAccountModalButton() {
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleDelete = () => {
    console.log('Deleting account!');
    deleteUser();
    setShow(false);
    navigate('/login');
  };

  return (
    <>
      <Button variant="danger" onClick={() => setShow(true)}>
        Delete Account
      </Button>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you wish to delete your account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Doing so will delete your user data, lists, and any games you've
          created.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
