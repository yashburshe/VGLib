import EditProfileModalButton from "./EditProfileModalButton";
import NewGameModalButton from "./NewGameModalButton";
import NewListModalButton from "./NewListModalButton";
import DeleteAccountModalButton from "./DeleteAccountModalButton";

export default function UserProfile({ user, listNames}) {
  const { profile_picture_url, username, createdAt, profile_banner_phrase } = user;
  const yearJoined = new Date(createdAt).getFullYear();
  return (
    <section className="profile-header">
      <div className="profile-avatar">
        <img src={profile_picture_url} alt={`${username} avatar`} />
      </div>
      <div className="profile-info">
        <h2 className="profile-username">{username}</h2>
        <p>{profile_banner_phrase}</p>
        <p className="profile-joined">Joined {yearJoined}</p>
        <div className="profile-actions">
          <NewGameModalButton/>
          <NewListModalButton existingNames={listNames} />
          <EditProfileModalButton userProp={user}/>
          <DeleteAccountModalButton/>
        </div>
      </div>
    </section>
  );
}
