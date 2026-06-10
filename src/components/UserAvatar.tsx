"use client";
import Image from 'next/image';

import { useAuth } from "@workos-inc/authkit-nextjs/components";

export function UserAvatar() {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = (firstName: string | null, lastName: string | null) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "?";
  };

  return (
    <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center justify-center w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700 shadow-sm relative">
      {user.profilePictureUrl ? (
        <Image
          src={user.profilePictureUrl}
          fill
          alt={`${user.firstName || 'User'}'s profile`}
          className="object-cover"
        />
      ) : (
        <span className="text-zinc-600 dark:text-zinc-400 font-medium text-sm">
          {getInitials(user.firstName, user.lastName)}
        </span>
      )}
    </div>
  );
}
