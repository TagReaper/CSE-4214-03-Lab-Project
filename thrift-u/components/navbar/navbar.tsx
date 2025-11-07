'use client';

import * as React from 'react';
import { useEffect, useState, useRef, useId } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, onAuthStateChanged } from 'firebase/auth';
import FireData from '@/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

import { cn } from '@/lib/utils';
import { NotificationMenu } from './notifmenu';
import { UserMenu } from './usermenu';
import { CartMenu } from './cartmenu';

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
  const [userRole, setUserRole] = useState<string>('buyer');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FireData.auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(FireData.db, 'User', user.uid));
          if (userDoc.exists()) {
            const role = userDoc.data().accessLevel || 'Buyer';
            setUserRole(role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setUserRole('buyer');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, userRole };
}

export interface NavItem {
  href: string;
  label: string;
  active?: boolean;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  searchPlaceholder?: string;
}

const sellerNavLinks: NavItem[] = [
  { href: '/sellerhub', label: 'Seller Hub' },
  { href: '/sellerhub/products', label: 'My Products' },
  { href: '/sellerhub/orders', label: 'Orders' },
];

const adminNavLinks: NavItem[] = [
  { href: '/adminpanel', label: 'Dashboard', active: true },
  { href: '/adminpanel', label: 'ABC' },
  { href: '/adminpanel', label: 'DEF' },
  { href: '/adminpanel', label: 'GHI' },
];

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
    const pathname = usePathname();
    const { user, loading: authLoading, userRole } = useAuth();

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

    const isActive = (href: string) => {
      if (href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(href);
    };

    const showNavLinks = user && (userRole === 'Seller' || userRole === 'Admin');
    const navigationLinks = userRole === 'Admin' ? adminNavLinks : sellerNavLinks;

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
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
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

              {showNavLinks && (
                <NavigationMenu className="flex ml-6">
                  <NavigationMenuList className="gap-1">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        <Link href={link.href} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={cn(
                              'group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors text-white/90 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer relative',
                              'before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-white before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100',
                              isActive(link.href) && 'before:scale-x-100 text-white'
                            )}
                          >
                            {link.label}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
            {!showNavLinks && (
              <div className="grow max-w-md">
                <form onSubmit={handleSearchSubmit} className="relative mx-auto w-full">
                  <Input
                    id={searchId}
                    name="search"
                    className="peer h-9 ps-9 pe-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 focus:border-white/40 transition-all"
                    placeholder={searchPlaceholder}
                    type="search"
                  />
                  <div className="text-white/70 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <SearchIcon size={16} />
                  </div>
                  <div className="text-white/60 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3">
                    <kbd className="text-white/50 inline-flex h-5 max-h-full items-center rounded border border-white/30 px-1.5 font-[inherit] text-[0.625rem] font-medium bg-white/5">
                      ⌘K
                    </kbd>
                  </div>
                </form>
              </div>
            )}
            <div className="flex flex-1 items-center justify-end gap-2">
              {!authLoading && (
                <>
                  {user ? (
                    <>
                      {userRole === 'Buyer' && <CartMenu />}
                      <NotificationMenu userId={user.uid} />
                      <UserMenu
                        userName={user.displayName || 'User'}
                        userEmail={user.email || ''}
                        userAvatar={user.photoURL || undefined}
                      />
                    </>
                  ) : (
                    <>
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