import { Agent } from "@/lib/type";
import { authenticatedApiClient } from "@/lib/axios";

export const fetchAgents = async (userId: number) => {
  try {
    const res = await authenticatedApiClient().get(`/rcs/agent/user/${userId}`);
    const mapped: Agent[] = res.data.result.map((u: any) => ({
      id: String(u.id),
      name: u.agentname,
      agentdescription: u.agentdescription,
      billingcategory: u.billingcategory,
      status: u.status,
      phoneno: u.phoneno,
      email: u.email,
    }));
    return mapped;
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