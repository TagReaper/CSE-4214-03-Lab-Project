import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/lib/notifications/service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = params.id;
    const notificationService = NotificationService.getInstance();

    await notificationService.markAsRead(notificationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Failed to mark as read" },
      { status: 500 }
    );
  }
}
