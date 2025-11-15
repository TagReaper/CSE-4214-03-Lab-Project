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
            const InventoryRef = await getDocs(collection(FireData.db, "Inventory"))
            const Inventory = InventoryRef.docs.map((doc) => ({...doc.data(), id: doc.id}))
            const Cart = Buyer.data().cart
            if(!Payment) {throw Error("Payment Declined")}
            if (Payment.default){
                await setDoc(doc(FireData.db, "Payment", token.user_id), {
                    cardNumber: Payment.cardNumber,
                    exp: Payment.exp,
                    cvc: Payment.cvc,
                    name: Payment.name,
                })
            }

            for (let index = 0; index < Cart.length; index++) {
                const itemRef = Inventory.find(obj => obj.id == Cart[index].itemId)
                const item = itemRef
                if (!item) {throw Error("ItemId not found")}
                item.id = Cart[index].itemId
                item.orderqty = Cart[index].qty
                quant += item.orderqty
                if (item.orderqty > item.qty){throw Error("Item is out of stock")}
                item.sum = item.price * item.orderqty
                orderSum += item.sum
                Items.push(item)
            }

            const orderRef = await addDoc(collection(FireData.db, "Orders"), {
                buyerId: token.user_id,
                quantity: Number(quant),
                cardUsed: Number(Payment.cardNumber % 10000),
                price: Number(orderSum),
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
                const OrderItemRef = await addDoc(collection(FireData.db, "OrderItems"), {
                    orderId: orderRef.id,
                    itemId: Items[index].id,
                    buyerId: token.user_id,
                    sellerId: Items[index].sellerId,
                    quantity: Number(Items[index].orderqty),
                    status:"pending",
                    price: Number(Items[index].sum),
                    trackingNumber: "",
                    dateAccepted: "",
                    reviewed: false
                })
                pendingOrders.push(OrderItemRef.id)
                await updateDoc(doc(FireData.db, "Seller", Items[index].sellerId), {
                    pendingOrders: pendingOrders
                })
                await updateDoc(doc(FireData.db, "Inventory", Items[index].id), {
                    quantity: Number(Items[index].quantity - Items[index].orderqty),
                })
            }

            await updateDoc(doc(FireData.db, "Buyer", token.user_id), {
                    numOrders: Number(Buyer.data().numOrders + 1),
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

export async function acceptOrder(orderItemId, trackingNumber, unclaimedIncome, pendingOrders) {
    if(verifyRole("Seller")){
        try{
            const token = await getAuthUser()
            const date = new Date()
            pendingOrders.splice(pendingOrders.indexOf(orderItemId), 1)
            const orderItemRef = await getDoc(doc(FireData.db, "OrderItems", orderItemId))
            if(orderItemRef.data().status != "pending"){return("Accept order failed: Something went wrong.")}
            await updateDoc(doc(FireData.db, "Seller", token.user_id), {
                pendingOrders: pendingOrders,
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
            const orderItemRef = await getDoc(doc(FireData.db, "OrderItems", orderItemId))
            const itemRef = await getDoc(doc(FireData.db, "Inventory", orderItemRef.data().itemId))
            if(orderItemRef.data().status != "pending"){return("Accept refuse failed: Something went wrong.")}
            await updateDoc(doc(FireData.db, "OrderItems", orderItemId), {
                status: "canceled",
                trackingNumber: "Order Canceled"
            })
            await updateDoc(doc(FireData.db, "Inventory", orderItemRef.data().itemId), {
                quantity: itemRef.data().quantity + orderItemRef.data().quantity
            })
            //Refund cost of order to buyer
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

export async function refund(orderItemId, sellerId){
    if(verifyRole("Buyer")){
        try {
            const sellerRef = await getDoc(doc(FireData.db, "Seller", sellerId))
            let pendingOrders = sellerRef.data().pendingOrders
            pendingOrders.splice(pendingOrders.indexOf(orderItemId), 1)
            const orderItemRef = await getDoc(doc(FireData.db, "OrderItems", orderItemId))
            const itemRef = await getDoc(doc(FireData.db, "Inventory", orderItemRef.data().itemId))
            if(orderItemRef.data().status != "pending"){return("Order Cancelation failed: Something went wrong.")}
            await updateDoc(doc(FireData.db, "Seller", sellerId), {
                pendingOrders: pendingOrders,
            })
            await updateDoc(doc(FireData.db, "OrderItems", orderItemId), {
                status: "refunded",
                trackingNumber: "Order Refunded"
            })
            await updateDoc(doc(FireData.db, "Inventory", orderItemRef.data().itemId), {
                quantity: itemRef.data().quantity + orderItemRef.data().quantity
            })
            //Refund cost of order to buyer
            return true
        } catch (error) {
            console.error("Failed to refuse Order:", error);
            return("Refund order failed: Something went wrong.")
        }
    } else {
        return("Refund order failed: Invalid Access.")
    }
}

export async function review(orderItemId, sellerId, rating){
    if(verifyRole("Buyer")){
        try {
            const sellerRef = await getDoc(doc(FireData.db, "Seller", sellerId))
            let reviews = sellerRef.data().reviews
            reviews.push(rating)
            const orderItemRef = await getDoc(doc(FireData.db, "OrderItems", orderItemId))
            if(orderItemRef.data().status == "pending"){return("Rate Seller failed: Item is still pending, cancel order or wait until it is shipped to rate this seller.")}
            await updateDoc(doc(FireData.db, "Seller", sellerId), {
                reviews: reviews,
            })
            await updateDoc(doc(FireData.db, "OrderItems", orderItemId), {
                reviewed: true
            })
            return true
        } catch (error) {
            console.error("Failed to review seller:", error);
            return("Rate Seller failed: Something went wrong.")
        }
    } else {
        return("Rate Seller failed: Invalid Access.")
    }
}