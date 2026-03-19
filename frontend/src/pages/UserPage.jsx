import { useState, useEffect } from 'react';

import UserProfile from '../components/UserProfile';
import UserLists from '../components/UserLists';
import UserGames from '../components/UserGames';
import { useParams } from 'react-router';
import { Container } from 'react-bootstrap';
import { getGamesByUser } from '../js/game';

export default function UserPage() {
  const { userId } = useParams();

  const [userProfile, setUserProfile] = useState({});
  const [userLists, setUserLists] = useState([]);
  const [userGames, setUserGames] = useState([]);

  const fetchAndSetUser = async () => {
    let fetched_user = await fetch(`/api/user/${userId}`);
    const user = await fetched_user.json();
    console.log(user);
    setUserProfile(user.user);
  };

  const fetchAndSetLists = async () => {
    const tmp = await fetch(`/api/list/userlist/${userId}`);
    const lists = await tmp.json();
    console.log(lists);
    setUserLists(Array.isArray(lists.lists) ? lists.lists : []);
  };

  const fetchAndSetGames = async () => {
    const games = await getGamesByUser(userId);
    setUserGames(games);
  };

  useEffect(() => {
    fetchAndSetUser();
    fetchAndSetLists();
    fetchAndSetGames();
  }, [userId]);

  let listNames = [];
  //   if (userLists.length > 0) {
  //     listNames = userLists.map((list) => list.name);
  //   }

  return (
    <>
      <main className="profile-page">
        <UserProfile user={userProfile} external />
      </main>
    </>
  );
}
