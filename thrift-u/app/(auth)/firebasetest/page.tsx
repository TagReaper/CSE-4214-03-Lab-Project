import AddItem from '../../../components/addItem'
import ListItems from '../../../components/listItems'

export default function FirebaseTest() {
    return (
        <div className="bg-white h-screen v-screen text-black flex flex-col justify-center items-center">
            <h1>
                NextJS Firebase Firestore
            </h1>
            <AddItem />
            <ListItems />
        </div>
    );
}