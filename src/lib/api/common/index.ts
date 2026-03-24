import { authenticatedApiClient } from "@/lib/axios";
import { serviceStatus } from "@/lib/type";

export interface UpdateServicePayload {
    serviceId: number;
    status: serviceStatus;
}

export const updateProfileServices = async (
    profileId: number,
    services: UpdateServicePayload[]
) => {
    const response = await authenticatedApiClient().put(
        `/common/profile/${profileId}?serviceUpdation=true`,
        services
    );

    return response.data;
};