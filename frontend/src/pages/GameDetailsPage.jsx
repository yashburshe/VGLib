import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Image from "react-bootstrap/Image"
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

export default function GameDetailsPage() {
    const { gameId } = useParams();
    const [gameDetails, setGameDetails] = useState({})

    useEffect(() => {
        const fetchGameDetails = async () => {
            const res = await fetch(`/api/games/${gameId}`)
            const data = await res.json();
            console.log(data);
            setGameDetails(data.game)
        }

        fetchGameDetails();
    }, [])

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
                        <Button variant="primary">
                            Add to List
                        </Button>
                        <Button variant="danger">
                            Delete Game
                        </Button>
                    </div>
                </Col>

                <Col md={8} lg={9}>
                    <h1>{gameDetails.name}</h1>
                    <p>{gameDetails.summary}</p>
                    <p>Rating: {Math.round(gameDetails.rating)}</p>
                    <p>Platforms: {gameDetails.platforms?.join(', ')}</p>
                </Col>
            </Row>
        </Container>
    )
}