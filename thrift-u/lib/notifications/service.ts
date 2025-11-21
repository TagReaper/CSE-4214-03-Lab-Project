/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb } from "@/firebase/adminApp";
import {
  NotificationDocument,
  NotificationType,
  INotificationHandler,
} from "./types";
import {
  SystemWarningHandler,
  OrderConfirmationHandler,
  ItemApprovedHandler,
  SellerApplicationApprovedHandler,
  SellerModerationActionHandler,
  NewOrderHandler,
  NewSellerApplicationHandler,
  NewSellerProductHandler,
  ItemOutOfStockHandler,
  CartItemRemovedHandler,
  OrderShippedHandler,
  OrderRefundedHandler,
} from "./handler";

export class NotificationService {
  private static instance: NotificationService;
  private handlers: Map<NotificationType, INotificationHandler>;
  private collectionName: string = "Notifications";

  private constructor() {
    this.handlers = new Map();
    this.registerDefaultHandlers();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private registerDefaultHandlers(): void {
    // General handlers
    this.registerHandler(
      NotificationType.SYSTEM_WARNING,
      new SystemWarningHandler()
    );

    // Buyer handlers
    this.registerHandler(
      NotificationType.ORDER_CONFIRMATION,
      new OrderConfirmationHandler()
    );
    this.registerHandler(
      NotificationType.CART_ITEM_REMOVED,
      new CartItemRemovedHandler()
    );
    this.registerHandler(
      NotificationType.ORDER_SHIPPED,
      new OrderShippedHandler()
    );

    // Seller handlers
    this.registerHandler(
      NotificationType.ITEM_APPROVED,
      new ItemApprovedHandler()
    );

    this.registerHandler(
      NotificationType.SELLER_APPLICATION_APPROVED,
      new SellerApplicationApprovedHandler()
    );

    this.registerHandler(
      NotificationType.SELLER_MODERATION_ACTION,
      new SellerModerationActionHandler()
    );

    this.registerHandler(NotificationType.NEW_ORDER, new NewOrderHandler());

    this.registerHandler(
      NotificationType.ORDER_REFUNDED,
      new OrderRefundedHandler()
    );

    this.registerHandler(
      NotificationType.ITEM_OUT_OF_STOCK,
      new ItemOutOfStockHandler()
    );

    // Admin handlers
    this.registerHandler(
      NotificationType.NEW_SELLER_APPLICATION,
      new NewSellerApplicationHandler()
    );

    this.registerHandler(
      NotificationType.NEW_SELLER_PRODUCT,
      new NewSellerProductHandler()
    );
  }

  public registerHandler(
    type: NotificationType,
    handler: INotificationHandler
  ): void {
    this.handlers.set(type, handler);
  }

  public async sendNotification(
    userId: string,
    type: NotificationType,
    data: any
  ): Promise<NotificationDocument> {
    const handler = this.handlers.get(type);

    if (!handler) {
      throw new Error(`No handler registered for notification type: ${type}`);
    }

    const notificationData = handler.process(userId, data);

    const newNotificationRef = adminDb.collection(this.collectionName).doc();

    const notificationId = newNotificationRef.id;

    const notification: NotificationDocument = {
      notificationId,
      date: new Date(),
      isRead: false,
      ...notificationData,
    };

    await newNotificationRef.set({
      ...notification,
      date: notification.date.toISOString(),
    });

    return notification;
  }

  public async getUserNotifications(
    userId: string,
    limit: number = 50
  ): Promise<NotificationDocument[]> {
    const query = adminDb
      .collection(this.collectionName)
      .where("userId", "==", userId);

    const snapshot = await query.orderBy("date", "desc").limit(limit).get();

    return snapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          date: new Date(doc.data().date),
        } as NotificationDocument)
    );
  }

  public async markAsRead(notificationId: string): Promise<void> {
    await adminDb
      .collection(this.collectionName)
      .doc(notificationId.toString())
      .update({ isRead: true });
  }

  public async markAllAsRead(userId: string): Promise<void> {
    const snapshot = await adminDb
      .collection(this.collectionName)
      .where("userId", "==", userId)
      .where("isRead", "==", false)
      .get();

    const batch = adminDb.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();
  }

  public async deleteNotification(notificationId: string): Promise<void> {
    await adminDb
      .collection(this.collectionName)
      .doc(notificationId.toString())
      .delete();
  }

  public async notifyAllAdmins(
    type: NotificationType,
    data: any
  ): Promise<void> {
    const adminIds = await this.getAdminUserIds();
    console.warn(`notifying ids: ${adminIds.join(", ")}`);
    await Promise.all(
      adminIds.map((adminId) => this.sendNotification(adminId, type, data))
    );
  }

  private async getAdminUserIds(): Promise<string[]> {
    const adminQuerySnapshot = await adminDb
      .collection("User")
      .where("accessLevel", "==", "Admin")
      .get();

    if (adminQuerySnapshot.empty) {
      return [];
    }

    const adminIds = adminQuerySnapshot.docs.map((doc) => doc.id);
    console.warn(`got admin ids: ${adminIds.join(", ")}`);

    return adminIds;
  }
}
