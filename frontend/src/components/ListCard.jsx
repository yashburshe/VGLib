import { Card, Button, Carousel, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Trash } from "react-bootstrap-icons";
import { useState, useEffect } from "react";

import { getGame } from "../js/game.js";
import { deleteList } from "../js/list.js";
import "../css/list.css";

export default function ListCard({ list, onListDelete }) {
  const navigate = useNavigate();
  const isDefaultList = ["Favorites", "Wishlist", "Owned"].includes(list.name);
  const [games, setGames] = useState([]);
  useEffect(() => {
    let isMounted = true;

    async function fetchGames() {
      if (!list.games || list.games.length === 0) return;
      const games = await Promise.all(list.games.map((id) => getGame(id)));
      if (isMounted) setGames(games);
    }

    fetchGames();
    return () => {
      isMounted = false;
    };
  }, [list.games]);

  const gameNames = games.map((g) => g.name);
  const gameNamesText =
    games.length > 0
      ? gameNames.slice(0, 3).join(", ") + (gameNames.length > 3 ? "..." : "")
      : "No games yet";

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCardClick = () => {
    if (showDeleteModal || isDeleting) {
      return;
    }
    navigate(`/lists/${list.listID}`);
  };

  const DeleteButton = () => {
    if (isDefaultList) return <></>;

    const onDeleteClick = (e) => {
      //handle initial click on delete button
      e.stopPropagation();
      setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
      //handle confirmation of deletion in modal
      setIsDeleting(true);

      const result = await deleteList(list.listID);
      if (!result?.success) {
        alert(result?.message || "Failed to delete list");
        setIsDeleting(false);
        return;
      }

      if (onListDelete) {
        onListDelete(list.listID);
      }
      setShowDeleteModal(false);
      setIsDeleting(false);
    };

    return (
      <>
        <Button variant="outline-danger" size="sm" onClick={onDeleteClick}>
          <Trash size={20} />
        </Button>
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton onClick={(e) => e.stopPropagation()}>
            <Modal.Title>Delete List</Modal.Title>
          </Modal.Header>
          <Modal.Body onClick={(e) => e.stopPropagation()}>
            Are you sure you want to delete the {list.name} list?
          </Modal.Body>
          <Modal.Footer onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(false);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                handleConfirmDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const GameImageCarousel = () => {
    return (
      games.length > 0 && (
        <Carousel
          interval={5000}
          controls={false}
          pause={false}
          indicators={false}
          className="mb-3"
        >
          {games.map((g) => (
            <Carousel.Item key={g.id}>
              <img
                className="d-block w-100"
                src={g.cover_url}
                alt={g.name}
                style={{ objectFit: "cover" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )
    );
  };

  return (
    <Card
      className="text-white border-0 overflow-hidden list-grid-card h-100 w-100"
      style={{ cursor: "pointer", overflow: "hidden" }}
      onClick={handleCardClick}
    >
      <GameImageCarousel />
      <Card.ImgOverlay className="d-flex flex-column justify-content-end text-white">
        <div className="bg-dark bg-opacity-75 p-3 rounded">
          <Card.Title className="d-flex justify-content-between align-items-start gap-2 mb-2">
            <span>{list.name}</span>
            {gameNames.length > 0 && (
              <span className="list-count-pill">{gameNames.length} items</span>
            )}
          </Card.Title>
          <Card.Body>
            <Card.Text className="mb-3 list-description">
              {gameNamesText}
            </Card.Text>
            <DeleteButton />
          </Card.Body>
        </div>
      </Card.ImgOverlay>
    </Card>
  );
}
