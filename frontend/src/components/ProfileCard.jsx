import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router';

export default function ProfileCard({ user, renderProp }) {
  if (!user) return null;

  const joinedYear = user.createdAt
    ? new Date(user.createdAt).getFullYear()
    : null;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="p-3 text-center">
        <Image
          roundedCircle
          className="mb-3"
          src={user.profile_picture_url}
          alt={`${user.username} avatar`}
          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
        />
        <Link to={`/users/${user.userID}`}>
          <Card.Title className="fs-6 fw-bold mb-4 text-dark">
            {user.username}
          </Card.Title>
        </Link>
        {joinedYear ? (
          <Card.Text className="text-muted mb-3">Joined {joinedYear}</Card.Text>
        ) : null}
        {renderProp || null}
      </Card.Body>
    </Card>
  );
}
