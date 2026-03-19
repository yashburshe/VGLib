import { useMemo, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { toggleGameInList } from "../js/list";

export default function AddGameToListButton({ lists, game }) {
  const [show, setShow] = useState(false);
  const [selectedLists, setSelectedLists] = useState(new Set([]));
  const safeLists = useMemo(() => (Array.isArray(lists) ? lists : []), [lists]);

  const handleClose = () => {
    setSelectedLists(new Set([]));
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    for (const listID of selectedLists) {
      const response = await toggleGameInList(listID, game.id);
      console.log(response);
    }
    handleClose();
    alert("refresh page to see updates");
  };

  const handleToggle = (listID) => {
    setSelectedLists((prev) => {
      const next = new Set(prev);
      if (next.has(listID)) {
        next.delete(listID);
      } else {
        next.add(listID);
      }
      return next;
    });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add to List
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add {game.name} to List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {safeLists.map((list) => {
              //console.log("creating form checkbox for list: ", list);
              const alreadyInList = list.games?.includes(game.id);

              return (
                <Form.Check
                  key={list.listID}
                  type="checkbox"
                  label={list.name}
                  value={list.listID}
                  disabled={alreadyInList}
                  checked={alreadyInList || selectedLists.has(list.listID)}
                  onChange={() => handleToggle(list.listID)}
                />
              );
            })}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={selectedLists.size === 0}
          >
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
