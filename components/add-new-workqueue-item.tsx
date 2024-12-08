import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { WorkqueueItem } from '@/types/supabase';
import { InputNumber } from 'primereact/inputnumber';

interface AddNewItemSidebarProps {
    visible: boolean;
    onHide: () => void;
    onAddItem: (newItem: WorkqueueItem) => void;
}

const AddNewItemSidebar: React.FC<AddNewItemSidebarProps> = ({ visible, onHide, onAddItem }) => {
    const [newItem, setNewItem] = useState<WorkqueueItem>({
        identifier: null,
        received_at: new Date().toISOString(),
        status_id: 1, // Default to "Received" status
        extension_date_id: null,
        position: null,
    });

    const handleAddNewItem = () => {
        // Call the callback function passed from parent to add the item
        onAddItem({
            ...newItem,
            received_at: newItem.received_at || new Date().toISOString(),
        });
        setNewItem({ ...newItem, identifier: null, received_at: new Date().toISOString() }); // Reset form
    };

    return (
        <Sidebar visible={visible} onHide={onHide} position="right" className="p-4">
            <div className="p-3">
                <h3 className="text-xl font-bold text-pink-500 mb-4">Add New Item</h3>

                <div className="mb-4">
                    <label htmlFor="identifier" className="block text-gray-700">Identifier</label>
                    <InputNumber
                        id="identifier"
                        value={newItem.identifier}
                        onChange={(e) => setNewItem({ ...newItem, identifier: e.value })}
                        useGrouping={false}
                        maxLength={4}
                        autoFocus
                        className="w-full border-primary"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="received_at" className="block text-gray-700">Received At</label>
                    <InputText
                        id="received_at"
                        value={newItem.received_at}
                        onChange={(e) => setNewItem({ ...newItem, received_at: e.target.value })}
                        disabled
                        className="w-full border-primary"
                    />
                </div>

                <div className="flex justify-between mt-6">
                    <Button
                        label="Add Item"
                        icon="pi pi-plus"
                        onClick={handleAddNewItem}
                        className="p-button-secondary"
                    />
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={onHide}
                        className="p-button-text text-gray-500"
                    />
                </div>
            </div>
        </Sidebar>
    );
};

export default AddNewItemSidebar;
