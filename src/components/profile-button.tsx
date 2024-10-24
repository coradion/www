// import { useServiceWorker } from "../contexts/service-worker";
import { IconButton } from "./icon-button";
import Link from "next/link";
import { useCurrent } from "../hooks/useCurrent";

export const ProfileButton = () => {
  const user = useCurrent("User");
  console.log({ user });

  return (
    <Link href="/profile">
      <IconButton size="large" label="">
        {user === null || typeof user === "undefined" ? (
          "👤"
        ) : (
          <img
            // @ts-ignore
            src={user.photoURL}
            style={{ width: "3rem", height: "3rem", borderRadius: "1rem" }}
            referrerPolicy="no-referrer"
          />
        )}
      </IconButton>
    </Link>
  );
};
