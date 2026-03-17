//Modal for users to create a new modal

import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function NewGameModal(onCreateGame) {
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleChange = (e) => {
    const {name, summary, rating, url, platform} = e.target;

    if (name) game.name = name;
    if (summary) game.summary = summary;
    if (rating) game.rating = rating;
    if (url) game.url = url;
    if (platform) game.platform = platform;
  };


  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create Game
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                  <Form.Label>Game Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter game name" 
                    value={game.name}
                    onChange={(e) => setGame(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Summary</Form.Label>
                  <Form.Control 
                    as="textarea" 
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
                    placeholder="Enter game rating out of 100" 
                    value={game.rating}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Cover Art Link</Form.Label>
                  <Form.Control 
                    type="url" 
                    placeholder="Enter cover art link"
                    value={game.url} 
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Platforms</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter platforms separated by commas" />
                    value={game.platforms}
                    onChange={handleChange}
                </Form.Group>
            </Form>
            
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Create Game
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}