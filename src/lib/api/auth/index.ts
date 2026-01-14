import { authenticatedApiClient } from "@/lib/axios";

export const getUserProfile = async (userId: string) => {
  const res = await authenticatedApiClient().get(`/profile?userId=${userId}`);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await authenticatedApiClient().get("/auth/me");
  return res.data;
};