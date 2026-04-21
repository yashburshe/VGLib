import { useState, useEffect } from "react";

import UserProfile from "../components/UserProfile";
import UserLists from "../components/UserLists";
import UserGames from "../components/UserGames";
import { useUser } from "../components/UserContext.jsx";

import { getUserLists } from "../js/list.js";
import { getGame, getGamesByUser } from "../js/game.js";
import { Container } from "react-bootstrap";

export default function ProfilePage() {
  const { user } = useUser();

  const [userLists, setUserLists] = useState([]);
  const [userGames, setUserGames] = useState([]);

  const refreshUserGames = async () => {
    if (!user) return;
    const games = await getGamesByUser(user.userID);
    setUserGames(games);
  };

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

  const listNames = userLists.map((list) => list.name);
  if (!user) {
    return <p>Loading...</p>;
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
          <h2>Your Lists</h2>
          <UserLists lists={userLists} onListDeleted={handleListDeleted} />
        </Container>
        <Container className="lists-section mt-4">
          <h2>Games You Created</h2>
          <UserGames games={userGames} />
        </Container>
      </main>
    </>
  );
}
