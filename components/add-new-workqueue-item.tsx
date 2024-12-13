import React, { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { WorkqueueItem } from "@/types/supabase";
import { InputNumber } from "primereact/inputnumber";
import { FloatLabel } from "primereact/floatlabel";
import { Calendar } from "primereact/calendar";
import { getMaxItemPosition } from "@/utils/supabase/fetch-data";


interface AddNewItemSidebarProps {
  visible: boolean;
  onHide: () => void;
  onAddItem: (newItem: WorkqueueItem) => void;
}

const AddNewItemSidebar: React.FC<AddNewItemSidebarProps> = ({
  visible,
  onHide,
  onAddItem,
}) => {
  const [newItem, setNewItem] = useState<WorkqueueItem>({
    identifier: null,
    received_at: new Date(),
    last_updated_at: new Date(),
    status_id: 1, // Default to "Received" status
    extension_date_id: null,
    position: null,
  });

  const handleAddNewItem = async () => {
    const newPosition = await getNewItemPosition()
    // Call the callback function passed from parent to add the item
    onAddItem({
      ...newItem,
      identifier: newItem.identifier,
      received_at: newItem.received_at || new Date(),
      position: newPosition
    });
    // TODO add loading to ensure that we can save the new value 
    setNewItem({ ...newItem, identifier: null, received_at: new Date(), position: null}); // Reset form
    
  };

  const getNewItemPosition = async () => {
    const data = await getMaxItemPosition()
    return data ? data + 1 : null // increment by 1, or set default
  };

  return (
    <Sidebar visible={visible} onHide={onHide} position="left">
      <div className="card flex flex-col justify-content-center">
        <h3>Add new item</h3>

        <div className="mb-4">
          <label htmlFor="identifier" className="block mb-2">
            Identifier
          </label>
          <InputText
            id="identifier"
            aria-describedby="identifier-help"
            value={newItem.identifier}
            onChange={(e) =>
              setNewItem({ ...newItem, identifier: e.target.value })
            }
            keyfilter="int"
            maxLength={4}
            autoFocus
            className="block w-full"
          />
          <small id="identifier-help" className="text-gray-500">
            Enter the four digit unique identifier for the tax filing
          </small>
        </div>

        <div className="mb-4">
          <label htmlFor="received_at">Received on</label>
          <Calendar
            id="received_at"
            value={newItem.received_at}
            onChange={(e) => {
              const value =
                e.target.value instanceof Date ? e.target.value : new Date();
              setNewItem({ ...newItem, received_at: value });
            }}
          />
        </div>

        <div className="flex justify-between mt-6">
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={onHide}
            className="p-button-secondary"
          />
          <Button
            label="Save"
            icon="pi pi-plus"
            onClick={handleAddNewItem}
            onMouseDown={getNewItemPosition}
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default AddNewItemSidebar;
