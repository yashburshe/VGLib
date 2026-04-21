import { Card, Button, Carousel } from "react-bootstrap";
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
