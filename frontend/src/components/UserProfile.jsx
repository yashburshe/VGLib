import React from "react";
import NewGameModalButton from "./NewGameModalButton";
import NewListModalButton from "./NewListModalButton";

export default function UserProfile({
  user,
  onEditProfile,
  onCreateList,
  onCreateGame,
}) {
  const existingNames = []; // This should be fetched from the user's existing lists

  const { profile_picture_url, username, createdAt } = user;
  const yearJoined = new Date(createdAt).getFullYear();

  return (
    <section className="profile-header">
      <div className="profile-avatar">
        <img src={profile_picture_url} alt={`${username} avatar`} />
      </div>
      <div className="profile-info">
        <h2 className="profile-username">{username}</h2>
        <p className="profile-joined">Joined {yearJoined}</p>
        <div className="profile-actions">
          <button className="btn btn-primary" onClick={onEditProfile}>
            Edit Profile
          </button>
          <NewGameModalButton onCreateGame={onCreateGame} />
          <NewListModalButton onAddList={onCreateList} existingNames={existingNames} />
        </div>
      </div>
    </section>
  );
}
