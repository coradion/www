import Link from "next/link";
import { CoradionLogo } from "../components/coradion-logo";
import { ProfileButton } from "../components/profile-button";
import { useShade } from "../contexts/shade";

export const SideButtons = () => {
  const openShade = useShade();
  const openTaskEditor = () => {
    openShade(true);
  };
  return (
    <>
      <Link href="/">
        <button type="button" className="btn">
          <CoradionLogo />
        </button>
      </Link>
      <ProfileButton />
      <button type="button" className="btn" onClick={() => openTaskEditor()}>
        ➕
      </button>
    </>
  );
};
