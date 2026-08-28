import { authenticatedApiClient } from "@/lib/axios";
import type { AppNotification, NotificationListResponse } from "@/lib/type";

export const fetchNotifications = async (params?: {
  unread?: boolean;
  page?: number;
  limit?: number;
}): Promise<NotificationListResponse | null> => {
  try {
    const res = await authenticatedApiClient().get("/notifications", { params });
    return res.data.result;
  } catch (error) {
    console.log("Error fetching notifications:", error);
    return null;
  }
};

export const fetchUnreadNotificationCount = async (): Promise<number> => {
  try {
    const res = await authenticatedApiClient().get("/notifications/unread-count");
    return res.data.result?.unread ?? 0;
  } catch (error) {
    console.log("Error fetching unread notification count:", error);
    return 0;
  }
};

export const markNotificationRead = async (
  id: number
): Promise<AppNotification | null> => {
  try {
    const res = await authenticatedApiClient().patch(`/notifications/${id}/read`);
    return res.data.result;
  } catch (error) {
    console.log("Error marking notification read:", error);
    return null;
  }
};

export const markAllNotificationsRead = async (): Promise<boolean> => {
  try {
    await authenticatedApiClient().post("/notifications/read-all");
    return true;
  } catch (error) {
    console.log("Error marking all notifications read:", error);
    return false;
  }
};
