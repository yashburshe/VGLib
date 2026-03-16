import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router';

export default function GameCard({ game }) {
    return (
        <Card className='h-100 shadow-sm'>
            <Card.Img style={{ objectFit: 'cover', height: '250px' }} variant="top" src={game.cover_url} />
            <Card.Body className='p-3'>
                <Link to={`/games/${game.id}`}>
                    <Card.Title className='fs-6 fw-bold mb-4 text-dark'>{game.name}</Card.Title>
                </Link>
                <Button size='sm' variant='outline-primary'>Add To List</Button>
            </Card.Body>
        </Card>

    )
}