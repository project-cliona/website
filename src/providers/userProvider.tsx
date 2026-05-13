"use client";

import React, { createContext, useContext, useEffect } from "react";
import { QueryObserverResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { User, UserProfile } from "@/lib/type";
import { getCurrentUser, getUserProfile, logoutUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ROLE_ADMIN, ROLE_RESELLER, ROLE_CLIENT, type Role } from "@/lib/rbac";

interface UserContextType {
    user: User | null;
    profile: UserProfile | null;
    userAuthLoading: boolean;
    role: Role | null;
    isAdmin: boolean;
    isReseller: boolean;
    isClient: boolean;
    hasRole: (allowed: Role[]) => boolean;
    refetchUser: () => Promise<QueryObserverResult<User, Error>>;
    refetchProfile: () => Promise<QueryObserverResult<UserProfile, Error>>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const queryClient = useQueryClient();

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

    const role: Role | null = user?.role ?? null;
    const isAdmin = role === ROLE_ADMIN;
    const isReseller = role === ROLE_RESELLER;
    const isClient = role === ROLE_CLIENT;
    const hasRole = (allowed: Role[]) => role !== null && allowed.includes(role);

    const logout = async () => {
        try {
            // 1. Notify backend to invalidate the token server-side
            await logoutUser();
        } catch {
            // Continue with client-side cleanup even if backend call fails
        } finally {
            // 2. Remove access token from localStorage
            localStorage.removeItem("accessToken");

            // 3. Sign out from Supabase to clear any active OAuth session
            await supabase.auth.signOut();

            // 4. Clear entire React Query cache — prevents stale user data
            //    from being accessible after logout (back-button attack)
            queryClient.clear();

            // 5. Redirect to login
            router.replace("/auth/login");
        }
    };

    useEffect(() => {
        if (userAuthLoading) return;

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
                role,
                isAdmin,
                isReseller,
                isClient,
                hasRole,
                refetchUser,
                refetchProfile,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};


// THIS WAS MISSING
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
};
