import EditProfileModalButton from './EditProfileModalButton';
import NewGameModalButton from './NewGameModalButton';
import NewListModalButton from './NewListModalButton';
import DeleteAccountModalButton from './DeleteAccountModalButton';
import { Container, Image } from 'react-bootstrap';

export default function UserProfile({ user, listNames, external = false }) {
  const { profile_picture_url, username, createdAt, profile_banner_phrase } =
    user;
  const yearJoined = new Date(createdAt).getFullYear();
  return (
    <Container className="center mt-4">
      <Image
        className="mx-auto d-block"
        roundedCircle
        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
        src={profile_picture_url}
        alt={`${username} avatar`}
      />
      <div className="profile-info">
        <h2 className="profile-username">{username}</h2>
        <p>{profile_banner_phrase}</p>
        <p className="profile-joined">Joined {yearJoined}</p>
        {external ? (
          ''
        ) : (
          <div className="profile-actions">
            <NewGameModalButton />
            <NewListModalButton existingNames={listNames} />
            <EditProfileModalButton userProp={user} />
            <DeleteAccountModalButton />
          </div>
        )}
      </div>
    </Container>
  );
}
