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
  const [userGames, setUserGames] = useState([]);

  useEffect(() => {
    if (!user) return; // Don't fetch if user data isn't loaded yet
    const init = async () => {
      const lists = await getUserLists();
      setUserLists(lists);

      const games = await getGamesByUser(user.userID);
      setUserGames(games);
    };
    init();
  }, [user]);

  const listNames = userLists.map((list) => list.name);
  if (!user) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <main className="profile-page">
        <UserProfile listNames={listNames} />
        <Container className="lists-section mt-4">
          <h2>Your Lists</h2>
          <UserLists lists={userLists} />
        </Container>
        <Container className="lists-section mt-4">
          <h2>Games You Created</h2>
          <UserGames games={userGames} />
        </Container>
      </main>
    </>
  );
}
