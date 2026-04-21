import { useEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  Pagination,
  Row,
  Spinner,
} from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import GameCard from "../components/GameCard";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [platformFilter, setPlatformFilter] = useState("");
  const [ratingSort, setRatingSort] = useState("desc");
  const [platforms, setPlatforms] = useState([]);
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 12;

  const trimmedSearch = searchText.trim();
  const hasSubmittedQuery = searchParams.has("q");
  const hasActiveFilters = Boolean(
    platformFilter || trimmedSearch || hasSubmittedQuery,
  );
  const totalPages = Math.max(1, Math.ceil(games.length / gamesPerPage));
  const startIndex = (currentPage - 1) * gamesPerPage;
  const paginatedGames = games.slice(startIndex, startIndex + gamesPerPage);
  const pageWindow = [
    1,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    totalPages,
  ].filter(
    (page, index, pages) =>
      page >= 1 && page <= totalPages && pages.indexOf(page) === index,
  );

  useEffect(() => {
    setSearchText(searchParams.get("q") || "");
  }, [searchParams]);

  const onSearchSubmit = (e) => {
    e.preventDefault();

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("q", searchText.trim());

    setSearchParams(nextParams);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [trimmedSearch, platformFilter, ratingSort]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchPlatforms = async () => {
        try {
          const params = new URLSearchParams();
          if (trimmedSearch) params.set("q", trimmedSearch);
          const queryString = params.toString();
          const endpoint = queryString
            ? `/api/games/search/platforms?${queryString}`
            : "/api/games/search/platforms";
          const res = await fetch(endpoint);
          const data = await res.json();
          setPlatforms(data?.platforms || []);
        } catch {
          setPlatforms([]);
        }
      };

      fetchPlatforms();
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [trimmedSearch]);

  useEffect(() => {
    if (!hasActiveFilters) {
      setGames([]);
      setIsLoading(false);
      setCurrentPage(1);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        if (!trimmedSearch && !platformFilter) {
          const res = await fetch("/api/games");
          const data = await res.json();
          const allGames = data?.games || [];
          const sortedGames = [...allGames].sort((a, b) => {
            const ratingDiff = Number(a?.rating || 0) - Number(b?.rating || 0);
            if (ratingSort === "asc") {
              return ratingDiff || (a?.name || "").localeCompare(b?.name || "");
            }
            return -ratingDiff || (a?.name || "").localeCompare(b?.name || "");
          });
          setGames(sortedGames);
          return;
        }

        const params = new URLSearchParams();
        if (trimmedSearch) params.set("q", trimmedSearch);
        if (platformFilter) params.set("platform", platformFilter);
        params.set("sort", ratingSort);

        const res = await fetch(`/api/games/search?${params.toString()}`);
        const data = await res.json();
        setGames(data?.games || []);
      } catch {
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [trimmedSearch, platformFilter, ratingSort, hasActiveFilters]);

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Search Games</h1>
      <Form className="mb-4" onSubmit={onSearchSubmit}>
        <Row className="g-3">
          <Col md={6}>
            <Form.Control
              type="search"
              placeholder="Search by game name, summary, or platform"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
            >
              <option value="">All Platforms</option>
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={ratingSort}
              onChange={(e) => setRatingSort(e.target.value)}
            >
              <option value="desc">Rating: High to Low</option>
              <option value="asc">Rating: Low to High</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {!hasActiveFilters ? (
        <p className="text-muted">
          Start typing or choose a platform to search for games.
        </p>
      ) : null}

      {isLoading ? (
        <div className="d-flex align-items-center gap-2 text-muted">
          <Spinner animation="border" size="sm" />
          Searching...
        </div>
      ) : null}

      {!isLoading && hasActiveFilters && games.length === 0 ? (
        <p className="text-muted">No matching games found.</p>
      ) : null}

      {games.length > 0 ? (
        <>
          <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
            {paginatedGames.map((game) => (
              <Col key={game.id}>
                <GameCard game={game} />
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
      ) : null}
    </Container>
  );
}
