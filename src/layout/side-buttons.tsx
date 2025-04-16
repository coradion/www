import { CoradionLogo } from "../components/coradion-logo";
import { ProfileButton } from "../components/profile-button";
import { useShade } from "../contexts/shade";
import Link from "next/link";

export const SideButtons = () => {
  const openShade = useShade();
  const openTaskEditor = () => {
    openShade(true);
  };
  return (
    <>
      <Link href="/">
        <button className="btn">
          <CoradionLogo />
        </button>
      </Link>
      <ProfileButton />
      <button className="btn" onClick={() => openTaskEditor()}>
        ➕
      </button>
    </>
  );
};
