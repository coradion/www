"use client";

import styled from "styled-components";
import {
  GoogleAuthProvider,
  signInWithPopup,
  AuthProvider,
  UserInfo,
  signOut,
} from "firebase/auth";
import { ProviderId } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";

const ProfilePhoto = styled.img.attrs({
  referrerPolicy: "no-referrer",
})`
  height: 10rem;
  width: 10rem;
  border-radius: 5rem;
  ::before {
    content: "👤";
    font-size: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
  }
`;

const Pane = styled.div`
  ${(p) => p.theme.css.glass};
  )flex: 1;
  margin: 1rem;
  padding: 1rem;
`;

const Name = styled.h3``;

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
      <Pane>
        <ProfilePhoto src={user?.photoURL ?? ""} />
        <Name>{user?.displayName ?? "Anonymous"}</Name>
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
      </Pane>
    </>
  );
};

export default ProfilePage;
