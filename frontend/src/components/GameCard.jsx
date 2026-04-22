import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";
import { Link } from "react-router";
import ListGroup from "react-bootstrap/ListGroup";
import "../css/gamecard.css";

export default function GameCard({ game, showCount = false, renderProp }) {
  return (
    <Card className="h-100 shadow-sm">
      {showCount ? (
        <Card.Header>
          <ListGroup.Item>In {game.listCount} lists</ListGroup.Item>
        </Card.Header>
      ) : null}
      <Card.Img
        className={showCount ? "rounded-0" : ""}
        style={{ objectFit: "cover", height: "250px" }}
        variant="top"
        src={game.cover_url}
        alt={game.name ? `${game.name} cover art` : "Game cover art"}
      />
      <Card.Body className="p-3">
        <Link to={`/games/${game.id}`}>
          <Card.Title className="fs-6 fw-bold mb-4 text-dark game-card-title">
            {game.name}
          </Card.Title>
        </Link>
        {renderProp || null}
      </Card.Body>
    </Card>
  );
}

GameCard.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    cover_url: PropTypes.string,
    listCount: PropTypes.number,
  }).isRequired,
  showCount: PropTypes.bool,
  renderProp: PropTypes.node,
};
