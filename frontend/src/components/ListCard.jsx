import { useState } from "react";
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
  const requiredLists = ["Favorites", "Wishlist", "Owned"];
  const isDefaultList = requiredLists.includes(list.name);
  const gamesCount =
    Array.isArray(list.games) && list.games.length >= 0
      ? list.games.length
      : typeof list.count === "number"
        ? list.count
        : 0;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    const result = await deleteList(list.listID);
    if (!result?.success) {
      alert(result?.message || "Failed to delete list");
      setIsDeleting(false);
      return;
    }

    if (onListDeleted) {
      onListDeleted(list.listID);
    }
    setShowDeleteConfirm(false);
    setIsDeleting(false);
  };

  const handleCardClick = () => {
    if (showDeleteConfirm || isDeleting) {
      return;
    }
    navigate(`/lists/${list.listID}`);
  };

  const DeleteButton = () => {
    if (isDefaultList) return <></>;

    const onDelete = async (e) => {
      e.stopPropagation();
      await deleteList(list.listID);
      onListDelete();
    };

    return (
      <Button variant="outline-danger" size="sm" onClick={onDelete}>
        <Trash size={20} />
      </Button>
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
      onClick={() => navigate(`/lists/${list.listID}`)}
      style={{ cursor: "pointer", overflow: "hidden" }}
      className="list-grid-card h-100 w-100"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
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
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <span>{list.name}</span>
          {list.count !== undefined && (
            <span className="list-count-pill">{list.count} items</span>
          )}
        </Card.Title>
        {list.previewGameCovers?.length > 0 ? (
          <div className="list-preview-row mb-3">
            {list.previewGameCovers.map((coverURL, index) => (
              <img
                key={`${list.listID}-preview-${index}`}
                src={coverURL}
                alt={`${list.name} game preview ${index + 1}`}
                className="list-preview-thumb"
              />
            ))}
            {list.overflowCount > 0 ? (
              <span className="list-preview-more">+{list.overflowCount}</span>
            ) : null}
          </div>
        ) : gamesCount === 0 ? (
          <Card.Text className="text-muted mb-3">No games in list</Card.Text>
        ) : null}
        {!isDefaultList ? (
          <div className="mt-auto">
            <DeleteButton />
          </Card.Body>
        </div>
      </Card.ImgOverlay>

      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
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
              setShowDeleteConfirm(false);
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
    </Card>
  );
}
