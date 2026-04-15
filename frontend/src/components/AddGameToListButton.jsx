import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { toggleGameInList, getUserLists } from "../js/list";

export default function AddGameToListButton({ game }) {
  const [show, setShow] = useState(false);
  const [usersLists, setUsersLists] = useState(new Map());
  useEffect(() => {
    //load in list of listIDs that contain the given game
    async function fetchLists() {
      const lists = await getUserLists();
      const kvPairs = lists.map((list) => [
        list.listID,
        {
          name: list.name,
          containsGame: list.games?.includes(game.id) || false,
        },
      ]);
      setUsersLists(new Map(kvPairs));
    }
    fetchLists();
  }, []);

  const handleToggle = async (listID) => {
    //add or remove the game from this list
    const response = await toggleGameInList(listID, game.id);
    if (!response) {
      alert("update failed, try again");
      return;
    }

    //update the state
    setUsersLists((prev) => {
      const next = new Map(prev);
      const old = prev.get(listID);
      next.set(listID, { ...old, containsGame: !old.containsGame });
      return next;
    });
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Add to List(s)
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add {game.name} to List(s)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {[...usersLists].map(([listID, { name, containsGame }]) => (
              <Form.Check
                key={listID}
                type="checkbox"
                label={name}
                value={listID}
                checked={containsGame}
                onChange={() => handleToggle(listID)}
              />
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
