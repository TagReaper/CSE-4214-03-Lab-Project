'use client';

import { BellIcon } from 'lucide-react';
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

interface NotificationMenuProps {
  notificationCount: number;
}

export const NotificationMenu = ({ notificationCount }: NotificationMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative hover:bg-white/10 text-white">
          <BellIcon className="h-4 w-4" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-white text-[#8B1538] hover:bg-white">
              {notificationCount > 9 ? '9+' : notificationCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="py-6 text-center text-sm text-muted-foreground">
          No new notifications
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};