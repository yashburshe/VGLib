import { useState, useEffect } from "react";
import { redirect } from "react-router";

import UserProfile from "../components/UserProfile";
import UserLists from "../components/UserLists";

import  {getUser} from "../js/user.js";
import { getUserLists } from "../js/list.js";

export default function ProfilePage() {
  const tmp_user = {
      userID: "",
      username: "",
      profile_picture_url: "",
      createdAt: "",
  };

  const [userProfile, setUserProfile] = useState(tmp_user);
  const [userLists,   setUserLists  ] = useState([]);

  const fetchAndSetUser = async () => {
    let fetched_user = await getUser();
    if (!fetched_user) {
      console.error("profilePage.jsx: getUser failed!");
      redirect("/login");
    }
    setUserProfile(fetched_user);
  };

  const fetchAndSetLists = async () => {
    const tmp = await getUserLists();
    setUserLists(tmp);
  }

  useEffect(() => {
    fetchAndSetUser();
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
        <section className="lists-section">
          <h2>Your Lists</h2>
          <UserLists lists={userLists} />
        </section>
      </main>
    </>
  );
}
