"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  DataTable,
  DataTableDataSelectableEvent,
  DataTableRowEditCompleteEvent,
} from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { ExtensionItem, StatusItem, SupabaseUser, WorkqueueItem } from "@/types/supabase";
import { getAwaitingInfoStatusId, getCompletedStatusId, getExtendedStatusId, getMailedStatusId, getReceivedStatusId } from "@/utils/helpers";
import { Tag } from "primereact/tag";
import { getExtensionData, getStatusData, getWorkqueueData } from "@/utils/supabase/fetch-data";
import AddNewItemSidebar from "./add-new-workqueue-item";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import { ProgressSpinner } from "primereact/progressspinner";
import { format } from "date-fns";
import { createClient } from "@/utils/supabase/client";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import WorkqueueToolbar from "./workqueue/toolbar";
import AddNewItemDialog from "./workqueue/add-item-dialog";

interface WorkqueueProps {
  user: SupabaseUser;
  teamId: number;
}

export default function Workqueue({ user, teamId }: WorkqueueProps) {
  const [items, setItems] = useState<WorkqueueItem[]>([]);
  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const [extensions, setExtensions] = useState<ExtensionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isCellSelectable = (event: DataTableDataSelectableEvent) =>
    event.data.field === "identifier" || event.data.field === "last_updated_at"
      ? false
      : true;

  const [showCompleted, setShowCompleted] = useState(false);
  const [showAddItemSidebar, setShowAddItemSidebar] = useState(false);    

  // Initialize the Supabase client on the client side
  const supabase = createClient();
  const { user_metadata } = user;

  const receivedStatusId = getReceivedStatusId();
  const awaitingInfoStatusId = getAwaitingInfoStatusId();
  const extendedStatusId = getExtendedStatusId();
  const mailedStatusId = getMailedStatusId();
  const completedStatusId = getCompletedStatusId();

  // Fetch data once the component mounts
  useEffect(() => {
    async function fetchData() {
      const workqueueData = await getWorkqueueData();
      if (workqueueData) setItems(workqueueData);
      const statusData = await getStatusData();
      if (statusData) setStatuses(statusData);
      const extensionData = await getExtensionData();
      if (extensionData) setExtensions(extensionData);
      setLoading(false);
    }

    fetchData();
  }, []);

  const getSeverity = (statusId: number) => {
    switch (statusId) {
      case receivedStatusId:
        return "secondary";
      case awaitingInfoStatusId: 
        return "warning";
      case mailedStatusId: 
        return "warning";
      case completedStatusId: 
        return "success";
      case extendedStatusId:
        return "danger";
      default:
        return "info";
    }
  };

  const getExtensionSeverity = (extensionId: number | null) => {
    if (extensionId) return "secondary";
    else return null;
  };

  function getStatusNameInternalById(statusId: number): string | null {
    const status = statuses.find((status) => status.id === statusId);

    return status ? status.name_internal : "Unknown Status";
  }

  function getExtensionDateById(extensionDateId: number | null): string | null {
    const extension = extensions.find((extension) => extension.id === extensionDateId);

    return extension ? extension.name : "";
  }  

  const statusBodyTemplate = (rowData: WorkqueueItem) => {
    return (
      <Tag
        value={getStatusNameInternalById(rowData.status_id)}
        severity={getSeverity(rowData.status_id)}
      />
    );
  };
  const extensionBodyTemplate = (rowData: WorkqueueItem) => {
    if (rowData.extension_date_id) {
    return (
      <Tag
        value={getExtensionDateById(rowData.extension_date_id)}
        severity="danger"
      />
    );
    } else {
      return <></>
    }
  };

  const receivedDateBodyTemplate = (rowData: WorkqueueItem) => {
    return rowData.received_at
      ? format(new Date(rowData.received_at), "MM/dd/yyyy")
      : "";
  };

  const updatedDateBodyTemplate = (rowData: WorkqueueItem) => {
    return rowData.last_updated_at
      ? format(new Date(rowData.last_updated_at), "MM/dd/yyyy")
      : "";
  };

  const textEditor = (options: ColumnEditorOptions) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          options.editorCallback!(e.target.value)
        }
      />
    );
  };

  const statusEditor = (options: ColumnEditorOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses} // Make sure this contains your status objects
        onChange={(e: DropdownChangeEvent) => options.editorCallback!(e.value)} // Trigger editor callback on selection
        placeholder="Select a Status"
        itemTemplate={(option: StatusItem) => {
          // Custom template for each dropdown item
          return (
            <Tag
              value={option.name_internal}
              severity={getSeverity(option.id)}
            ></Tag>
          );
        }}
        optionLabel="name_internal" // This is the property to display in the dropdown
        optionValue="id" // This is the property that will be used as the value
      />
    );
  };

  const extensionEditor = (options: ColumnEditorOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={extensions} // Make sure this contains your status objects
        onChange={(e: DropdownChangeEvent) => options.editorCallback!(e.value)} // Trigger editor callback on selection
        placeholder="Select a date"
        showClear
        itemTemplate={(option: ExtensionItem) => {
          // Custom template for each dropdown item
          return (
            <Tag
              value={option.name}
              severity={getExtensionSeverity(option.id)}
            ></Tag>
          );
        }}
        optionLabel="name" // This is the property to display in the dropdown
        optionValue="id" // This is the property that will be used as the value
      />
    );
  };

  const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
    let _items = [...items];
    let { newData, index } = e;

    // Update database
    const updatedItem = newData as WorkqueueItem;
    if ((updatedItem.status_id === completedStatusId)) {
      updatedItem.position = null;
    }
    const { data: singleUpdate, error } = await supabase
      .from("workqueue")
      .update({
        status_id: updatedItem.status_id,
        identifier: updatedItem.identifier,
        received_at: updatedItem.received_at,
        position: updatedItem.position,
        last_updated_at: new Date().toISOString(),
      })
      .eq("id", updatedItem.id); // Match the row by its unique identifier

    // Check for any error during the update
    if (error) {
      console.error("Error updating workqueue item:", error);
      // Optionally show a message to the user that the update failed
    } else {
      let newPosition = 0;
      _items[index] = updatedItem;
      const reorderedItems = _items.map((item) => {
        if (item.status_id === completedStatusId) {
          return { ...item, position: null }; // Keep position null for completed items
        } else {
          newPosition++; // Increment position for all non-completed items
          return { ...item, position: newPosition };
        }
      });
      // Update the reordered items in the database
      const { data, error } = await supabase
        .from("workqueue")
        .upsert(reorderedItems)
        .select();

      // Check for any error during the update
      if (error) {
        console.error("Error updating positions in workqueue:", error);
      } else {
        setItems(reorderedItems);
      }
    }
  };

  const columns: {
    field: keyof WorkqueueItem;
    header: string;
    body?: (rowData: WorkqueueItem) => JSX.Element | string;
    editor?: (options: ColumnEditorOptions) => JSX.Element | string;
  }[] = [
    { field: "position", header: "Position" },
    { field: "identifier", header: "Identifier"},
    {
      field: "status_id",
      header: "Status",
      body: statusBodyTemplate,
      editor: statusEditor,
    },
    {
      field: "received_at",
      header: "Received on",
      body: receivedDateBodyTemplate,
    },
    {
      field: "last_updated_at",
      header: "Last updated on",
      body: updatedDateBodyTemplate,
    },
    { field: "extension_date_id", header: "Extension date", body: extensionBodyTemplate, editor: extensionEditor },
  ];

  let dynamicColumns = columns.map((col) => (
    <Column
      key={col.field}
      columnKey={col.field as string}
      field={col.field as string}
      header={col.header}
      body={col.body}
      editor={col.editor}
    />
  ));

  const allowEdit = (rowData: WorkqueueItem) => {
    return true;
  };

  const rowEditorColumn = (
    <Column
      rowEditor={allowEdit}
      headerStyle={{ width: "10%", minWidth: "8rem" }}
      bodyStyle={{ textAlign: "center" }}
    ></Column>
  );

  dynamicColumns.push(rowEditorColumn);

  const handleRowReorder = async (e: any) => {
    const reorderedItems = e.value as WorkqueueItem[];
    let newPosition = 0;
    const updatedItems = reorderedItems.map((item) => {
      if (item.status_id === completedStatusId) {
        return { ...item, position: null };
      }
      newPosition++;
      return { ...item, position: newPosition };
    });
    const { data, error } = await supabase
      .from("workqueue")
      .upsert(updatedItems)
      .select();

    // Check for any error during the update
    if (error) {
      console.error("Error updating workqueue item:", error);
      // Optionally show a message to the user that the update failed
    } else {
      setItems(data);
    }
  };

  const handleAddItem = (newItem: WorkqueueItem) => {
    setItems((prevItems) => [
      ...prevItems,
      {
        ...newItem,
        status_id: 1, // Default status_id "Received"
        received_at: newItem.received_at || new Date().toISOString(),
        position: newItem.position,
        teamId: teamId,
      },
    ]);
    setShowAddItemSidebar(false);
  };

  const filteredItems = items.filter(
    (item) => showCompleted || item.status_id !== completedStatusId
  );

  return (
    <div className="card">
      <WorkqueueToolbar showCompleted={showCompleted} setShowCompleted={setShowCompleted} setShowAddItemSidebar={setShowAddItemSidebar} />
      {loading ? (
        <ProgressSpinner aria-label="Loading" className="flex justify-center" />
      ) : (
          <DataTable
            value={filteredItems}
            reorderableRows
            onRowReorder={handleRowReorder}
            tableStyle={{ minWidth: "50rem" }}
            stripedRows
            isDataSelectable={isCellSelectable}
            editMode="row"
            dataKey="id"
            onRowEditComplete={onRowEditComplete}
                      >
            <Column rowReorder key="rowReorder" columnKey="rowReorder" style={{ width: "3rem" }} />
            {dynamicColumns}
          </DataTable>
      )}
      <AddNewItemDialog
            visible={showAddItemSidebar}
            onHide={() => setShowAddItemSidebar(false)}
            onAddItem={handleAddItem}
            userId={user_metadata.sub}
            teamId={teamId}
            supabase={supabase}
          />
    </div>
  );
}
