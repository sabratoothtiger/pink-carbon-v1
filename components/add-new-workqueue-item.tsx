import React, { useRef, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { WorkqueueItem } from "@/types/supabase";
import { Calendar } from "primereact/calendar";
import { SupabaseClient } from "@supabase/supabase-js";
import { Toast } from "primereact/toast";
import { serverHooks } from "next/dist/server/app-render/entry-base";

interface AddNewItemSidebarProps {
  visible: boolean;
  onHide: () => void;
  onAddItem: (newItem: WorkqueueItem) => void;
  userId: string;
  supabase: SupabaseClient;
}

const AddNewItemSidebar: React.FC<AddNewItemSidebarProps> = ({
  visible,
  onHide,
  onAddItem,
  userId,
  supabase
}) => {
  const toast = useRef<Toast>(null);

const showMessage = (severity: 'success' | 'error', message: string) => {
  let summary: string;
  let detail: string;

  // Switch case to handle different severities
  switch (severity) {
    case 'success':
      summary = 'Success';
      detail = message;  // Use the provided message
      break;
    case 'error':
      summary = 'Error';
      detail = message;  // Use the provided message
      break;
    default:
      summary = 'Info';
      detail = 'Something happened'; // Default message
  }

  toast.current?.show({ severity: severity, summary: summary, detail: message, life: 3000 });
};

  const [newItem, setNewItem] = useState<WorkqueueItem>({
    id: null,
    identifier: null,
    received_at: new Date(),
    last_updated_at: new Date(),
    status_id: 1, // Default to "Received" status
    extension_date_id: null,
    position: null,
  });

  const [loading, setLoading] = useState(false); // Loading state to prevent multiple submissions

  const handleAddNewItem = async () => {
    try {
      setLoading(true); // Start loading

      // Get max position using a Supabase RPC function
      const { data: maxPosition, error: maxPositionError } = await supabase.rpc("get_max_position");

      if (maxPositionError) {
        showMessage('error', maxPositionError.message);
        return;
      }

      const newPosition = (maxPosition || 0) + 1;

      // Insert the new item
      const { data, error } = await supabase
        .from("workqueue")
        .upsert({
          return_year: "2024",
          identifier: newItem.identifier,
          status_id: 1,
          received_at: newItem.received_at || new Date(),
          position: newPosition,
          last_updated_by: userId,
          last_updated_at: new Date(),
        })
        .select();

      if (error) {
        throw new Error(error.message);
      } else {
        showMessage('success', "Item added successfully");

        // Call the callback function to update the parent component
        onAddItem({
          ...newItem,
          identifier: newItem.identifier,
          received_at: newItem.received_at || new Date(),
          position: newPosition,
        });
      }
    } catch (err) {
      showMessage('error', (err as Error).message);
    } finally {
      setLoading(false); // Reset loading state
      setNewItem({ ...newItem, identifier: null, position: null }); // Reset form state
    }
  };

  return (
    <>
    <Toast ref={toast} position="bottom-left"/>
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
            onChange={(e) => setNewItem({ ...newItem, identifier: e.target.value })}
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
              const value = e.target.value instanceof Date ? e.target.value : new Date();
              setNewItem({ ...newItem, received_at: value });
            }}
          />
        </div>

        <div className="flex justify-between mt-6">
          <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-secondary" />
          <Button
            label={loading ? "Saving..." : "Save"}
            icon="pi pi-plus"
            onClick={handleAddNewItem}
            disabled={loading} // Disable button during loading
          />
        </div>
      </div>
    </Sidebar>
    </>
  );
};

export default AddNewItemSidebar;
