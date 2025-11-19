/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  INotificationHandler,
  NotificationCategory,
  NotificationType,
  NotificationDocument,
} from "./types";

// GENERAL NOTIFICATION HANDLERS

export class SystemWarningHandler implements INotificationHandler {
  getHeading(data: { action: string }): string {
    return `Moderation Action: ${data.action}`;
  }

  getDescription(data: { reason: string; action: string }): string {
    return `Your account has received a ${data.action.toLowerCase()} due to: ${
      data.reason
    }.`;
  }

  getCategory(): NotificationCategory {
    return NotificationCategory.WARNING;
  }

  getActionUrl(): string | undefined {
    return "/account";
  }

  process(
    userId: string,
    data: Record<string, any>
  ): Omit<NotificationDocument, "notificationId" | "date" | "isRead"> {
    return {
      userId,
      heading: this.getHeading(data as { action: string }),
      description: this.getDescription(
        data as { reason: string; action: string }
      ),
      type: NotificationType.SYSTEM_WARNING,
      category: this.getCategory(),
      actionUrl: this.getActionUrl(),
      metadata: {
        action: data.action,
        reason: data.reason,
      },
    };
  }
}

// BUYER NOTIFICATION HANDLERS

export class OrderConfirmationHandler implements INotificationHandler {
  getHeading(data: { orderId: string }): string {
    return `Order Confirmed ${data.orderId}`;
  }

  getDescription(data: {
    orderId: string;
    totalAmount: number;
    itemCount: number;
  }): string {
    return `Your order of ${
      data.itemCount
    } item(s) totaling ${data.totalAmount.toFixed(
      2
    )} has been confirmed and is being processed.`;
  }

  getCategory(): NotificationCategory {
    return NotificationCategory.SUCCESS;
  }

  getActionUrl(data: { orderId: string }): string | undefined {
    return `/account/orders/${data.orderId}`;
  }

  process(
    userId: string,
    data: Record<string, any>
  ): Omit<NotificationDocument, "notificationId" | "date" | "isRead"> {
    return {
      userId,

      heading: this.getHeading(data as { orderId: string }),
      description: this.getDescription(
        data as { orderId: string; totalAmount: number; itemCount: number }
      ),
      type: NotificationType.ORDER_CONFIRMATION,
      category: this.getCategory(),
      actionUrl: this.getActionUrl(data as { orderId: string }),
      metadata: { orderId: data.orderId, totalAmount: data.totalAmount },
    };
  }
}

export class OrderShippedHandler implements INotificationHandler {
  getHeading(data: { orderId: string }): string {
    return `Order shipped ${data.orderId}`;
  }

  getDescription(data: { orderId: string; trackingNumber: string }): string {
    return `Your order: ${data.orderId} has been shipped with tracking number ${data.trackingNumber} and is on the way to you.`;
  }

  getCategory(): NotificationCategory {
    return NotificationCategory.SUCCESS;
  }

  getActionUrl(data: { orderId: string }): string | undefined {
    return `/account/orders/${data.orderId}`;
  }

  process(
    userId: string,
    data: Record<string, any>
  ): Omit<NotificationDocument, "notificationId" | "date" | "isRead"> {
    return {
      userId,

      heading: this.getHeading(data as { orderId: string }),
      description: this.getDescription(
        data as { orderId: string; trackingNumber: string }
      ),
      type: NotificationType.ORDER_SHIPPED,
      category: this.getCategory(),
      actionUrl: this.getActionUrl(data as { orderId: string }),
      metadata: { orderId: data.orderId, trackingNumber: data.trackingNumber },
    };
  }
}

export class CartItemRemovedHandler implements INotificationHandler {
  getHeading(): string {
    return `Item Removed from Cart`;
  }

  getDescription(data: { itemName: string }): string {
    return `Item: "${data.itemName}" has been removed from your cart as it is no longer available. Please review your cart for other items.`;
  }

  getCategory(): NotificationCategory {
    return NotificationCategory.NOTIFICATION;
  }

  getActionUrl(): string | undefined {
    return "/cart";
  }

  process(
    userId: string,
    data: any
  ): Omit<NotificationDocument, "notificationId" | "date" | "isRead"> {
    return {
      userId,

      heading: this.getHeading(),
      description: this.getDescription(data),
      type: NotificationType.CART_ITEM_REMOVED,
      category: this.getCategory(),
      actionUrl: this.getActionUrl(),
      metadata: { itemId: data.itemId, itemName: data.itemName },
    };
  }
}

// SELLER NOTIFICATION HANDLERS

export class ItemApprovedHandler implements INotificationHandler {
  getHeading(data: { itemName: string }): string {
    return `Product Approved: ${data.itemName}`;
  }

  getDescription(data: { itemName: string; itemId: string }): string {
    return `Your product "${data.itemName}" has been approved and is now live on the marketplace.`;
  }

  getCategory(): NotificationCategory {
    return NotificationCategory.SUCCESS;
  }

  getActionUrl(): string {
    return `/seller/products`;
  }

  process(
    userId: string,
    data: any
  ): Omit<NotificationDocument, "notificationId" | "date" | "isRead"> {
    return {
      userId,
      heading: this.getHeading(data),
      description: this.getDescription(data),
      type: NotificationType.ITEM_APPROVED,
      category: this.getCategory(),
      actionUrl: this.getActionUrl(),
      metadata: { itemId: data.itemId, itemName: data.itemName },
    };
  }
}

export class SellerApplicationApprovedHandler implements INotificationHandler {
  getHeading(): string {
    return "Congratulations! Seller Application Approved";
  }

  getDescription(): string {
    return `Your seller application has been approved! You can now start listing products on the store.`;
  }

  getCategory(): NotificationCategory {
    return NotificationCategory.SUCCESS;
  }

  getActionUrl(): string {
    return "/sellerhub/products";
  }

  process(
    userId: string,
    data: any
  ): Omit<NotificationDocument, "notificationId" | "date" | "isRead"> {
    return {
      userId,
      heading: this.getHeading(),
      description: this.getDescription(),
      type: NotificationType.SELLER_APPLICATION_APPROVED,
      category: this.getCategory(),
      actionUrl: this.getActionUrl(),
      metadata: {
        approvedAt: new Date().toISOString(),
      },
    };
  }
}

export class SellerModerationActionHandler implements INotificationHandler {
  getHeading(data: { action: string }): string {
    return `Moderation Action: ${data.action}`;
  }

  getDescription(data: {
    reason: string;
    action: string;
    affectedItems?: string[];
  }): string {
    const itemsInfo =
      data.affectedItems && data.affectedItems.length > 0
        ? ` Affected products: ${data.affectedItems.length} item(s).`
        : "";
    return `Action taken: ${data.action}. Reason: ${data.reason}.${itemsInfo} Please review your product.`;
  }

  getCategory(): NotificationCategory {
    return NotificationCategory.WARNING;
  }

  getActionUrl(): string {
    return "/sellerhub/products";
  }

  process(
    userId: string,
    data: any
  ): Omit<NotificationDocument, "notificationId" | "date" | "isRead"> {
    return {
      userId,

      heading: this.getHeading(data),
      description: this.getDescription(data),
      type: NotificationType.SELLER_MODERATION_ACTION,
      category: this.getCategory(),
      actionUrl: this.getActionUrl(),
      metadata: {
        action: data.action,
        reason: data.reason,
        affectedItems: data.affectedItems,
      },
    };
  }
}

export class OrderRefundedHandler implements INotificationHandler {
  getHeading(data: { orderId: string }): string {
    return `Order refunded: ${data.orderId}`;
  }

  getDescription(data: { message: string; orderId: string }): string {
    return `Order ${data.orderId} has been refunded. ${data.message}`;
  }

  getCategory(): NotificationCategory {
    return NotificationCategory.WARNING;
  }

  getActionUrl(): string | undefined {
    return "/sellerhub/orders";
  }

  process(
    userId: string,
    data: Record<string, any>
  ): Omit<NotificationDocument, "notificationId" | "date" | "isRead"> {
    return {
      userId,
      heading: this.getHeading(data as { orderId: string }),
      description: this.getDescription(
        data as { message: string; orderId: string }
      ),
      type: NotificationType.ORDER_REFUNDED,
      category: this.getCategory(),
      actionUrl: this.getActionUrl(),
      metadata: {
        action: data.action,
        reason: data.reason,
      },
    };
  }
}

export class NewOrderHandler implements INotificationHandler {
  getHeading(data: { orderId: string }): string {
    return `New Order Received ${data.orderId}`;
  }

  getDescription(data: {
    orderId: string;
    itemCount: number;
    totalAmount: number;
    buyerName?: string;
  }): string {
    const buyer = data.buyerName ? ` from ${data.buyerName}` : "";
    return `You have a new order${buyer} for ${
      data.itemCount
    } item(s) totaling $${data.totalAmount.toFixed(
      2
    )}. Please process and ship promptly.`;
  }

  getCategory(): NotificationCategory {
    return NotificationCategory.NOTIFICATION;
  }

  getActionUrl(): string {
    return `/sellerhub/orders`;
  }

  process(
    userId: string,
    data: any
  ): Omit<NotificationDocument, "notificationId" | "date" | "isRead"> {
    return {
      userId,
      heading: this.getHeading(data),
      description: this.getDescription(data),
      type: NotificationType.NEW_ORDER,
      category: this.getCategory(),
      actionUrl: this.getActionUrl(),
      metadata: {
        orderId: data.orderId,
        totalAmount: data.totalAmount,
        itemCount: data.itemCount,
      },
    };
  }
}

export class ItemOutOfStockHandler implements INotificationHandler {
  getHeading(data: { itemName: string }): string {
    return `Out of stock: ${data.itemName}`;
  }

  getDescription(data: { itemName: string; itemId: string }): string {
    return `Your product "${data.itemName}" is out of stock. Please restock to continue selling this item.`;
  }

  getCategory(): NotificationCategory {
    return NotificationCategory.SUCCESS;
  }

  getActionUrl(): string {
    return `/seller/products`;
  }

  process(
    userId: string,
    data: any
  ): Omit<NotificationDocument, "notificationId" | "date" | "isRead"> {
    return {
      userId,
      heading: this.getHeading(data),
      description: this.getDescription(data),
      type: NotificationType.ITEM_OUT_OF_STOCK,
      category: this.getCategory(),
      actionUrl: this.getActionUrl(),
      metadata: { itemId: data.itemId, itemName: data.itemName },
    };
  }
}

// ADMIN NOTIFICATION HANDLERS

export class NewSellerApplicationHandler implements INotificationHandler {
  getHeading(data: { applicantName: string }): string {
    return `New Seller Application from ${data.applicantName}`;
  }

  getDescription(data: { applicantName: string; applicantId: string }): string {
    return `${data.applicantName} has submitted a seller application. Review and approve/reject the application.`;
  }

  getCategory(): NotificationCategory {
    return NotificationCategory.NOTIFICATION;
  }

  getActionUrl(): string {
    return `/adminpanel`;
  }

  process(
    userId: string,
    data: any
  ): Omit<NotificationDocument, "notificationId" | "date" | "isRead"> {
    return {
      userId,
      heading: this.getHeading(data),
      description: this.getDescription(data),
      type: NotificationType.NEW_SELLER_APPLICATION,
      category: this.getCategory(),
      actionUrl: this.getActionUrl(),
      metadata: {
        applicantId: data.applicantId,
        applicantName: data.applicantName,
        submittedAt: new Date().toISOString(),
      },
    };
  }
}

export class NewSellerProductHandler implements INotificationHandler {
  getHeading(data: { sellerName: string }): string {
    return `New Seller Product from ${data.sellerName}`;
  }

  getDescription(data: { sellerName: string; productId: string }): string {
    return `${data.sellerName} has submitted a seller product. Review and approve/reject the application.`;
  }

  getCategory(): NotificationCategory {
    return NotificationCategory.NOTIFICATION;
  }

  getActionUrl(): string {
    return `/adminpanel`;
  }

  process(
    userId: string,
    data: any
  ): Omit<NotificationDocument, "notificationId" | "date" | "isRead"> {
    return {
      userId,
      heading: this.getHeading(data),
      description: this.getDescription(data),
      type: NotificationType.NEW_SELLER_PRODUCT,
      category: this.getCategory(),
      actionUrl: this.getActionUrl(),
      metadata: {
        productId: data.productId,
        sellerId: data.sellerId,
        sellerName: data.sellerName,
        submittedAt: new Date().toISOString(),
      },
    };
  }
}
