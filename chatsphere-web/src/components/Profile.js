import React, { useState, useEffect } from 'react';
import { getProfile } from '../services/api';

const Profile = ({ match }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile(match.params.id);
      setProfile(data);
    };
    fetchProfile();
  }, [match.params.id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{profile.name}</h2>
      <img src={profile.profilePicture} alt="Profile" width="100" height="100" />
      <p>{profile.email}</p>
    </div>
  );
};

export default Profile;
