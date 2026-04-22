import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Alert, Button, Form, Modal } from "react-bootstrap";

import { updateGame } from "../js/game";

export default function EditGameModalButton({ gameProp, onUpdated }) {
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [game, setGame] = useState({
    name: "",
    summary: "",
    rating: 0,
    cover_url: "",
    platforms: "",
  });

  useEffect(() => {
    if (!gameProp) return;
    setGame({
      name: gameProp.name || "",
      summary: gameProp.summary || "",
      rating: gameProp.rating ?? 0,
      cover_url: gameProp.cover_url || "",
      platforms: Array.isArray(gameProp.platforms)
        ? gameProp.platforms.join(", ")
        : gameProp.platforms || "",
    });
  }, [gameProp]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGame((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gameProp?.id) return;

    setIsSubmitting(true);
    setError("");
    try {
      const res = await updateGame(gameProp.id, game);
      if (res?.success) {
        setShow(false);
        if (onUpdated && res.game) {
          onUpdated(res.game);
        }
      } else {
        setError(res?.message || "Failed to update game.");
      }
    } catch {
      setError("Failed to update game.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button variant="outline-secondary" onClick={() => setShow(true)}>
        Edit Game
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Game Name</Form.Label>
              <Form.Control
                name="name"
                value={game.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Summary</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="summary"
                value={game.summary}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={game.rating}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cover Art Link</Form.Label>
              <Form.Control
                type="url"
                name="cover_url"
                value={game.cover_url}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Platforms</Form.Label>
              <Form.Control
                name="platforms"
                value={game.platforms}
                onChange={handleChange}
                placeholder="Enter platforms separated by commas"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShow(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

EditGameModalButton.propTypes = {
  gameProp: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    summary: PropTypes.string,
    rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    cover_url: PropTypes.string,
    platforms: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
  }),
  onUpdated: PropTypes.func,
};
