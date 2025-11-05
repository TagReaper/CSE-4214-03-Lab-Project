'use client';

import {
  BellIcon,
  ExternalLink,
  Trash2,
  Check,
  AlertTriangle,
  Zap,
  CheckCircle,
  Info,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/lib/notifications/hooks';
import { NotificationCategory } from '@/lib/notifications/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface NotificationMenuProps {
  userId: string;
}

export const NotificationMenu = ({ userId }: NotificationMenuProps) => {
  const router = useRouter();
  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    deleteNotification,
  } = useNotifications(userId);

  const getCategoryColor = (category: NotificationCategory): string => {
    switch (category) {
      case NotificationCategory.ALERT:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case NotificationCategory.WARNING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case NotificationCategory.SUCCESS:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case NotificationCategory.INFO:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    const iconClass = "h-5 w-5";
    switch (category) {
      case NotificationCategory.ALERT:
        return <AlertTriangle className={cn(iconClass, "text-red-600")} />;
      case NotificationCategory.WARNING:
        return <Zap className={cn(iconClass, "text-yellow-600")} />;
      case NotificationCategory.SUCCESS:
        return <CheckCircle className={cn(iconClass, "text-green-600")} />;
      case NotificationCategory.INFO:
        return <Info className={cn(iconClass, "text-blue-600")} />;
      default:
        return <Bell className={cn(iconClass, "text-gray-600")} />;
    }
  };

  const handleNotificationClick = async (notificationId: string, actionUrl?: string) => {
    await markAsRead(notificationId);
    if (actionUrl) {
      router.push(actionUrl);
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const handleMarkAsRead = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await markAsRead(notificationId);
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(date).toLocaleDateString();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative hover:bg-white/10 text-white">
          <BellIcon className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-white text-[#8B1538] hover:bg-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <DropdownMenuLabel className="p-0 text-base font-semibold">
            Notifications
          </DropdownMenuLabel>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={cn(
                    'group relative p-4 hover:bg-accent cursor-pointer transition-colors',
                    !notification.isRead && 'bg-blue-50/50 dark:bg-blue-950/20'
                  )}
                  onClick={() => handleNotificationClick(notification.notificationId, notification.actionUrl)}
                >
                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full" />
                  )}

                  <div className={cn('flex gap-3', !notification.isRead && 'pl-3')}>
                    {/* Icon */}
                    <div className="text-2xl flex-shrink-0">
                      {getCategoryIcon(notification.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm leading-tight">
                          {notification.heading}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-xs px-1.5 py-0.5 flex-shrink-0',
                            getCategoryColor(notification.category)
                          )}
                        >
                          {notification.category}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(notification.date)}
                        </span>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => handleMarkAsRead(e, notification.notificationId)}
                              title="Mark as read"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {notification.actionUrl && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="View details"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={(e) => handleDelete(e, notification.notificationId)}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm"
                onClick={() => router.push('/notifications')}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};