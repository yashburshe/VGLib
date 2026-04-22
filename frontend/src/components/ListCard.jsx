import { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Trash } from "react-bootstrap-icons";

import { deleteList } from "../js/list.js";
import "../css/list.css";

export default function ListCard({ list, onListDeleted }) {
  const navigate = useNavigate();
  const requiredLists = ["Favorites", "Wishlist", "Owned"];
  const isDefaultList = requiredLists.includes(list.name);
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

  const handleCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  const DeleteButton = () => {
    return (
      <>
        <Button variant="outline-danger" size="sm" onClick={onDeleteClick}>
          <Trash size={20} />
        </Button>
      </>
    );
  };

  return (
    <Card
      className="list-grid-card h-100 w-100"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open ${list.name} list`}
      style={{ cursor: "pointer" }}
    >
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
        ) : null}
        {!isDefaultList ? (
          <div className="mt-auto">
            <DeleteButton />
          </div>
        ) : null}
      </Card.Body>

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