import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import UserProfile from "../components/UserProfile";
import UserLists from "../components/UserLists";
import UserGames from "../components/UserGames";
import { useUser } from "../components/UserContext.jsx";

import { getUserLists } from "../js/list.js";
import { getGame, getGamesByUser } from "../js/game.js";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const navigate = useNavigate();

  const [userLists, setUserLists] = useState([]);
  const refreshUserLists = async () => {
    if (!user) return;
    const lists = await getUserLists();
    setUserLists(lists);
  };

  const [userGames, setUserGames] = useState([]);
  const refreshUserGames = async () => {
    if (!user) return;
    const games = await getGamesByUser(user.userID);
    setUserGames(games);
  };

  const handleListDeleted = (deletedListID) => {
    setUserLists((prev) =>
      prev.filter((list) => Number(list.listID) !== Number(deletedListID)),
    );
  };

  useEffect(() => {
    if (!user) return; // Don't fetch if user data isn't loaded yet
    const init = async () => {
      await refreshUserLists();
      await refreshUserGames();
    };
    init();
  }, [user]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [isUserLoading, user, navigate]);

  const listNames = userLists.map((list) => list.name);
  if (isUserLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <main className="profile-page">
        <UserProfile
          listNames={listNames}
          onListCreated={refreshUserLists}
          onGameCreated={refreshUserGames}
        />
        <Container className="lists-section mt-4">
          <h2>My Lists</h2>
          <UserLists lists={userLists} onListDeleted={handleListDeleted} />
        </Container>
        <Container className="lists-section mt-4">
          <h2>My Games</h2>
          <UserGames games={userGames} />
        </Container>
      </main>
    </>
  );
}
