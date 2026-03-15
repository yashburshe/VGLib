import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

export default function TopGamesPage() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch("/api/games/top");
      const data = await res.json();
      console.log(data.topGames);

      setGames(data.topGames);
    };

    fetchGames();
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Top Games</h1>
      {games.length > 0 ? (
        <>
          <Row xs={1} md={3} lg={6} className="g-4">
            {games.map((game) => (
              <Col key={game.id}>
                <GameCard key={game.id} game={game} showCount />
              </Col>
            ))}
          </Row>
        </>
      ) : (
        "Loading..."
      )}
    </Container>
  );
}
