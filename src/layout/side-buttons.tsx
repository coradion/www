import { IconButton } from "../components/icon-button";
import { CoradionLogo } from "../components/coradion-logo";
import { ProfileButton } from "../components/profile-button";
import styled from "styled-components";
import { useShade } from "../contexts/shade";
import Link from "next/link";

const Aside = styled.aside`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  margin: 0.5rem;
  padding: 0.5rem;
`;

export const SideButtons = () => {
  const openShade = useShade();
  const openTaskEditor = () => {
    openShade(true);
  };
  return (
    <Aside>
      <Link href="/">
        <IconButton size="large" label="">
          <CoradionLogo />
        </IconButton>
      </Link>
      <ProfileButton />
      <IconButton size="large" label="" onClick={() => openTaskEditor()}>
        ➕
      </IconButton>
    </Aside>
  );
};
