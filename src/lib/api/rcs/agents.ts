import { authenticatedApiClient } from "@/lib/axios";

export const fetchAgents = async (userId: number) => {
  try {
    const res = await authenticatedApiClient().get(`/rcs/agent/user/${userId}`);
    return res.data.result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchAgentById = async (id: string)=>{
  try {
    const res = await authenticatedApiClient().get(`/rcs/agent/${id}`);
    return res.data.result;
  } catch (error) {
    console.log(error);
    return;
  }
}