"use server";
import { getDoc, getDocs, doc, updateDoc, addDoc, setDoc} from "@firebase/firestore";
import FireData from "@/firebase/clientApp";
import { verifyRole } from "@/lib/auth";

export async function checkout(cartItems, cartQTY, Address, Payment) {
    /*
    get Inventory
    Items = []
    orderSum = 0
    try{
        if(!Payment) -> throw Error(Payment Declined)
        if Payment.default -> setDoc to Payment as userId: Payment, deletedAt: ""

        for each cartItems
            item = Inventory.find(obj => obj.id == cartItems[index].itemId)
            if !item -> throw Error(ItemId not found)
            item.orderqty = CartItems[index].qty
            item.sum = item.price * item.orderqty
            orderSum += item.sum
            Items.push(item)

        orderRef=addDoc to Orders : cartQTY, orderSum, date, Address, deletedAt: ""

        for each item in Items
            get Seller from item.sellerId
            income = item.sum + Seller.income
            unclaimedIncome = item.sum + Seller.unclaimedIncome
            update Seller at item.sellerId: seller.income & seller.unclaimedIncome
            addDoc to OrderItems : OrderRef.id, item.orderqty, status:"pending", TrackingNumber: "", date, deletedAt: ""

        BuyerRef = get buyer from user.id
        update Buyer at user.id: numOrders: BuyerRef.numOrders+1, cartQTY: 0

        for each cartItems
            delete cartItems[index]

        return true


    } catch(error) {
        console.error("Checkout failed:", error);
        throw error
    }

    */
    if (verifyRole("Buyer")){
        return true
    } else {
        return false
    }
}

export async function addToCart(ItemId, qty) {
    /*
    */
    if (verifyRole("Buyer")){
        return true
    } else {
        return false
    }
}

export async function removeFromCart(cartItemId, qty) {
    /*
    */
    if (verifyRole("Buyer")){
        return true
    } else {
        return false
    }
}

export async function clearCart() {
    /*
    */
    if (verifyRole("Buyer")){
        return true
    } else {
        return false
    }
}