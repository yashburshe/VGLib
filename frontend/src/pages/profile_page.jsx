import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import UserProfile from "../components/UserProfile";
import UserLists from "../components/UserLists";
import UserGames from "../components/UserGames";

import  {getUser} from "../js/user.js";
import { getUserLists } from "../js/list.js";
import { getGamesByUser } from "../js/game.js";
import { Container } from "react-bootstrap";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState({});
  const [userLists,   setUserLists  ] = useState([]);
  const [userGames,   setUserGames  ] = useState([]);

  const fetchAndSetUser = async () => {
    let fetched_user = await getUser();
    if (!fetched_user) {
      console.error("profilePage.jsx: getUser failed!");
      navigate("/login");
    }
    setUserProfile(fetched_user);
  };

  const fetchAndSetLists = async () => {
    const tmp = await getUserLists();
    setUserLists(tmp);
  }

  const fetchAndSetGames = async (userID) => {
    const games = await getGamesByUser(userID);
    setUserGames(games);
  }

  useEffect(() => {
    const init = async () => {
      const fetchedUser = await getUser();
      if (!fetchedUser) {
        console.error("profilePage.jsx: getUser failed!");
        navigate("/login");
        return;
      }
      setUserProfile(fetchedUser);
      await fetchAndSetGames(fetchedUser.userID);
    };

    init();
    fetchAndSetLists();
  }, []);

  let listNames = [];
  if (userLists) {
    listNames = userLists.map((list) => list.name); 
  } 
 
  return (
    <>
      <main className="profile-page">
        <UserProfile
          user={userProfile}
          listNames={listNames}
        />
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
