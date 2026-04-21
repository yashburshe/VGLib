import { useState, useEffect } from "react";

import UserProfile from "../components/UserProfile";
import UserLists from "../components/UserLists";
import UserGames from "../components/UserGames";
import { useUser } from "../components/UserContext.jsx";

import { getUserLists } from "../js/list.js";
import { getGamesByUser } from "../js/game.js";
import { Container } from "react-bootstrap";

export default function ProfilePage() {
  const { user } = useUser();

  const [userLists, setUserLists] = useState([]);
  const fetchLists = async () => {
    const lists = await getUserLists();
    setUserLists(lists);
  };

  const [userGames, setUserGames] = useState([]);
  const fetchGames = async () => {
    const games = await getGamesByUser(user.userID);
    setUserGames(games);
  };

  useEffect(() => {
    if (user) {
      fetchLists();
      fetchGames();
    }
  }, [user]);

  const listNames = userLists.map((list) => list.name);
  if (!user) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <main className="profile-page">
        <UserProfile listNames={listNames} fetchLists={fetchLists} />
        <Container className="lists-section mt-4">
          <h2>My Lists</h2>
          <UserLists lists={userLists} fetchLists={fetchLists} />
        </Container>
        <Container className="lists-section mt-4">
          <h2>My Games</h2>
          <UserGames games={userGames} />
        </Container>
      </main>
    </>
  );
}
