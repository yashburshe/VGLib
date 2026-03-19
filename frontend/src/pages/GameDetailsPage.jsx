import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { getUser } from "../js/user";
import DeleteGameModalButton from "../components/DeleteGameModalButton";

export default function GameDetailsPage() {
  const { gameId } = useParams();
  const [user, setUser] = useState();
  const [gameDetails, setGameDetails] = useState({});
  const isLoggedIn = Boolean(user);
  const canDeleteGame =
    isLoggedIn && Number(user.userID) === Number(gameDetails.userId);

  useEffect(() => {
    const fetchUser = async () => {
      setUser(await getUser());
    };
    fetchUser();
    const fetchGameDetails = async () => {
      const res = await fetch(`/api/games/${gameId}`);
      const data = await res.json();
      console.log(data);
      setGameDetails(data.game);
    };

    fetchGameDetails();
  }, [gameId]);

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4} lg={3} className="mb-4">
          <div className="d-flex flex-column gap-2">
            <Image
              src={gameDetails.cover_url}
              fluid
              rounded
              className="shadow-sm mb-2"
            />
            {isLoggedIn ? (
              <>
                <Button variant="primary">Add to List</Button>
                {canDeleteGame ? (
                  <DeleteGameModalButton
                    gameId={gameDetails.id}
                    gameName={gameDetails.name}
                  />
                ) : (
                  ""
                )}
              </>
            ) : (
              <Link to="/login">Login to add this game to your list!</Link>
            )}
          </div>
        </Col>

        <Col md={8} lg={9}>
          <h1>{gameDetails.name}</h1>
          <p>{gameDetails.summary}</p>
          <p>Rating: {Math.round(gameDetails.rating)}</p>
          <p>Platforms: {gameDetails.platforms?.join(", ")}</p>
        </Col>
      </Row>
    </Container>
  );
}
