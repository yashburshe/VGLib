import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Toast, ToastContainer } from "react-bootstrap";

import { deleteGame } from "../js/game";

export default function DeleteGameModalButton({ gameId, gameName }) {
  const [show, setShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Could not delete this game.",
  );
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    setShowErrorToast(false);

    try {
      const res = await deleteGame(gameId);
      if (res && res.success) {
        setShow(false);
        setShowSuccessToast(true);
        setTimeout(() => {
          navigate("/games");
        }, 900);
      } else {
        setErrorMessage(res?.message || "Could not delete this game.");
        setShowErrorToast(true);
      }
    } catch {
      setErrorMessage("Could not delete this game.");
      setShowErrorToast(true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={() => setShow(true)}>
        Delete Game
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            Are you sure you want to delete{" "}
            {gameName ? `"${gameName}"` : "this game"}?
          </p>
          <p className="mb-0 text-muted">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShow(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          onClose={() => setShowSuccessToast(false)}
          show={showSuccessToast}
          delay={1800}
          autohide
        >
          <Toast.Body className="text-white">
            Game deleted successfully.
          </Toast.Body>
        </Toast>
        <Toast
          bg="danger"
          onClose={() => setShowErrorToast(false)}
          show={showErrorToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
