import { authenticatedApiClient } from "@/lib/axios";

export const fetchAgents = async () => {
  const res = await authenticatedApiClient().get("/rcs/agent/user/2");
  return res.data;
};