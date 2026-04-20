import {
  Card,
  Button,
  Carousel,
  CarouselItem,
  CarouselCaption,
} from "react-bootstrap";
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
    //load in each game's details
    async function fetchGames() {
      const promises = list.games?.map(async (id) => {
        return await getGame(id);
      });
      const games = await Promise.all(promises);
      console.log("fetched games: ", games);
      setGames(games);
    }
    fetchGames();
  }, []);

  const firstGameCoverURL = games.length > 0 ? games[0].cover_url : "";
  console.log("list card cover art: ", firstGameCoverURL);

  const gameNames = games.map((g) => g.name);
  const gameNamesText =
    games.length > 0
      ? gameNames.slice(0, 3).join(", ") + (gameNames.length > 3 ? "..." : "")
      : "No games yet";

  const onDelete = (e) => {
    e.stopPropagation();
    deleteList(list.listID);
    alert("TODO: replace with toast List deleted!");
  };

  const DeleteButton = () => {
    if (isDefaultList) return <></>;
    return (
      <>
        <Button variant="outline-danger" size="sm">
          <Trash size={20} onClick={onDelete} />
        </Button>
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
            <Carousel.Item>
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
