// import { authenticatedApiClient } from "@/lib/axios";
// import { WhatsappContact } from "@/lib/type";

// export const fetchWhatsappContacts = async (): Promise<WhatsappContact[]> => {
//   try {
//     const res = await authenticatedApiClient().get("/whatsApp/contacts");
//     return res.data.result;
//   } catch (error) {
//     console.log("Error fetching WhatsApp contacts:", error);
//     return [];
//   }
// };

// export const addWhatsappContact = async (data: any) => {
//   const res = await authenticatedApiClient().post("/whatsApp/contacts", data);
//   return res.data.result;
// };
