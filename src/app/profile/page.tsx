"use client";

import {
  AuthProvider,
  GoogleAuthProvider,
  ProviderId,
  signInWithPopup,
  signOut,
  UserInfo,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";

type ProviderIds = (typeof ProviderId)[keyof typeof ProviderId];

const authProviders: {
  [ProviderId.GOOGLE]: { name: string; getProvider: () => GoogleAuthProvider };
} = {
  [ProviderId.GOOGLE]: {
    name: "Google",
    getProvider: () => new GoogleAuthProvider(),
  },
  /*  [ProviderId.FACEBOOK]: {
    name: "Facebook",
    getProvider: () => new FacebookAuthProvider(),
  },
  [ProviderId.GITHUB]: {
    name: "GitHub",
    getProvider: () => new GithubAuthProvider(),
  },
  [ProviderId.TWITTER]: {
    name: "Twitter",
    getProvider: () => new TwitterAuthProvider(),
  },*/
};

type ReduceProviderDataToActiveProviders = (
  activeProviders: Set<ProviderIds>,
  userInfo: UserInfo,
) => Set<ProviderIds>;

const reduceProviderDataToActiveProviders: ReduceProviderDataToActiveProviders =
  (activeProviders, { providerId }) =>
    activeProviders.add(providerId as ProviderIds);

const initialActiveProviders = new Set();

const ProfilePage = () => {
  //const workbox = useServiceWorker();
  const { auth, user } = useAuth();
  const [activeProviders, setActiveProviders] = useState(
    initialActiveProviders,
  );
  useEffect(() => {
    if (user === null) {
      setActiveProviders(initialActiveProviders);
      return;
    }
    const { providerData } = user;
    const newActiveProviders = providerData.reduce(
      reduceProviderDataToActiveProviders,
      new Set(),
    );
    setActiveProviders(newActiveProviders);
  }, [user]);
  const handleSignIn = (provider: AuthProvider) => {
    if (auth === null) return;
    signInWithPopup(auth, provider);
  };
  const handleSignOut = () => {
    if (auth === null) return;
    signOut(auth);
  };

  return (
    <>
      <div>
        <div className="avatar w-24 rounded">
          {user?.photoURL && <img src={user?.photoURL} />}
        </div>
        <div>{user?.displayName ?? "Anonymous"}</div>
        <h4>Connected Accounts</h4>
        {Object.entries(authProviders).map(([key, { name, getProvider }]) => (
          <button
            key={key}
            disabled={activeProviders.has(key)}
            onClick={() => handleSignIn(getProvider())}
          >
            {name}
          </button>
        ))}
        <button onClick={() => handleSignOut()}>Sign Out</button>
      </div>
    </>
  );
};

export default ProfilePage;
