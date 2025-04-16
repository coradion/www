import Link from "next/link";
import { useCurrent } from "../hooks/useCurrent";

export const ProfileButton = () => {
  const user = useCurrent("User");
  console.log({ user });

  return (
    <Link href="/profile">
      <button className="btn">
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
      </button>
    </Link>
  );
};
