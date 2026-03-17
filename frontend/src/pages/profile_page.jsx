import { useState, useEffect } from "react";
import { redirect } from "react-router";

import NavBar from "../components/Nav";
import UserProfile from "../components/UserProfile";
import UserLists from "../components/UserLists";

import  {getUser} from "../js/user";
import { getUserLists } from "../js/list";

export default function ProfilePage() {
  const tmp_user = {
    userID: "1",
    username: "vgplayer",
    profile_picture_url: "https://ui-avatars.com/api/?name=VG&background=0D8ABC&color=fff&size=128",
    createdAt: "2025-09-25T13:43:02.000+00:00",
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

  function handleCreateList() {
    alert("Create new list clicked");
  }

  function handleCreateGame() {
    alert("Create new game clicked");
  }
  return (
    <>
      <main className="profile-page">
        <UserProfile
          user={userProfile}
          onEditProfile={handleEditProfile}
          onCreateList={handleCreateList}
          onCreateGame={handleCreateGame}
        />
        <section className="lists-section">
          <h2>Your Lists</h2>
          <UserLists lists={userLists} />
        </section>
      </main>
    </>
  );
}
