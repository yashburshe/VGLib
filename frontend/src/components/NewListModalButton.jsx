import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

import { createList } from "../js/list.js";

export default function NewListModalButton({ existingNames, onListCreated }) {
  const [show, setShow] = useState(false);
  const [listName, setListName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents default form submission
    setError("");

    const trimmed = listName.trim();
    if (!trimmed) {
      setError("List name cannot be empty");
      return;
    }

    const normalized = trimmed.toLowerCase();
    if (existingNames?.map((n) => n.toLowerCase()).includes(normalized)) {
      setError("A list with this name already exists");
      return;
    }

    try {
      setLoading(true);
      const listID = await createList(trimmed);

      // Clear state
      setListName("");
      setShow(false);

      // Notify parent (optionally pass listID)
      onListCreated(listID);
    } catch (err) {
      setError("Failed to create list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setListName("");
    setError("");
    setShow(false);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Create New List
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New List</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group>
              <Form.Label>List Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter list name"
                value={listName}
                onChange={(e) => {
                  setListName(e.target.value);
                  setError("");
                }}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create List"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
