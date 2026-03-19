import { useEffect, useState } from 'react';
import GameCard from '../components/GameCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Pagination from 'react-bootstrap/Pagination';
import { Spinner } from 'react-bootstrap';

export default function TopGamesPage() {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 12;

  const totalPages = Math.ceil(games.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const paginatedGames = games.slice(startIndex, startIndex + gamesPerPage);
  const pageWindow = [
    1,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    totalPages,
  ].filter((page, index, pages) => {
    const inRange = page >= 1 && page <= totalPages;
    const isUnique = pages.indexOf(page) === index;
    return inRange && isUnique;
  });

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch('/api/games/top');
      const data = await res.json();
      console.log(data.topGames);

      setGames(data.topGames);
      setCurrentPage(1);
    };

    fetchGames();
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Top Games</h1>
      {games.length > 0 ? (
        <>
          <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
            {paginatedGames.map((game) => (
              <Col key={game.id}>
                <GameCard key={game.id} game={game} showCount />
              </Col>
            ))}
          </Row>
          {totalPages > 1 ? (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                />
                {pageWindow.map((page) => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          ) : null}
        </>
      ) : (
        <div className="d-flex align-items-center gap-2 text-muted">
          <Spinner animation="border" size="sm" />
          Loading top games...
        </div>
      )}
    </Container>
  );
}
