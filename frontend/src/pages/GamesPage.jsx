import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container";

export default function GamesPage() {
    const [games, setGames] = useState([])

    useEffect(() => {
        const fetchGames = async () => {
            const res = await fetch("/api/games");
            const data = await res.json();
            console.log(data.games)

            setGames(data.games);
        }

        fetchGames();
    }, [])

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Games</h1>
            <Row xs={1} md={3} lg={6} className="g-4">
                {
                    games.map((game) => (
                        <Col key={game.id}>
                            <GameCard key={game.id} game={game} />
                        </Col>
                    ))
                }
            </Row >
        </Container>
    )
}