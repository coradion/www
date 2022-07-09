// import { useServiceWorker } from "../contexts/service-worker";
import { IconButton } from "./icon-button";
import Link from "next/link";

export const ProfileButton = () => {
  const user = null;
  return (
    <Link href="/profile">
      <IconButton>
        {user === null || typeof user === "undefined" ? (
          "👤"
        ) : (
          <img
            // src={user.photoURL}
            style={{ width: "3rem", height: "3rem", borderRadius: "1rem" }}
          />
        )}
      </IconButton>
    </Link>
  );
};
