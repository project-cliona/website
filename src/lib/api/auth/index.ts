import { authenticatedApiClient } from "@/lib/axios";

export const getUserProfile = async (userId: number) => {
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