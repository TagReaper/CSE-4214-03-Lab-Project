'use client';

import * as React from 'react';
import { useEffect, useState, useRef, useId } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, onAuthStateChanged } from 'firebase/auth';
import FireData from '@/firebase/clientApp';
import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';
import { NotificationMenu } from './notifmenu';
import { UserMenu } from './usermenu';
import { CartMenu } from './cartmenu';

// Logo component
const Logo = () => {
  return (
    <Image
      src="/Graphics/ThriftULogoModern.png"
      alt="Thrift-U logo"
      width={30}
      height={30}
    />
  );
};

function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FireData.auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

// Navigation item type
export interface NavItem {
  href: string;
  label: string;
}

// Navbar props
export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  navigationLinks?: NavItem[];
  searchPlaceholder?: string;
}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      searchPlaceholder = 'Search products...',
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLElement>(null);
    const searchId = useId();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    // Combine refs
    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const query = formData.get('search') as string;
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    };

    return (
      <header
        ref={combinedRef}
        className={cn(
          'sticky top-0 z-50 w-full border-b border-[#a8a8a8] bg-[#6a0a0a] px-4 md:px-6',
          className
        )}
        {...props}
      >
        <div className="container mx-auto max-w-screen-2xl">
          {/* Main navbar section */}
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left side */}
            <div className="flex flex-1 items-center gap-2">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center space-x-2 text-white hover:text-[#a8a8a8] transition-colors no-underline"
              >
                <div className="text-2xl">
                  <Logo />
                </div>
                <span className="hidden font-bold text-xl sm:inline-block">
                  Thrift-U
                </span>
              </Link>
            </div>
            
            {/* Search */}
            <div className="grow max-w-md">
              <form onSubmit={handleSearchSubmit} className="relative mx-auto w-full">
                <Input
                  id={searchId}
                  name="search"
                  className="peer h-8 ps-8 pe-10 bg-[#4f1515] border-[#7e7c7c] text-white placeholder:text-white/60 focus:border-[#a8a8a8]"
                  placeholder={searchPlaceholder}
                  type="search"
                />
                <div className="text-white/60 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                  <SearchIcon size={16} />
                </div>
                <div className="text-white/60 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
                  <kbd className="text-white/50 inline-flex h-5 max-h-full items-center rounded border border-[#7e7c7c] px-1 font-[inherit] text-[0.625rem] font-medium">
                    ⌘K
                  </kbd>
                </div>
              </form>
            </div>
            {/* Right side */}
            <div className="flex flex-1 items-center justify-end gap-2">
              {!authLoading && (
                <>
                  {user ? (
                    <>
                      {/* Cart Menu */}
                      <CartMenu />
                      {/* Notifications */}
                      <NotificationMenu
                        notificationCount={0}
                      />
                      {/* User menu */}
                      <UserMenu
                        userName={user.displayName || 'User'}
                        userEmail={user.email || ''}
                        userAvatar={user.photoURL || undefined}
                      />
                    </>
                  ) : (
                    <>
                      {/* Login/Signup buttons */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-[#4f1515] hover:text-white"
                        onClick={() => router.push('/login')}
                      >
                        Log In
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#4f1515] text-white hover:bg-[#7e0a0a] border border-[#a8a8a8]"
                        onClick={() => router.push('/signup')}
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Navbar.displayName = 'Navbar';