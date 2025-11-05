"use server";
import { getDoc, getDocs, collection, doc, updateDoc, addDoc, setDoc} from "@firebase/firestore";
import FireData from "@/firebase/clientApp";
import { getAuthUser, verifyRole } from "@/lib/auth";

export async function checkout(Address, Payment) {
    if (verifyRole("Buyer")){
        const token = await getAuthUser()
        var Items = []
        var orderSum = 0
        const serverTime = new Date();
        try{
            const Buyer = await getDoc(doc(FireData.db, "Buyer", token.user_id))
            const Inventory = await getDocs(collection(FireData.db, "Inventory"))
            const Cart = Buyer.data().cart
            if(!Payment) {throw Error("Payment Declined")}
            if (Payment.default){
                await setDoc(doc(FireData.db, "Payment", token.user_id), {
                    cardNumber: Payment.cardNumber,
                    exp: Payment.exp,
                    cvc: Payment.cvc,
                    firstName: Payment.firstName,
                    lastName: Payment.lastName
                })
            }

            for (let index = 0; index < Cart.length; index++) {
                const itemRef = Inventory.find(obj => obj.id == Cart[index].itemId)
                const item = itemRef.data()
                if (!item) {throw Error("ItemId not found")}
                item.id = Cart[index].itemId
                item.orderqty = Cart[index].qty
                if (item.orderqty > item.qty){throw Error("Item is out of stock")}
                item.sum = item.price * item.orderqty
                orderSum += item.sum
                Items.push(item)
            }

            orderRef = await addDoc(collection(FireData.db, "Orders"), {
                quantity : Cart.length,
                cardUsed: Payment.cardNumber % 10000,
                price: orderSum,
                date: serverTime.toLocaleString(),
                address: Address.address,
                city: Address.city,
                state: Address.state,
                zip: Address.zip,
                fulfilledAt: "",
            })

            for (let index = 0; index < Items.length; index++) {
                const sellerRef = await getDoc(doc(FireData.db, "Seller", Items[index].sellerId))
                const seller = sellerRef.data()
                let income = Items[index] + seller.income
                let unclaimedIncome = Items[index].sum + seller.unclaimedIncome
                await updateDoc(doc(FireData.db, "Seller", Items[index].sellerId), {
                    income: income,
                    unclaimedIncome: unclaimedIncome,
                })
                await updateDoc(doc(FireData.db, "Inventory", Items[index].id), {
                    qty: Items[index].qty - Items[index].orderqty,
                })
                await addDoc(collection(FireData.db, "Orders"), {
                    orderId: orderRef.id,
                    itemId: Items[index].id,
                    quantity: Items[index].orderqty,
                    status:"pending",
                    trackingNumber: "",
                    dateAccepted: ""
                })
            }

            await updateDoc(doc(FireData.db, "Buyer", token.user_id), {
                    numOrders: Buyer.numOrders + 1,
                    cart: [],
                })

            return true
        } catch(error) {
            console.error("Checkout failed:", error);
            throw error
        }
    } else {
        return false
    }
}

export async function editCart(ItemId, qty) {
    if (verifyRole("Buyer")){
        try {
            const token = await getAuthUser()
            console.log(token)
            const Buyer = await getDoc(doc(FireData.db, "Buyer", token.user_id))
            const Cart = Buyer.data().cart
            for (let index = 0; index < Cart.length; index++) {
                if (Cart[index].itemId == ItemId){
                    Cart[index].qty += qty
                    if (Cart[index].qty <= 0){
                        Cart.splice(index, 1)
                    }
                    await updateDoc(doc(FireData.db, "Buyer", token.user_id), {
                        cart: Cart,
                    })
                    return true
                }
            }

            if (qty > 0){
                Cart.push({
                    itemId: ItemId,
                    qty: qty
                })
                await updateDoc(doc(FireData.db, "Buyer", token.user_id), {
                    cart: Cart,
                })
            }

            return true
        } catch(error) {
            console.error("Failed to edit cart:", error);
            throw error
        }
    } else {
        return false
    }
}

export async function clearCart() {
    if (verifyRole("Buyer")){
        try {
            const token = await getAuthUser()
            await updateDoc(doc(FireData.db, "Buyer", token.user_id), {
                cart: [],
            })
        } catch (error) {
            console.error("Failed to clear cart:", error);
            throw error
        }
    } else {
        return false
    }
}