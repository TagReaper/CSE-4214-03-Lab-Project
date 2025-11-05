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

// Item structure from store
interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

// Cart item with quantity
interface CartItem {
  item: Item;
  quantity: number;
}

export const CartMenu = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem("cart");
        const storedItems = localStorage.getItem("items");

        if (storedCart && storedItems) {
          const cart = JSON.parse(storedCart) as { [key: number]: number };
          const items = JSON.parse(storedItems) as Item[];

          // Combine quantities and item details
          const cartArray: CartItem[] = Object.entries(cart)
            .map(([itemId, quantity]) => {
              const item = items.find(i => i.id === parseInt(itemId));
              if (!item) return null;
              return { item, quantity };
            })
            .filter((ci): ci is CartItem => ci !== null);

          console.log('Final cartArray:', cartArray);
          setCartItems(cartArray);
        } else {
          console.log('Cart or items not found in localStorage');
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();

    // Listener for Localstorage changes when cart is updated from other places
    const handleStorageChange = () => {
      loadCart();
    };

    window.addEventListener('storage', handleStorageChange);

    // Listener for same-tab cart updates
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  // Remove item from cart
  const removeFromCart = (itemId: number) => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "{}");
      delete storedCart[itemId];
      localStorage.setItem("cart", JSON.stringify(storedCart));

      // Update local state
      setCartItems(prev => prev.filter(ci => ci.item.id !== itemId));

      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const cartCount = cartItems.reduce((total, ci) => total + ci.quantity, 0);
  const cartTotal = cartItems.reduce((total, ci) => total + (ci.item.price * ci.quantity), 0);

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

        {cartItems.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="max-h-[300px] overflow-y-auto">
              {cartItems.map(({ item, quantity }) => (
                <DropdownMenuItem
                  key={item.id}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${item.price.toFixed(2)} × {quantity}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      ${(item.price * quantity).toFixed(2)}
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