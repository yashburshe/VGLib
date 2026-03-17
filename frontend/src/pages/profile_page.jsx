import { useState, useEffect } from "react";
import { redirect } from "react-router";

import UserProfile from "../components/UserProfile";
import UserLists from "../components/UserLists";

import  {getUser} from "../js/user";
import { getUserLists } from "../js/list";
import { createGame} from "../js/game";

export default function ProfilePage() {
  const tmp_user = {
      userID: "",
      username: "",
      profile_picture_url: "",
      createdAt: "",
  };

  const [userProfile, setUserProfile] = useState(tmp_user);
  const [userLists,   setUserLists  ] = useState([]);

  const fetchAndSetUser = async () => {
    let fetched_user = await getUser();
    if (!fetched_user) {
      redirect("/login");
    }
    setUserProfile(fetched_user);
  };

  const fetchAndSetLists = async () => {
    const userLists = await getUserLists();
    setUserLists(userLists);
  }

  useEffect(() => {
    fetchAndSetUser();
    fetchAndSetLists();
  }, []);

  function handleEditProfile() {
    alert("Edit profile clicked");
  }

  return (
    <>
      <main className="profile-page">
        <UserProfile
          user={userProfile}
          onEditProfile={handleEditProfile}
          onCreateList={(listName) => alert("New List Created!")}
          onCreateGame={(game) => createGame(game)}
        />
        <section className="lists-section">
          <h2>Your Lists</h2>
          <UserLists lists={userLists} />
        </section>
      </main>
    </>
  );
}
