"use server";

import { NotificationService } from "@/lib/notifications/service";
import { NotificationType } from "@/lib/notifications/types";

const notifService = NotificationService.getInstance();

export async function notifyAdminsNewSeller(applicantId, applicantName) {
  console.warn("sending notifcaiton");
  try {
    await notifService.notifyAllAdmins(
      NotificationType.NEW_SELLER_APPLICATION,
      {
        applicantId: applicantId,
        applicantName: applicantName,
      }
    );
    return { success: true };
  } catch (error) {
    console.error("Error notifying admins:", error);
    return { success: false, error: error.message };
  }
}
