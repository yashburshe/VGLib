import React from "react";

export default function UserProfile({
  user,
  onEditProfile,
  onCreateList,
  onCreateGame,
}) {
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
          <button className="btn btn-secondary" onClick={onCreateList}>
            Create New List
          </button>
          <button className="btn btn-secondary" onClick={onCreateGame}>
            Create New Game
          </button>
        </div>
      </div>
    </section>
  );
}
