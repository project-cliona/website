import { authenticatedApiClient } from "@/lib/axios";

export const getUserProfile = async (userId: number) => {
  console.log("this is the get user profile api call function")
  const res = await authenticatedApiClient().get(`/common/profile?userId=${userId}`);
  return res.data.result;
};

export const getCurrentUser = async () => {
  console.log("this is the get user api call function")
  const res = await authenticatedApiClient().get("/auth/me");
  return res.data.result;
};