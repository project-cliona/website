"use client";

import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, UserProfile } from "@/lib/type";
import { getCurrentUser, getUserProfile } from "@/lib/api/auth";

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  userAuthLoading: boolean;
  refetchUser: () => void;
  refetchProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch profile only if user exists
  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery<UserProfile>({
    queryKey: ["userProfile", user?.id],
    queryFn: () => getUserProfile(user!.id),
    enabled: !!user,
  });

  const userAuthLoading = userLoading || profileLoading;

  return (
    <UserContext.Provider
      value={{
        user: user ?? null,
        profile: profile ?? null,
        userAuthLoading,
        refetchUser,
        refetchProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
