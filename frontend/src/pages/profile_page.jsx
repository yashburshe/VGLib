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
    const lists = await getUserLists();

    const previewGameIDs = [
      ...new Set(lists.flatMap((list) => (list.games || []).slice(0, 3))),
    ];

    const previewGames = await Promise.all(
      previewGameIDs.map(async (gameID) => {
        const game = await getGame(gameID);
        return [gameID, game];
      }),
    );

    const gameCoverByID = new Map(
      previewGames
        .filter(([, game]) => game?.cover_url)
        .map(([gameID, game]) => [gameID, game.cover_url]),
    );

    const listsWithPreviews = lists.map((list) => {
      const gameIDs = list.games || [];
      const previewGameCovers = gameIDs
        .slice(0, 3)
        .map((gameID) => gameCoverByID.get(gameID))
        .filter(Boolean);

      return {
        ...list,
        previewGameCovers,
        overflowCount: Math.max(gameIDs.length - 3, 0),
      };
    });

    setUserLists(listsWithPreviews);
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
