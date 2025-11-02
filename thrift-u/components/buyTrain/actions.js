"use server";
import { getDoc, getDocs, collection, doc, updateDoc, addDoc, setDoc} from "@firebase/firestore";
import FireData from "@/firebase/clientApp";
import { getAuthUser, verifyRole } from "@/lib/auth";

export async function checkout(Cart, Address, Payment) {
    const token = await getAuthUser()

    if (verifyRole("Buyer")){
        const Inventory = await getDocs(collection(FireData.db, "Inventory"))
        const serverTime = new Date();
        var Items = []
        var orderSum = 0
        try{
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
                const item = Inventory.find(obj => obj.id == Cart[index].itemId)
                if (!item) {throw Error("ItemId not found")}
                item.id = Cart[index].itemId
                item.orderqty = Cart[index].qty
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
                const seller = await getDoc(doc(FireData.db, "Seller", Items[index].sellerId))
                let income = Items[index] + seller.income
                let unclaimedIncome = Items[index].sum + seller.unclaimedIncome
                await updateDoc(doc(FireData.db, "Seller", Items[index].sellerId), {
                    income: income,
                    unclaimedIncome: unclaimedIncome,
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

            const Buyer = await getDoc(doc(FireData.db, "Buyer", token.user_id))

            await await updateDoc(doc(FireData.db, "Buyer", token.user_id), {
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