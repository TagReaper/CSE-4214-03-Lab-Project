'use client'
import ListUsers from '../../../components/adminpanel/admin_UserList'
import PendingProductList from '../../../components/adminpanel/adminProductList'

export default function AdminPage() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-center mb-4">
                Admin Control Page
            </h1>
            <div className="flex flex-row gap-4">
                <div className="flex-1">
                    <ListUsers />
                </div>
                <div className="flex-1">
                    <PendingProductList />
                </div>
            </div>
        </div>
    );
}