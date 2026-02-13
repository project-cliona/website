import { RCSTemplate } from "@/lib/type";
import { authenticatedApiClient } from "@/lib/axios";

export const fetchTemplates = async (userId: number) => {
  try {
    const res = await authenticatedApiClient().get(`/rcs/template?userId=${userId}`);
    const mapped = res.data.result.map((u: RCSTemplate) => ({
      id: String(u.id),
      name: u.templateName,
      templateType: u.templateType,
      createdOn: u.createdOn,
      agentID: u.agentID,
      status: u.status.charAt(0).toUpperCase() + u.status.slice(1),
    }));
    return mapped;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchTemplatesByAgentID = async (agentId: string) => {
  try {
    const res = await authenticatedApiClient().get(`/rcs/template?agentId=${agentId}`);
    return res.data.result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getTemplateById = async(id: string) =>{
  try {
    const res = await authenticatedApiClient().get(`/rcs/template?id=${id}`);
    return res.data.result;
  } catch (error) {
    console.log(error);
    return;
  }
}

