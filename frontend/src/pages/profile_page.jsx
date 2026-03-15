import { useState, useEffect } from "react";
import NavBar from "../components/Nav";
import UserProfile from "../components/UserProfile";
import UserLists from "../components/UserLists";

async function getUser() {
  const token = "123445";
  //const token = localStorage.getItem('token');
  if (!token) {
    console.warn("No authentication token found");
    return null;
  }
  try {
    const response = await fetch('api/user/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type' : 'application/json'
      }
    });
    console.log("sent fetch request!");
    const data = await response.json();
    if (!response.ok) {
      console.error("Session invalid: ", data.message);
      localStorage.removeItem('token');
      return null;
    }
    console.log("User data: ", data.user);
    return data.user;
  } catch (error) {
    console.error(error);
    return null;
  }
}


export default function ProfilePage() {
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

  const getUserData = async () => {
    const fetched_user = await getUser();
    if (!fetched_user) {
      console.warn("No user data found, using default profile");
      return;
    }
    setUserProfile(fetched_user);
  };

  useEffect(() => {
    getUserData();
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
