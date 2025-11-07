"use server";
import { getDoc, getDocs, collection, doc, updateDoc, addDoc, setDoc} from "@firebase/firestore";
import FireData from "@/firebase/clientApp";
import { getAuthUser, verifyRole } from "@/lib/auth";

export async function checkout(Address, Payment) {
    if (verifyRole("Buyer")){
        const token = await getAuthUser()
        var Items = []
        var orderSum = 0
        var pendingOrders = []
        const serverTime = new Date();
        var quant = 0
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
                quant += item.orderqty
                if (item.orderqty > item.qty){throw Error("Item is out of stock")}
                item.sum = item.price * item.orderqty
                orderSum += item.sum
                Items.push(item)
            }

            orderRef = await addDoc(collection(FireData.db, "Orders"), {
                quantity: quant,
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
                pendingOrders = seller.pendingOrders
                pendingOrders.push(OrderItemRef.id)
                const OrderItemRef = await addDoc(collection(FireData.db, "OrderItems"), {
                    orderId: orderRef.id,
                    itemId: Items[index].id,
                    sellerId: Items[index].sellerId,
                    quantity: Items[index].orderqty,
                    status:"pending",
                    price: Items[index].sum,
                    trackingNumber: "",
                    dateAccepted: ""
                })
                await updateDoc(doc(FireData.db, "Seller", Items[index].sellerId), {
                    pendingOrders: pendingOrders
                })
                await updateDoc(doc(FireData.db, "Inventory", Items[index].id), {
                    qty: Items[index].qty - Items[index].orderqty,
                })
            }

            await updateDoc(doc(FireData.db, "Buyer", token.user_id), {
                    numOrders: Buyer.numOrders + 1,
                    cart: [],
                })

            return true
        } catch(error) {
            console.error("Checkout failed:", error);
            return("Checkout failed: Something went wrong.")
        }
    } else {
        return("Checkout failed: Invalid Access.")
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
            return("Cart modification failed: Something went wrong.")
        }
    } else {
        return("Cart modification failed: Invalid Access.")
    }
}

export async function clearCart() {
    if (verifyRole("Buyer")){
        try {
            const token = await getAuthUser()
            await updateDoc(doc(FireData.db, "Buyer", token.user_id), {
                cart: [],
            })
            return true
        } catch (error) {
            console.error("Failed to clear cart:", error);
            return("Clear cart failed: Something went wrong.")
        }
    } else {
        return("Clear cart failed: Invalid Access.")

    }
}

export async function acceptOrder(orderItemId, trackingNumber, income, unclaimedIncome, pendingOrders) {
    if(verifyRole("Seller")){
        try{
            const token = await getAuthUser()
            const date = new Date()
            pendingOrders.splice(pendingOrders.indexOf(orderItemId), 1)
            const orderItemRef = await getDoc(doc(FireData.db, ))
            await updateDoc(doc(FireData.db, "Seller", token.user_id), {
                pendingOrders: pendingOrders,
                income: income + orderItemRef.data().price,
                unclaimedIncome: unclaimedIncome + orderItemRef.data().price,
            })
            await updateDoc(doc(FireData.db, "OrderItems", orderItemId), {
                trackingNumber: trackingNumber,
                dateAccepted: date.toLocaleString(),
                status: "shipped",
            })
            return true
        }catch(error){
            console.error("Failed to accept Order:", error);
            return("Accept order failed: Something went wrong.")
        }
    } else {
        return("Accept order failed: Invalid Access.")
    }
}

export async function denyOrder(orderItemId, pendingOrders) {
    if(verifyRole("Seller")){
        try {
            const token = await getAuthUser()
            pendingOrders.splice(pendingOrders.indexOf(orderItemId), 1)
            await updateDoc(doc(FireData.db, "Seller", token.user_id), {
                pendingOrders: pendingOrders,
            })
            await updateDoc(doc(FireData.db, "OrderItems", orderItemId), {
                status: "refused",
            })
            return true
        } catch (error) {
            console.error("Failed to refuse Order:", error);
            return("Refuse order failed: Something went wrong.")
        }
    } else {
        return("Refuse order failed: Invalid Access.")
    }
}

export async function cashOut(income, unclaimedIncome) {
    if(unclaimedIncome > 0){
        if(verifyRole("Seller")){
            try {
                const token = await getAuthUser()
                await updateDoc(doc(FireData.db, "Seller", token.user_id), {
                    income: income + unclaimedIncome,
                    unclaimedIncome: 0
                })
                return("Cashout Successful: $" + unclaimedIncome + " transfered")
            } catch (error) {
                console.error("Failed to cashout:", error);
                return("Cashout failed: Something went wrong.")
            }
        } else {
            return("Invalid Access: Something went wrong.")
        }
    } else {
        return("You have nothing to cashout.")
    }
}