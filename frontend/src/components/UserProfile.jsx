import { Container, Image } from "react-bootstrap";

import EditProfileModalButton from "./EditProfileModalButton";
import NewGameModalButton from "./NewGameModalButton";
import NewListModalButton from "./NewListModalButton";
import DeleteAccountModalButton from "./DeleteAccountModalButton";
import { useUser } from "./UserContext.jsx";

import "../css/profile.css";

export default function UserProfile({
  listNames,
  onListCreated,
  external = false,
}) {
  const { user } = useUser();
  const yearJoined = new Date(user.createdAt).getFullYear();
  return (
    <Container className="center mt-4">
      <Image
        className="mx-auto d-block"
        roundedCircle
        style={{ width: "150px", height: "150px", objectFit: "cover" }}
        src={user.profile_picture_url}
        alt={`${user.username} avatar`}
      />
      <div className="profile-info">
        <h2 className="profile-username">{user.username}</h2>
        <p>{user.profile_banner_phrase}</p>
        <p className="profile-joined">Joined {yearJoined}</p>
        {external ? (
          ""
        ) : (
          <div className="profile-actions">
            <NewGameModalButton />
            <NewListModalButton
              existingNames={listNames}
              onListCreated={onListCreated}
            />
            <EditProfileModalButton userProp={user} />
            <DeleteAccountModalButton />
          </div>
        )}
      </div>
    </Container>
  );
}
