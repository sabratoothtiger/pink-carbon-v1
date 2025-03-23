"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import {
  DataTable,
  DataTableFilterMeta,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import {
  getExtensionData,
  getMaxItemPosition,
  getMaxExternalQueuePosition,
  getStatusData,
  getWorkqueueData,
} from "@/utils/supabase/fetch-data";
import { format } from "date-fns";
import { createClient } from "@/utils/supabase/client";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import WorkqueueToolbar from "./toolbar";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode } from "primereact/api";

interface WorkqueueProps {
  userId: string;
  teamId: number;
}

interface WorkqueueItem {
  id: string ;
  position: number | null;
  external_queue_position: number | null;
  received_at: Date;
  last_updated_at: Date;
  last_updated_by: string;
  identifier: string | null;
  status_id: number;
  extension_date_id: number | null;
  return_year: number;
  team_id: number;
  [key: string]: any; // Allow extra properties
}

export default function WorkqueueTable({ userId, teamId }: WorkqueueProps) {
  // UI element states
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  // Data elements
  let emptyItem: WorkqueueItem = {
    id: "",
    position: null,
    external_queue_position: null,
    received_at: new Date(),
    last_updated_at: new Date(),
    last_updated_by: userId,
    identifier: null,
    status_id: 1,
    extension_date_id: null,
    return_year: 2024,
    team_id: teamId,
  };
  const [item, setItem] = useState<WorkqueueItem>(emptyItem);
  const [items, setItems] = useState<WorkqueueItem[]>([]);
  const [itemDialog, setItemDialog] = useState<boolean>(false);
  const [deleteItemDialog, setDeleteItemDialog] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);    
  const [statusColors, setStatusColors] = useState<
    Record<
      number,
      | "success"
      | "info"
      | "secondary"
      | "contrast"
      | "warning"
      | "danger"
      | null
      | undefined
    >
  >({});
  const [statusNames, setStatusNames] = useState<Record<number, string>>({});
  const [completedStatusId, setCompletedStatusId] = useState<number | null>(10);
  const [extendedStatusId, setExtendedStatusId] = useState<number | null>(5);
  const [receivedStatusId, setReceivedStatusId] = useState<number | null>(1);
  const [extensions, setExtensions] = useState<Record<number, string>>({});
  const [isIdentifierAvailable, setIsIdentifierAvailable] =
    useState<boolean>(true);
  const [returnYear, setReturnYear] = useState<number>(2024);
  const toast = useRef<Toast>(null);
  // Initialize the Supabase client on the client side
  const supabase = createClient();

  // Fetch data once the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        let [
          workqueueData,
          { colorMap: statusColorData, nameMap: statusNameData },
          extensionData,
        ] = await Promise.all([
          getWorkqueueData(),
          getStatusData(),
          getExtensionData(),
        ]);

        if (workqueueData) setItems(workqueueData);
        if (statusColorData) setStatusColors(statusColorData);
        if (statusNameData) setStatusNames(statusNameData);
        if (extensionData) setExtensions(extensionData);

        /* 
        const _completedStatusId = findStatusId(statusNames, "completed");
        setCompletedStatusId(_completedStatusId);
        const _extendedStatusId = findStatusId(statusNames, "extended");
        setExtendedStatusId(_extendedStatusId); */

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const _completedStatusId = findStatusId(statusNames, "completed");
  const _extendedStatusId = findStatusId(statusNames, "extended");

  // Find the id associated with the status
  function findStatusId(
    statusNameMap: Record<number, string>,
    statusName: string
  ): number {
    for (const [id, name] of Object.entries(statusNameMap)) {
      if (name.toLowerCase() === statusName.toLowerCase()) {
        return parseInt(id);
      }
    }
    return -1;
  }

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status_id: { value: 10, matchMode: FilterMatchMode.NOT_EQUALS },
  });
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      global: { ...prevFilters.global, value },
    }));
    setGlobalFilterValue(value);
  };

  // Define the column formatting
  const statusBodyTemplate = (rowData: WorkqueueItem) => {
    return (
      <Tag
        value={statusNames[rowData.status_id]}
        severity={statusColors[rowData.status_id]}
      />
    );
  };

  const extensionBodyTemplate = (rowData: WorkqueueItem) => {
    if (rowData.extension_date_id) {
      return (
        <Tag value={extensions[rowData.extension_date_id]} severity="danger" />
      );
    } else {
      return <></>;
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

  const actionBodyTemplate = (rowData: WorkqueueItem) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editItem(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteItem(rowData)}
        />
      </React.Fragment>
    );
  };

  const statusDropdownOptions = Object.entries(statusNames).map(
    ([id, name]) => ({
      id: Number(id), // Ensure the ID is a number
      name: name,
    })
  );
  const extensionDropdownOptions = Object.entries(extensions).map(
    ([id, name]) => ({
      id: Number(id), // Ensure the ID is a number
      name: name,
    })
  );

  // Define the columns
  const columns: {
    field: keyof WorkqueueItem;
    header: string;
    body?: (rowData: WorkqueueItem) => JSX.Element | string;
  }[] = [
    { field: "position", header: "Position" },
    { field: "external_queue_position", header: "Client View Position" },
    { field: "identifier", header: "Identifier" },
    {
      field: "status_id",
      header: "Status",
      body: statusBodyTemplate,
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
    {
      field: "extension_date_id",
      header: "Extension date",
      body: extensionBodyTemplate,
    },
  ];

  let dynamicColumns = columns.map((col) => (
    <Column
      key={col.field}
      columnKey={col.field as string}
      field={col.field as string}
      header={col.header}
      body={col.body}
    />
  ));

  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setItem(emptyItem);
    setSubmitted(false);
    setItemDialog(true);
  };

  const hideItemDialog = () => {
    setSubmitted(false);
    setItemDialog(false);
  };

  const hideDeleteItemDialog = () => {
    setDeleteItemDialog(false);
  };

  const checkIsIdentifierAvailable = async (value: string) => {
    try {
      const { data, error } = await supabase.rpc("is_identifier_available", {
        "p_identifier": value,
        "p_return_year": returnYear,
        "p_team_id": teamId,
      });
      setIsIdentifierAvailable(data);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error checking identifier:", error);
    }
  };

  const saveItem = async () => {
    setSubmitted(true);

    // Validation: Ensure identifier is entered
    if (!item.identifier) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Identifier is required",
          life: 3000,
        });
        return;
      }
    else {
     checkIsIdentifierAvailable(item.identifier );
     // Validation: Ensure identifier is available
        if (!isIdentifierAvailable) {
            toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Identifier is already in use",
            life: 3000,
            });
            return;
        }
    }

    // Validation: Ensure extension date is selected when extended
    if (item.status_id === extendedStatusId && !item.extension_date_id) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Extension date is required for Extended status",
        life: 3000,
      });
      return;
    }

    if (item.status_id === completedStatusId) {
      item.position = null;
      item.external_queue_position = null;
    } else if ((item.status_id === receivedStatusId) && (item.position = null)) {
      item.position = (await getMaxItemPosition(teamId)) + 1;
      item.external_queue_position = (await getMaxExternalQueuePosition(teamId)) + 1;
    } else if (item.position = null) {
      item.position = (await getMaxItemPosition(teamId)) + 1;
      item.external_queue_position = null;
    }

    const trimmedIdentifier = item.identifier.trim();
    const _items = [...items];
    const _item = { ...item, identifier: trimmedIdentifier };

    try {
      if (item.id) {
        // Update existing item in Supabase
        const { data, error } = await supabase
          .from("workqueue")
          .update(_item)
          .eq("id", item.id)
          .select(); // Return updated record

        if (error) {
          throw error;
        }

        // Update local state
        const index = findIndexById(item.id);
        _items[index] = data[0];
        toast.current?.show({
          severity: "success",
          summary: "Successful",
          detail: "Item updated",
          life: 3000,
        });
      } else {
        const { id, ..._itemWithoutId } = _item;
        // Insert new item into Supabase
        const { data, error } = await supabase
          .from("workqueue")
          .insert([_itemWithoutId])
          .select(); // Return inserted record

        if (error) {
          throw error;
        }

        // Add new item to local state
        _items.push(data[0]);
        toast.current?.show({
          severity: "success",
          summary: "Successful",
          detail: "Item created",
          life: 3000,
        });
      }

      // Recalculate positions
      let newPosition = 0;
      let newExternalQueuePosition = 0;
      const _reorderedItems = _items.map((item) => {
        if (item.status_id === completedStatusId) {
          return { ...item, position: null, external_queue_position: null }; // Keep position null for completed items
        }
        if (item.status_id === receivedStatusId) {
          newPosition++;
          newExternalQueuePosition++;
          return { ...item, position: newPosition, external_queue_position: newExternalQueuePosition };
        }
        newPosition++;
        return { ...item, position: newPosition, external_queue_position: null };
      });
  
      // Update positions in Supabase
      const { error: reorderError } = await supabase
        .from("workqueue") 
        .upsert(_reorderedItems);
  
      if (reorderError) {
        throw reorderError;
      }


      setIsIdentifierAvailable(true);
      setItems(_reorderedItems);
      setItemDialog(false);
      setItem(emptyItem);

      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Positions recalculated",
        life: 3000,
      });
    } catch (error) {
      console.error("Error saving item:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save item or update positions",
        life: 3000,
      });
    }
  };

  const onDropdownChange = (e: DropdownChangeEvent, name: string) => {
    const val = e.value || null;
    setItem({ ...item, [name]: val });
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    setItem({ ...item, [name]: val });
  };

  const onInputTextAreaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || " ";
    setItem({ ...item, [name]: val });
  };

  const editItem = (item: WorkqueueItem) => {
    setItem({ ...item });
    setItemDialog(true);
  };

  const confirmDeleteItem = (item: WorkqueueItem) => {
    setItem(item);
    setDeleteItemDialog(true);
  };

  const deleteItem = async () => {
    try {
      // Call Supabase to delete the item
      const { error } = await supabase
        .from("workqueue")
        .delete()
        .eq("id", item.id);

      if (error) {
        throw error;
      }

      // Update local items by filtering out the deleted item
      const _items = items.filter((val) => val.id !== item.id);

      // Recalculate positions
      let newPosition = 0;
      let newExternalQueuePosition = 0;
      const _reorderedItems = _items.map((item) => {
        if (item.status_id === completedStatusId) {
          return { ...item, position: null }; // Keep position null for completed items
        }
        if (item.status_id === receivedStatusId) {
          newPosition++;
          newExternalQueuePosition++;
          return { ...item, position: newPosition, external_queue_position: newExternalQueuePosition };
        }
        newPosition++;
        return { ...item, position: newPosition };
      });

      // Update positions in Supabase
      const { error: reorderError } = await supabase
        .from("workqueue")
        .upsert(_reorderedItems);

      if (reorderError) {
        throw reorderError;
      }
  
      // Update local state and reset dialog/form
      setItems(_reorderedItems);
      setDeleteItemDialog(false);
      setItem(emptyItem);
      
      // Show success message
      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Item deleted and positions recalculated",
        life: 3000,
      });
    } catch (err) {
      console.error("Error deleting item or updating positions", err);
      
      // Show error message
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete item or update positions",
        life: 3000,
      });
    }
  };

  const handleRowReorder = async (rowData: WorkqueueItem[]) => {
    let newPosition = 0;
    let newExternalQueuePosition = 0;
    const _items = rowData.map((item) => {
      if (item.status_id === completedStatusId) {
        return { ...item, position: null, external_queue_position: null };
      }
      if (item.status_id === receivedStatusId) {
        newPosition++;
        newExternalQueuePosition++;
        return { ...item, position: newPosition, external_queue_position: newExternalQueuePosition };
      }
      newPosition++;
      return { ...item, position: newPosition, external_queue_position: null  };
    });
    
    try {
      const { data, error } = await supabase
        .from("workqueue") // Replace with your actual table name
        .upsert(_items)
        .select();
  
      if (error) {
        throw error;
      }
  
      // Update items state and show success message
      setItems(_items);
      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Positions have been recalculated",
        life: 3000,
      });
    } catch (err) {
      console.error("Error recalculating positions:", err);
      // Show error toast
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to recalculate positions",
        life: 3000,
      });
    }
  };
  
  const handleShowCompleted: () => void = () => {
    setShowCompleted(!showCompleted);
    setFilters((prevFilters) => ({
      ...prevFilters,
      status_id: {
        value: showCompleted ? completedStatusId : '', // Toggle between '' and completedStatusId
        matchMode: FilterMatchMode.NOT_EQUALS,
      },
    }));
  };  

  const itemDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={hideItemDialog}
      />
      <Button label="Save" icon="pi pi-check" onClick={saveItem} />
    </React.Fragment>
  );
  const deleteItemDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteItemDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteItem}
      />
    </React.Fragment>
  );


  return (
    <div className="card">
      <WorkqueueToolbar
        showCompleted={showCompleted}
        handleShowCompleted={handleShowCompleted}
        openNew={openNew}
        globalFilterValue={globalFilterValue}
        onGlobalFilterChange={onGlobalFilterChange}
      />
      {loading ? (
        <div className="skeleton-table">
          <Skeleton
            shape="rectangle"
            className="mb-2"
            height="2rem"
            width="100%"
          />
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex mb-2">
                <Skeleton
                  shape="rectangle"
                  height="2rem"
                  width="10%"
                  className="mr-2"
                />
                {Array(5)
                  .fill(0)
                  .map((_, colIndex) => (
                    <Skeleton
                      key={colIndex}
                      shape="rectangle"
                      height="2rem"
                      width="15%"
                      className="mr-2"
                    />
                  ))}
              </div>
            ))}
        </div>
      ) : (
        <DataTable
          value={items}
          tableStyle={{ minWidth: "50rem" }}
          stripedRows
          reorderableRows
          scrollable
          scrollHeight="62vh"
          onRowReorder={(e) => handleRowReorder(e.value)}
          dataKey="id"
          filters={filters}
          globalFilterFields={["identifier", "notes", "status_id"]}
          paginator
          rows={30}
          rowsPerPageOptions={[30, 50, 100, 250, 500]}
          responsiveLayout="scroll"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
        >
          <Column
            rowReorder
            key="rowReorder"
            columnKey="rowReorder"
            style={{ width: "3rem" }}
          />
          {dynamicColumns}
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
            className="text-right"
          ></Column>
        </DataTable>
      )}

      <Dialog
        visible={itemDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Item Details"
        modal
        className="p-fluid"
        footer={itemDialogFooter}
        onHide={hideItemDialog}
      >
        <div className="field mb-5">
          <label htmlFor="identifier" className="font-bold mb-3">
            Identifier
          </label>
          <InputText
            id="identifier"
            value={item.identifier}
            onChange={(e) => {
              onInputChange(e, "identifier");
            }}
            required
            autoFocus
          />
          {!submitted && (
            <small id="identifier-help" className="text-gray-500">
              Enter the unique identifier for the tax filing
            </small>
          )}

          {submitted && !item.identifier && (
            <small className="p-error">Identifier is required</small>
          )}
          {submitted && !isIdentifierAvailable && (
            <small className="p-error">Identifier is already taken</small>
          )}
        </div>

        <div className="formgrid grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Dropdown */}
          <div className="field col mb-5">
            <label htmlFor="status_id" className="font-bold mb-3">
              Status
            </label>
            <Dropdown
              id="status_id"
              value={item.status_id}
              options={statusDropdownOptions}
              onChange={(e) => onDropdownChange(e, "status_id")}
              itemTemplate={(option: { id: number; name: string }) => {
                return (
                  <Tag
                    value={option.name}
                    severity={statusColors[option.id]}
                  ></Tag>
                );
              }}
              optionLabel="name"
              optionValue="id"
            />
          </div>

          {/* Extension Dropdown */}
          <div className="field col mb-5">
            <label htmlFor="extension_date_id" className="font-bold mb-3">
              Extension Date
            </label>
            <Dropdown
              id="extension_date_id"
              value={item.extension_date_id ?? ""}
              options={extensionDropdownOptions}
              onChange={(e) => onDropdownChange(e, "extension_date_id")}
              placeholder=""
              showClear
              disabled={item.status_id !== extendedStatusId}
              itemTemplate={(option: { id: number; name: string }) => {
                return (
                  <Tag
                    value={option.name}
                    severity={option.id ? "danger" : null}
                  ></Tag>
                );
              }}
              optionLabel="name"
              optionValue="id"
              className={classNames({ "p-invalid": submitted && !item.name })}
            />
            {submitted &&
              item.status_id === extendedStatusId &&
              !item.extension_date_id && (
                <small className="p-error">Extension date is required</small>
              )}
          </div>
        </div>

        <div className="field">
          <label htmlFor="notes" className="font-bold">
            Notes
          </label>
          <InputTextarea
            id="notes"
            value={item.notes}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              onInputTextAreaChange(e, "notes")
            }
            rows={3}
            cols={20}
          />
        </div>
      </Dialog>

      <Dialog
        visible={deleteItemDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteItemDialogFooter}
        onHide={hideDeleteItemDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {item && (
            <span>
              Are you sure you want to delete <b>{item.identifier}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
