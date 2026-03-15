import { useState, useEffect } from "react";
import { redirect } from "react-router";

import NavBar from "../components/Nav";
import UserProfile from "../components/UserProfile";
import UserLists from "../components/UserLists";

import  {getUser} from "../js/user";

export default function ProfilePage() {
  localStorage.setItem('token', "123444");
  const tmp_user = {
    userID: "1",
    username: "vgplayer",
    profile_picture_url: "https://ui-avatars.com/api/?name=VG&background=0D8ABC&color=fff&size=128",
    createdAt: "2025-09-25T13:43:02.000+00:00",
    };

  const lists = [
    {
      id: "l1",
      name: "Favorites",
      description: "My all-time favorite games.",
      count: 12,
    },
    {
      id: "l2",
      name: "To Play",
      description: "Games I want to play next.",
      count: 8,
    },
    {
      id: "l3",
      name: "Multiplayer",
      description: "Best games to play with friends.",
      count: 5,
    },
  ];

  const [userProfile, setUserProfile] = useState(tmp_user);

  const fetchAndSetUser = async () => {
    const fetched_user = await getUser();
    if (!fetched_user) {
      redirect("/login");
    }
    setUserProfile(fetched_user);
  };

  useEffect(() => {
    fetchAndSetUser();
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
      <NavBar />
      <main className="profile-page">
        <UserProfile
          user={userProfile}
          onEditProfile={handleEditProfile}
          onCreateList={handleCreateList}
          onCreateGame={handleCreateGame}
        />
        <section className="lists-section">
          <h2>Your Lists</h2>
          <UserLists lists={lists} />
        </section>
      </main>
    </>
  );
}
