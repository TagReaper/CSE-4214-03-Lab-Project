import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/lib/notifications/service";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = params.id;
    const notificationService = NotificationService.getInstance();

    await notificationService.deleteNotification(notificationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
