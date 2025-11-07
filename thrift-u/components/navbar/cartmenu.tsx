'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCartIcon, Trash2Icon, PlusIcon, MinusIcon } from 'lucide-react';
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
import FireData from '@/firebase/clientApp';
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { editCart } from '@/components/buyTrain/actions';

interface Item {
  id: string;
  image: string;
  name: string;
  price: number;
  stock: number;
  condition: string;
  description: string;
  approved: boolean;
  sellerId: string;
  tags: string[];
  category: string;
}

interface FirestoreItem {
  name: string;
  price: string;
  quantity: string;
  condition: string;
  description: string;
  image: string;
  approved: boolean;
  sellerId: string;
  deletedAt: string;
  tags: string[];
}

interface CartItem {
  item: Item;
  quantity: number;
}

async function getItemInfo(itemId: string): Promise<Item | null> {
  const docRef = doc(FireData.db, "Inventory", itemId);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const firestoreData = docSnap.data() as FirestoreItem;

      const actualItem: Item = {
        id: docSnap.id,
        name: firestoreData.name,
        image: firestoreData.image,
        price: parseFloat(firestoreData.price),
        stock: parseInt(firestoreData.quantity, 10),
        condition: firestoreData.condition,
        description: firestoreData.description,
        approved: firestoreData.approved,
        sellerId: firestoreData.sellerId,
        tags: firestoreData.tags,
        category: firestoreData.tags[0] || "Uncategorized"
      };

      return actualItem;

    } else {
      console.warn(`No item found with ID: ${itemId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
}

export const CartMenu = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const authUnsubscribe = onAuthStateChanged(FireData.auth, (currentUser) => {
      if (!currentUser) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const docRef = doc(FireData.db, "Buyer", currentUser.uid);
      const cartUnsubscribe = onSnapshot(docRef, async (docSnap) => {
        if (!docSnap.exists() || !docSnap.data().cart) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        const dbCart = docSnap.data().cart as { itemId: string, qty: number }[];

        if (dbCart.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        // Create an array of fetch promises
        const fetchPromises = dbCart.map(async ({ itemId, qty }) => {
          const item = await getItemInfo(itemId);
          if (item) {
            return { item, quantity: qty };
          }
          console.warn(`Item ${itemId} not found.`);
          return null;
        });

        const results = await Promise.all(fetchPromises);
        const finalCartItems = results.filter((ci): ci is CartItem => ci !== null);

        setCartItems(finalCartItems);
        setLoading(false);

      }, (error) => {
        console.error("Error listening to cart:", error);
        setCartItems([]);
        setLoading(false);
      });
      return () => cartUnsubscribe();
    });
    return () => authUnsubscribe();
  }, []);

  const removeFromCart = async (itemId: string) => {
    try {
      const cartItem = cartItems.find(ci => ci.item.id === itemId);
      if (!cartItem) return;

      const delta = -cartItem.quantity;
      await editCart(itemId, delta);

    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartQuantity = async (itemId: string, newQuantity: number) => {
    const cartItem = cartItems.find(ci => ci.item.id === itemId);
    if (!cartItem) return;

    const finalNewQuantity = Math.min(newQuantity, cartItem.item.stock);

    if (finalNewQuantity === cartItem.quantity) {
        return;
    }

    const result = finalNewQuantity - cartItem.quantity;
    if (result === 0)
      return;
    try {
      await editCart(itemId, result);
    } catch (error) {
      console.error('Error updating cart quantity:', error);
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

        {loading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Loading cart...
          </div>
        ) : cartItems.length === 0 ? (
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
                  onSelect={() => router.push(`/listing/${item.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCartQuantity(item.id, quantity - 1);
                          }}
                        >
                          <MinusIcon className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          disabled={quantity >= item.stock}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCartQuantity(item.id, quantity + 1);
                          }}
                        >
                          <PlusIcon className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="text-sm font-medium">
                        ${(item.price * quantity).toFixed(2)}
                      </p>
                    </div>
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