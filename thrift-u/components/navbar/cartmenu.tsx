'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCartIcon, Trash2Icon } from 'lucide-react';
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
import Image from 'next/image';
import FireData from '@/firebase/clientApp';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from 'firebase/firestore';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  productId: string;
}

export interface CartMenuProps {
  userId: string;
}

export const CartMenu = ({ userId }: CartMenuProps) => {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }

    const cartRef = collection(FireData.db, 'carts');
    const q = query(cartRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cartItems: CartItem[] = [];
      snapshot.forEach((doc) => {
        cartItems.push({ id: doc.id, ...doc.data() } as CartItem);
      });
      setItems(cartItems);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching cart:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const removeFromCart = async (itemId: string) => {
    try {
      await deleteDoc(doc(FireData.db, 'carts', itemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleViewCart = () => {
    router.push('/cart');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative hover:bg-white/10 text-white">
          <ShoppingCartIcon className="h-4 w-4" />
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-white text-[#8B1538] hover:bg-white">
              {cartCount > 9 ? '9+' : cartCount}
            </Badge>
          )}
          <span className="sr-only">Shopping cart</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Shopping Cart</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="max-h-[300px] overflow-y-auto">
              {items.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  {item.imageUrl && (
                    <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 hover:bg-red-50 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className="p-3">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
              </div>
              <Button
                className="w-full bg-[#8B1538] hover:bg-[#6B0F2A]" 
                onClick={handleViewCart}
              >
                View Cart & Checkout
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};