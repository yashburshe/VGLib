import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Trash } from 'react-bootstrap-icons';

import { getList, deleteList, toggleGameInList } from "../js/list";
import { getGame } from "../js/game";
import GameCard from "../components/GameCard";

export default function GameDetailsPage() {
    const { listId } = useParams();
    const navigate = useNavigate();

    const [listDetails, setListDetails] = useState({})
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchListDetails = async () => {
            const details = await getList(listId);
            setListDetails(details);

            if (details?.games?.length > 0) {
                const fetchedGames = await Promise.all(
                    details.games.map((gameId) => getGame(gameId))
                );
                setGames(fetchedGames);
            }
        }
        fetchListDetails();
    }, []);

    const requiredLists = ["Favorites", "Wishlist", "Owned"];
    const isDefaultList = requiredLists.includes(listDetails.name);

    const DeleteListButton = () => {
        return (<>
        <Button variant="danger">
            <Trash size={20} onClick={() => {
                deleteList(listId);
                alert("List deleted!");
                navigate('/profile');
            }}/>
        </Button>
        </>);
    };

    const UnsetItemFromListButton = ({gameID, listID}) => {
        return (<>
        <Button variant="danger">
            <Trash 
                size={20} onClick={() => {
                    console.log("removing game from list: ", gameID, listID);
                    const result = toggleGameInList(listID, gameID);
                    console.log("tried removing game from list: result: ", result);
                }}/>
        </Button>
        </>);
    }

    return (
        <Container className="mt-4">
            <Col md={8} lg={9}>
                <h1>{listDetails.name}</h1>
                {isDefaultList ? (<></>) : (<DeleteListButton/>)}
                <p>{listDetails.description ?? "No Description"}</p>
                <h3 className='mt-4'>Games in this list</h3>
                <Row className="mt-3">
                    {games.lengh === 0 && (<p>No games added!</p>)}
                    {games?.length > 0 && games.map((game) => (
                        <Col key={game.id}> 
                            <GameCard 
                                key={game.id} 
                                game={game} 
                                renderProp={<UnsetItemFromListButton gameID={game.id} listID={listId}/>}
                            />
                        </Col>
                    ))}
                </Row>
            </Col>
        </Container>
    )
}