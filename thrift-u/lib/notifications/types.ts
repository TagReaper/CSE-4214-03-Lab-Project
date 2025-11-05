/* eslint-disable @typescript-eslint/no-explicit-any */

export enum NotificationType {
  // General notifications
  SYSTEM_WARNING = "system_warning",

  // Buyer notifications
  ORDER_CONFIRMATION = "order_confirmation",
  CART_ITEM_REMOVED = "cart_item_removed",

  // Seller notifications
  ITEM_APPROVED = "item_approved",
  SELLER_APPLICATION_APPROVED = "seller_application_approved",
  SELLER_MODERATION_ACTION = "seller_moderation_action",
  NEW_ORDER = "new_order",
  ITEM_OUT_OF_STOCK = "item_out_of_stock",

  // Admin notifications
  NEW_SELLER_APPLICATION = "new_seller_application",
  NEW_SELLER_PRODUCT = "new_seller_product",
}

export enum NotificationCategory {
  ALERT = "alert",
  NOTIFICATION = "notification",
  WARNING = "warning",
  INFO = "info",
  SUCCESS = "success",
}

export enum UserRole {
  BUYER = "buyer",
  SELLER = "seller",
  ADMIN = "admin",
}

export interface NotificationDocument {
  notificationId: number;
  userId: string;
  userRole: UserRole;
  heading: string;
  description: string;
  date: Date;
  isRead: boolean;
  type: NotificationType;
  category: NotificationCategory;
  metadata?: Record<string, any>; // Additional data related to the notification
  actionUrl?: string; // URL to head to a page related to the notification
}

export interface INotificationHandler {
  getHeading(data: Record<string, any>): string;
  getDescription(data: Record<string, any>): string;
  getCategory(): NotificationCategory;
  getActionUrl?(data: Record<string, any>): string | undefined;
  process(
    userId: string,
    data: Record<string, any>,
    userRole: UserRole
  ): Omit<NotificationDocument, "notificationId" | "date" | "isRead">;
}
