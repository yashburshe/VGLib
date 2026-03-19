import { useState, useEffect } from "react";

import UserProfile from "../components/UserProfile";
import { useParams } from "react-router";

export default function UserPage() {
  const { userId } = useParams();

  const [userProfile, setUserProfile] = useState({});

  const fetchAndSetUser = async () => {
    let fetched_user = await fetch(`/api/user/${userId}`);
    const user = await fetched_user.json();
    console.log(user);
    setUserProfile(user.user);
  };

  useEffect(() => {
    fetchAndSetUser();
  }, [userId]);

  return (
    <>
      <main className="profile-page">
        <UserProfile user={userProfile} external />
      </main>
    </>
  );
}
