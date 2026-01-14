"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, UserProfile } from "@/lib/type";
import { getCurrentUser, getUserProfile } from "@/lib/api/auth";
import { useRouter, usePathname } from "next/navigation";

interface UserContextType {
    user: User | null;
    profile: UserProfile | null;
    userAuthLoading: boolean;
    refetchUser: () => Promise<any>;
    refetchProfile: () => Promise<any>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();

    const {
        data: user,
        isLoading: userLoading,
        refetch: refetchUser,
    } = useQuery<User>({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        staleTime: 1000 * 60 * 5,
    });

    const {
        data: profile,
        isLoading: profileLoading,
        refetch: refetchProfile,
    } = useQuery<UserProfile>({
        queryKey: ["userProfile", user?.userId],
        enabled: !!user?.userId,
        queryFn: ({ queryKey }) => {
            const [, userId] = queryKey as ["userProfile", number];
            return getUserProfile(userId);
        },
    });

    const userAuthLoading = userLoading || profileLoading;

    useEffect(() => {
        if (userAuthLoading)

        if (!user) {
            router.replace("/auth/login");
            return;
        }
       
        if (!profile) return;

        if (profile?.profileStatus === "incomplete") {
            router.replace("/kyc");
            return;
        }
        
        if (profile?.profileStatus === "active") {
            router.replace("/app");
        }
    }, [user, profile, userAuthLoading, router]);

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


// ✅ THIS WAS MISSING 👇
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
};
