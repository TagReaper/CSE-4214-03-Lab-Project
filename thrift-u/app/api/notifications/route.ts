import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/lib/notifications/service";
import { NotificationType } from "@/lib/notifications/types";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notificationService = NotificationService.getInstance();
    const notifications = await notificationService.getUserNotifications(
      userId,
      50
    );

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const notificationService = NotificationService.getInstance();
    const notification = await notificationService.sendNotification(
      userId,
      type as NotificationType,
      data
    );

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
