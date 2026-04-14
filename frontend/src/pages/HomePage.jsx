import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import GameCard from "../components/GameCard";
import SearchBar from "../components/SearchBar";

function App() {
  const [topGames, setTopGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const updateVisibleColumns = () => {
      const width = window.innerWidth;
      if (width >= 1200) {
        setVisibleColumns(4);
      } else if (width >= 992) {
        setVisibleColumns(3);
      } else if (width >= 576) {
        setVisibleColumns(2);
      } else {
        setVisibleColumns(1);
      }
    };

    updateVisibleColumns();
    window.addEventListener("resize", updateVisibleColumns);
    return () => window.removeEventListener("resize", updateVisibleColumns);
  }, []);

  useEffect(() => {
    const fetchTopGames = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/games/top");
        const data = await res.json();
        setTopGames((data?.topGames || []).slice(0, 12));
      } catch {
        setTopGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopGames();
  }, []);

  const oneRowGames = topGames.slice(0, visibleColumns);

  return (
    <Container className="mt-4">
      <SearchBar />
      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Top Games</h2>
          <Button variant="outline-primary" onClick={() => navigate("/top")}>
            View More
          </Button>
        </div>

        {isLoading ? (
          <div className="d-flex align-items-center gap-2 text-muted">
            <Spinner animation="border" size="sm" />
            Loading top games...
          </div>
        ) : null}

        {!isLoading && topGames.length > 0 ? (
          <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
            {oneRowGames.map((game) => (
              <Col key={game.id}>
                <GameCard game={game} showCount />
              </Col>
            ))}
          </Row>
        ) : null}

        {!isLoading && topGames.length === 0 ? (
          <p className="text-muted">No top games available right now.</p>
        ) : null}
      </section>
    </Container>
  );
}

export default App;
