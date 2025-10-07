"use client"
import AddItem from '../../../components/addItem';

export default function FirebaseTest() {
    return (
        <div className="bg-white h-screen v-screen text-black flex flex-col justify-center items-center">
            <h1>
                NextJS Firebase Firestore
            </h1>
            <AddItem />
        </div>
    );
}