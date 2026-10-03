import { authenticatedApiClient } from "@/lib/axios";

export const getUserProfile = async (userId: number) => {
  // The userId is interpolated, so an undefined one reaches the API as the
  // literal string "undefined" and comes back 400. react-query's `enabled`
  // does not cover this: refetch() ignores it.
  if (!Number.isFinite(userId)) {
    throw new Error("getUserProfile called without a userId");
  }
  const res = await authenticatedApiClient().get(`/common/profile?userId=${userId}`);
  return res.data.result;
};

export const getCurrentUser = async () => {
  const res = await authenticatedApiClient().get("/auth/me");
  return res.data.result;
};

export const logoutUser = async () => {
  const res = await authenticatedApiClient().post("/auth/logout");
  return res.data;
};