'use client';

import { useRouter } from 'next/navigation';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FireData from '@/firebase/clientApp';

interface UserMenuProps {
  userName: string;
  userEmail: string;
  userAvatar?: string;
}

export const UserMenu = ({
  userName,
  userEmail,
  userAvatar,
}: UserMenuProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
        await FireData.auth.signOut();
        await fetch("/api/auth", { //send token to api route to set cookie
          method: "POST",
        });
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMenuItemClick = (action: string) => {
    switch (action) {
      case 'account':
        router.push('/account');
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 px-2 py-0 hover:bg-white/10 text-white"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="text-xs bg-[#8B1538] text-white border border-white/20">
              {userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon className="h-3 w-3 ml-1" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleMenuItemClick('account')}
          className="cursor-pointer"
        >
          Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleMenuItemClick('logout')}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};