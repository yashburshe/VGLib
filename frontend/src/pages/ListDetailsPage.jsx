import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Trash } from "react-bootstrap-icons";

import { getList, deleteList, toggleGameInList } from "../js/list";
import { getGame } from "../js/game";
import GameCard from "../components/GameCard";

export default function ListDetailsPage() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const [listDetails, setListDetails] = useState({});
  const [games, setGames] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingList, setIsDeletingList] = useState(false);

  useEffect(() => {
    const fetchListDetails = async () => {
      const details = await getList(listId);
      setListDetails(details);

      if (details?.games?.length > 0) {
        const fetchedGames = await Promise.all(
          details.games.map((gameId) => getGame(gameId)),
        );
        setGames(fetchedGames);
      } else {
        setGames([]);
      }
    };
    fetchListDetails();
  }, [listId]);

  const requiredLists = ["Favorites", "Wishlist", "Owned"];
  const isDefaultList = requiredLists.includes(listDetails.name);
  const descriptionText =
    listDetails.description || (isDefaultList ? "" : "No Description");

  const DeleteListButton = () => {
    const onDeleteClick = () => {
      setShowDeleteConfirm(true);
    };

    const handleDeleteList = async () => {
      setIsDeletingList(true);

      const result = await deleteList(listId);
      if (!result?.success) {
        alert(result?.message || "Failed to delete list");
        setIsDeletingList(false);
        return;
      }

      setShowDeleteConfirm(false);
      navigate("/profile");
    };

    return (
      <>
        <Button
          variant="danger"
          onClick={onDeleteClick}
          disabled={isDeletingList}
          aria-label={`Delete ${listDetails.name || "this"} list`}
          title={`Delete ${listDetails.name || "this"} list`}
        >
          <Trash size={20} />
        </Button>

        <Modal
          show={showDeleteConfirm}
          onHide={() => setShowDeleteConfirm(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the {listDetails.name} list?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeletingList}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteList}
              disabled={isDeletingList}
            >
              {isDeletingList ? "Deleting..." : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const UnsetItemFromListButton = ({ gameID, listID, gameName }) => {
    const handleRemoveFromList = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const result = await toggleGameInList(listID, gameID);
      if (!result?.success) {
        alert(result?.message || "Failed to remove game from list");
        return;
      }

      setGames((prevGames) =>
        prevGames.filter((game) => Number(game.id) !== Number(gameID)),
      );
      setListDetails((prev) => ({
        ...prev,
        games: (prev.games || []).filter((id) => Number(id) !== Number(gameID)),
      }));
    };

    return (
      <>
        <Button
          variant="danger"
          onClick={handleRemoveFromList}
          aria-label={`Remove ${gameName || "game"} from this list`}
          title={`Remove ${gameName || "game"} from this list`}
        >
          <Trash size={20} />
        </Button>
      </>
    );
  };

  return (
    <Container className="mt-4">
      <Col md={12} lg={12}>
        <h1>{listDetails.name}</h1>
        {isDefaultList ? <></> : <DeleteListButton />}
        {descriptionText ? <p>{descriptionText}</p> : null}
        <h3 className="mt-4">Games in this list</h3>
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
          {games.length === 0 && <p>No games added!</p>}
          {games?.length > 0 &&
            games.map((game) => (
              <Col key={game.id}>
                <GameCard
                  key={game.id}
                  game={game}
                  renderProp={
                    <UnsetItemFromListButton
                      gameID={game.id}
                      listID={listId}
                      gameName={game.name}
                    />
                  }
                />
              </Col>
            ))}
        </Row>
      </Col>
    </Container>
  );
}
