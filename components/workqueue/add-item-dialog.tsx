import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { WorkqueueItem } from "@/types/supabase";
import { Calendar } from "primereact/calendar";
import { SupabaseClient } from "@supabase/supabase-js";
import { Toast } from "primereact/toast";
import { getReceivedStatusId } from "@/utils/helpers";

interface AddNewItemDialogProps {
  visible: boolean;
  onHide: () => void;
  onAddItem: (newItem: WorkqueueItem) => void;
  userId: string;
  teamId: number;
  supabase: SupabaseClient;
}

const AddNewItemDialog: React.FC<AddNewItemDialogProps> = ({
  visible,
  onHide,
  onAddItem,
  userId,
  teamId,
  supabase,
}) => {
  const toast = useRef<Toast>(null);
  const receivedStatusId = getReceivedStatusId();

  const showMessage = (severity: "success" | "error", message: string) => {
    toast.current?.show({
      severity,
      summary: severity === "success" ? "Success" : "Error",
      detail: message,
      life: 3000,
    });
  };


  const [newItem, setNewItem] = useState<WorkqueueItem>({
    id: null,
    identifier: null,
    received_at: new Date(),
    last_updated_at: new Date(),
    status_id: receivedStatusId, // Default to "Received" status
    extension_date_id: null,
    position: null,
    team_id: teamId,
  });

  const [loading, setLoading] = useState(false);

  const handleAddNewItem = async () => {
    try {
      setLoading(true);

      const { data: maxPosition, error: maxPositionError } = await supabase.rpc("get_max_position");

      if (maxPositionError) {
        showMessage("error", maxPositionError.message);
        return;
      }

      const newPosition = (maxPosition || 0) + 1;

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
          team_id: teamId
        })
        .select();

      if (error) {
        throw new Error(error.message);
      }

      showMessage("success", "Item added successfully");

      onAddItem({
        ...newItem,
        identifier: newItem.identifier,
        received_at: newItem.received_at || new Date(),
        position: newPosition,
        team_id: teamId
      });
    } catch (err) {
      showMessage("error", (err as Error).message);
    } finally {
      setLoading(false);
      setNewItem({ ...newItem, identifier: null, position: null });
    }
  };

  const renderFooter = () => (
    <div className="flex justify-between mt-4">
      <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-secondary" />
      <Button
        label={loading ? "Saving..." : "Save"}
        icon="pi pi-plus"
        onClick={handleAddNewItem}
        disabled={loading}
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} position="bottom-left" />
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Add New Item"
        footer={renderFooter()}
        modal
        closable={false}
      >
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
            Enter the four-digit unique identifier for the tax filing
          </small>
        </div>

        <div className="mb-4">
          <label htmlFor="received_at" className="block mb-2">Received on</label>
          <Calendar
            id="received_at"
            value={newItem.received_at}
            onChange={(e) => {
              const value = e.target.value instanceof Date ? e.target.value : new Date();
              setNewItem({ ...newItem, received_at: value });
            }}
          />
        </div>
      </Dialog>
    </>
  );
};

export default AddNewItemDialog;
