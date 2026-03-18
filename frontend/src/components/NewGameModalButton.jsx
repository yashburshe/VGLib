//Modal for users to create a new modal

import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

import { createGame } from "../js/game";

export default function NewGameModal() {
  const game_default = {
    name: "",
    summary: "",
    rating: 0,
    url: "",
    platforms: ""
  }

  const [show, setShow] = useState(false);
  const [game, setGame] = useState(game_default);
  //TODO use error to useState and display error messages in the modal

  const handleChange = (e) => {
    setGame((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Create Game
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                  <Form.Label>Game Name</Form.Label>
                  <Form.Control
                    name="name" 
                    type="text"
                    placeholder="Enter game name" 
                    value={game.name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Summary</Form.Label>
                  <Form.Control 
                    as="textarea"
                    name="summary" 
                    rows={3} 
                    placeholder="Enter game description" 
                    value={game.summary}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>rating</Form.Label>
                  <Form.Control 
                    type="number"
                    name="rating" 
                    placeholder="Enter game rating out of 100" 
                    value={game.rating}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Cover Art Link</Form.Label>
                  <Form.Control 
                    type="url"
                    name="url" 
                    placeholder="Enter cover art link"
                    value={game.url} 
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Platforms</Form.Label>
                  <Form.Control 
                    type="text"
                    name="platforms"
                    placeholder="Enter platforms separated by commas"
                    value={game.platforms}
                    onChange={handleChange}
                   />
                </Form.Group>
            </Form>
            
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => createGame(game)}>
            Create Game
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}