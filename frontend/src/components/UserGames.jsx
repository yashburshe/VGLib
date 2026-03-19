import { Col, Container, Row } from "react-bootstrap";
import GameCard from "./GameCard";

export default function UserGames({ games }) {
  if (!games || games.length === 0) {
    return (
      <section className="lists-row">
        <p className="empty-state">No games created yet.</p>
      </section>
    );
  }

  return (
    <Container className="mt-3 lists-row">
      <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
        {games.map((game) => (
          <Col key={game.id} className="d-flex">
            <GameCard game={game} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
