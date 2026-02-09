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
  getStatusInternalData,
  getWorkqueueData,
  getStatusExternalData,
} from "@/lib/supabase/fetch-data";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { formatLocalizedDate, formatLocalizedDateTime, formatDateForInput, convertInputDateToUTC, getCurrentUTC } from "@/utils/utils";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import WorkqueueToolbar from "./toolbar";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Editor } from "primereact/editor";
import { classNames } from "primereact/utils";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode } from "primereact/api";

interface WorkqueueProps {
  userId: string;
  accountId: number;
  selectedItemId?: string;
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
  account_id: number;
  [key: string]: any; // Allow extra properties
}

export default function WorkqueueTable({ userId, accountId, selectedItemId }: WorkqueueProps) {
  // UI element states
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  // Data elements
  let emptyItem: WorkqueueItem = {
    id: "",
    position: null,
    external_queue_position: null,
    received_at: getCurrentUTC(),
    last_updated_at: getCurrentUTC(),
    last_updated_by: userId,
    identifier: "",
    status_id: 1,
    extension_date_id: null,
    return_year: new Date().getFullYear() - 1,
    account_id: accountId,
    notes: "",
  };
  const [item, setItem] = useState<WorkqueueItem>(emptyItem);
  const [items, setItems] = useState<WorkqueueItem[]>([]);
  const [itemDialog, setItemDialog] = useState<boolean>(false);
  const [deleteItemDialog, setDeleteItemDialog] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);    
  const [expandedRows, setExpandedRows] = useState<any>(null);
  const [editingField, setEditingField] = useState<{[key: string]: string | null}>({});
  const [editingValues, setEditingValues] = useState<{[key: string]: any}>({});
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
  const [statusInternalNames, setStatusInternalNames] = useState<Record<number, string>>({});
  const [statusExternalNames, setStatusExternalNames] = useState<Record<number, string>>({});
  const [completedStatusId, setCompletedStatusId] = useState<number>(10);
  const [extendedStatusId, setExtendedStatusId] = useState<number>(5);
  const [receivedStatusId, setReceivedStatusId] = useState<number | null>(1);
  const [extensions, setExtensions] = useState<Record<number, string>>({});
  const [isIdentifierAvailable, setIsIdentifierAvailable] =
    useState<boolean>(true);
  const [returnYear, setReturnYear] = useState<number | null>(null);
  const [clientMessages, setClientMessages] = useState<Record<string, string>>({});
  const [accountSubdomain, setAccountSubdomain] = useState<string>("");
  const toast = useRef<Toast>(null);
  // Initialize the Supabase client on the client side
  const supabase = createClient();

  // Fetch account subdomain
  const fetchAccountSubdomain = async () => {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("subdomain")
        .eq("id", accountId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data?.subdomain) {
        setAccountSubdomain(data.subdomain);
      }
    } catch (error) {
      console.error("Error fetching account subdomain:", error);
    }
  };

  // Fetch client message for specific item
  const fetchClientMessage = async (identifier: string, returnYear: number) => {
    if (!accountSubdomain || !identifier) return;
    
    try {
      const { data, error } = await supabase.rpc("get_status_by_identifier", {
        subdomain: accountSubdomain,
        return_year: returnYear,
        four_digit_number: identifier,
      });

      if (error) {
        throw error;
      }

      const itemKey = `${identifier}-${returnYear}`;
      setClientMessages(prev => ({
        ...prev,
        [itemKey]: data || "No message available"
      }));
    } catch (error) {
      console.error("Error fetching client message:", error);
      const itemKey = `${identifier}-${returnYear}`;
      setClientMessages(prev => ({
        ...prev,
        [itemKey]: "Error loading message"
      }));
    }
  };

  // Fetch data once the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        let [
          workqueueData,
          { colorMap: statusInternalColorData, nameMap: statusInternalNameData },
          { colorMap: statusExternalColorData, nameMap: statusExternalNameData },
          extensionData,
        ] = await Promise.all([
          getWorkqueueData(),
          getStatusInternalData(),
          getStatusExternalData(),
          getExtensionData(),
        ]);

        if (workqueueData) setItems(workqueueData);
        if (statusInternalColorData) setStatusColors(statusInternalColorData);
        if (statusInternalNameData) setStatusInternalNames(statusInternalNameData);
        if (statusExternalNameData) setStatusExternalNames(statusExternalNameData);
        if (extensionData) setExtensions(extensionData);

        // Fetch account subdomain
        await fetchAccountSubdomain();

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
        value={statusInternalNames[rowData.status_id]}
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
      ? formatLocalizedDate(rowData.received_at, 'short')
      : "";
  };

  const updatedDateBodyTemplate = (rowData: WorkqueueItem) => {
    return rowData.last_updated_at
      ? formatLocalizedDateTime(rowData.last_updated_at)
      : "";
  };

  const actionBodyTemplate = (rowData: WorkqueueItem) => {
    const isExpanded = expandedRows && expandedRows[rowData.id];
    return (
      <Button
        icon={isExpanded ? "pi pi-eye-slash" : "pi pi-eye"}
        rounded
        outlined
        onClick={() => toggleRowExpansion(rowData)}
        tooltip={isExpanded ? "Collapse" : "View Details"}
        tooltipOptions={{ position: "left" }}
      />
    );
  };

  const statusDropdownOptions = Object.entries(statusInternalNames).map(
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
    { field: "identifier", header: "Identifier" },
    { field: "return_year", header: "Return Year" },
    {
      field: "received_at",
      header: "Received on",
      body: receivedDateBodyTemplate,
    },
    {
      field: "status_id",
      header: "Internal Status",
      body: statusBodyTemplate,
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
        "p_account_id": accountId,
        "p_identifier": value,
        "p_return_year": returnYear,
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
    // Validation: Ensure identifier is entered
    if (!item.identifier) {
        setSubmitted(true);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Identifier is required",
          life: 3000,
        });
        return;
      }

    // Check identifier availability
    await checkIsIdentifierAvailable(item.identifier);
    
    // Validation: Ensure identifier is available
    if (!isIdentifierAvailable) {
        setSubmitted(true);
        toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Identifier is already in use",
        life: 3000,
        });
        return;
    }

    // Validation: Ensure extension date is selected when extended
    if (item.status_id === extendedStatusId && !item.extension_date_id) {
      setSubmitted(true);
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
      item.position = (await getMaxItemPosition(accountId)) + 1;
      item.external_queue_position = (await getMaxExternalQueuePosition(accountId)) + 1;
    } else if (item.position = null) {
      item.position = (await getMaxItemPosition(accountId)) + 1;
      item.external_queue_position = null;
    }

    const trimmedIdentifier = item.identifier.trim();
    const _items = [...items];
    const _item = { 
      ...item, 
      identifier: trimmedIdentifier,
      last_updated_at: getCurrentUTC(),
      last_updated_by: userId
    };

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
      setSubmitted(false);
    } catch (error) {
      console.error("Error saving item:", error);
      
      // Check for unique constraint violation (PostgreSQL error code 23505)
      let errorMessage = "Failed to save item or update positions";
      if ((error as any)?.code === '23505' || (error as any)?.message?.includes('23505')) {
        errorMessage = "That identifier is already in use for that return year.";
      }
      
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
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
    
    // Handle date fields - convert to UTC for storage
    if (name === 'received_at' && val) {
      setItem({ ...item, [name]: convertInputDateToUTC(val) });
    } else {
      setItem({ ...item, [name]: val });
    }
  };

  const onInputTextAreaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || " ";
    setItem({ ...item, [name]: val });
  };

  const onRichTextChange = (content: string, name: string) => {
    setItem({ ...item, [name]: content || "" });
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
  
      // Update items state
      setItems(_items);
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

  const rowExpansionTemplate = (data: WorkqueueItem) => {
    const isEditingIdentifier = editingField[data.id] === 'identifier';
    const isEditingReturnYear = editingField[data.id] === 'return_year';
    const isEditingReceivedAt = editingField[data.id] === 'received_at';
    const isEditingStatus = editingField[data.id] === 'status_id';
    const isEditingExtension = editingField[data.id] === 'extension_date_id';
    const isEditingNotes = editingField[data.id] === 'notes';

    const clientMessageKey = `${data.identifier}-${data.return_year}`;
    const clientMessage = clientMessages[clientMessageKey];

    return (
      <div className="p-3 bg-gray-900 border-t border-gray-700">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Side - Internal View and Client View */}
          <div className="lg:col-span-2 space-y-4">
            {/* Internal View Section */}
            <div className="bg-gray-800 rounded p-4 shadow-sm border border-gray-700">
              <div className="flex items-center mb-3">
                <i className="pi pi-users text-blue-400 mr-2"></i>
                <h3 className="text-sm font-semibold text-gray-200">Internal View</h3>
              </div>
              
              {/* Basic Information */}
              <div className="space-y-4">
                {/* First Row: Identifier, Return Year, Received Date */}
                <div className="grid grid-cols-3 gap-2 min-w-0">
                  {/* Identifier */}
                  <div className="min-w-0">
                    <label className="text-xs font-medium text-gray-400 block mb-1">Identifier</label>
                    {isEditingIdentifier ? (
                      <div className="flex items-center space-x-1 min-w-0">
                        <InputText
                          value={editingValues[data.id]?.identifier ?? data.identifier}
                          onChange={(e) => setEditingValues(prev => ({
                            ...prev,
                            [data.id]: { ...prev[data.id], identifier: e.target.value }
                          }))}
                          className="flex-1 text-sm min-w-0"
                          size="small"
                        />
                        <Button icon="pi pi-check" size="small" severity="success" onClick={() => saveField(data, 'identifier')} className="flex-shrink-0" />
                        <Button icon="pi pi-times" size="small" severity="secondary" onClick={() => cancelEdit(data.id)} className="flex-shrink-0" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-100">{data.identifier}</span>
                        <Button icon="pi pi-pencil" size="small" text severity="info" onClick={() => startEdit(data, 'identifier')} />
                      </div>
                    )}
                  </div>

                  {/* Return Year */}
                  <div className="min-w-0">
                    <label className="text-xs font-medium text-gray-400 block mb-1">Return Year</label>
                    {isEditingReturnYear ? (
                      <div className="flex items-center space-x-1 min-w-0">
                        <InputText
                          type="number"
                          value={editingValues[data.id]?.return_year ?? data.return_year}
                          onChange={(e) => setEditingValues(prev => ({
                            ...prev,
                            [data.id]: { ...prev[data.id], return_year: parseInt(e.target.value) }
                          }))}
                          className="flex-1 text-sm min-w-0"
                          size="small"
                        />
                        <Button icon="pi pi-check" size="small" severity="success" onClick={() => saveField(data, 'return_year')} className="flex-shrink-0" />
                        <Button icon="pi pi-times" size="small" severity="secondary" onClick={() => cancelEdit(data.id)} className="flex-shrink-0" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-100">{data.return_year}</span>
                        <Button icon="pi pi-pencil" size="small" text severity="info" onClick={() => startEdit(data, 'return_year')} />
                      </div>
                    )}
                  </div>

                  {/* Received Date */}
                  <div className="min-w-0">
                    <label className="text-xs font-medium text-gray-400 block mb-1">Received Date</label>
                    {isEditingReceivedAt ? (
                      <div className="flex items-center space-x-1 min-w-0">
                        <InputText
                          type="date"
                          value={editingValues[data.id]?.received_at ?? formatDateForInput(data.received_at)}
                          onChange={(e) => setEditingValues(prev => ({
                            ...prev,
                            [data.id]: { ...prev[data.id], received_at: e.target.value }
                          }))}
                          className="flex-1 text-sm min-w-0"
                          size="small"
                        />
                        <Button icon="pi pi-check" size="small" severity="success" onClick={() => saveField(data, 'received_at')} className="flex-shrink-0" />
                        <Button icon="pi pi-times" size="small" severity="secondary" onClick={() => cancelEdit(data.id)} className="flex-shrink-0" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-100">
                          {data.received_at ? formatLocalizedDate(data.received_at, 'long') : "N/A"}
                        </span>
                        <Button icon="pi pi-pencil" size="small" text severity="info" onClick={() => startEdit(data, 'received_at')} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Second Row: Status, Extension, Placeholder */}
                <div className="grid grid-cols-3 gap-2 min-w-0">
                  {/* Internal Status */}
                  <div className="min-w-0">
                    <label className="text-xs font-medium text-gray-400 block mb-1">Status</label>
                    {isEditingStatus ? (
                      <div className="flex items-center space-x-1 min-w-0">
                        <Dropdown
                          value={editingValues[data.id]?.status_id ?? data.status_id}
                          options={statusDropdownOptions}
                          onChange={(e) => setEditingValues(prev => ({
                            ...prev,
                            [data.id]: { ...prev[data.id], status_id: e.value }
                          }))}
                          optionLabel="name"
                          optionValue="id"
                          className="flex-1 min-w-0"
                        />
                        <Button icon="pi pi-check" size="small" severity="success" onClick={() => saveField(data, 'status_id')} className="flex-shrink-0" />
                        <Button icon="pi pi-times" size="small" severity="secondary" onClick={() => cancelEdit(data.id)} className="flex-shrink-0" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <Tag value={statusInternalNames[data.status_id]} severity={statusColors[data.status_id]} />
                        <Button icon="pi pi-pencil" size="small" text severity="info" onClick={() => startEdit(data, 'status_id')} />
                      </div>
                    )}
                  </div>

                  {/* Extension */}
                  <div className="min-w-0">
                    <label className="text-xs font-medium text-gray-400 block mb-1">Extension</label>
                    {isEditingExtension ? (
                      <div className="flex items-center space-x-1 min-w-0">
                        <Dropdown
                          value={editingValues[data.id]?.extension_date_id ?? data.extension_date_id ?? ""}
                          options={extensionDropdownOptions}
                          onChange={(e) => setEditingValues(prev => ({
                            ...prev,
                            [data.id]: { ...prev[data.id], extension_date_id: e.value === "" ? null : e.value }
                          }))}
                          optionLabel="name"
                          optionValue="id"
                          placeholder="No extension date set"
                          showClear
                          className="flex-1 min-w-0"
                        />
                        <Button icon="pi pi-check" size="small" severity="success" onClick={() => saveField(data, 'extension_date_id')} className="flex-shrink-0" />
                        <Button icon="pi pi-times" size="small" severity="secondary" onClick={() => cancelEdit(data.id)} className="flex-shrink-0" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          {data.extension_date_id ? (
                            <Tag value={extensions[data.extension_date_id]} severity="danger" />
                          ) : (
                            <span className="text-xs text-gray-400 italic">No extension date set</span>
                          )}
                        </div>
                        {(statusInternalNames[data.status_id] === 'Extended' || statusInternalNames[data.status_id] === 'Completed') && (
                          <Button icon="pi pi-pencil" size="small" text severity="info" onClick={() => startEdit(data, 'extension_date_id')} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Placeholder */}
                  <div></div>
                </div>
              </div>
            </div>

            {/* Client View Section */}
            <div className="bg-gray-800 rounded p-4 shadow-sm border border-gray-700">
              <div className="flex items-center mb-3">
                <i className="pi pi-eye text-green-400 mr-2"></i>
                <h3 className="text-sm font-semibold text-gray-200">Client View</h3>
              </div>
              
              <div className="space-y-3">
                {/* Status and Position - Same Line */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1">Status</label>
                    <div className="text-sm text-gray-100">
                      <Tag value={statusExternalNames[data.status_id]} severity={statusColors[data.status_id]} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1">Position</label>
                    <div className="text-sm text-gray-100">
                      {data.external_queue_position ? (
                        <span className="font-medium">#{data.external_queue_position}</span>
                      ) : (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Client Message */}
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Client Message</label>
                  <div className="text-sm text-gray-100 bg-gray-700 rounded p-3">
                    {clientMessage || "Loading message..."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Internal Notes */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded p-4 shadow-sm border border-gray-700 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <i className="pi pi-file-edit text-yellow-400 mr-2"></i>
                  <label className="text-sm font-semibold text-gray-200">Internal Notes</label>
                </div>
                {!isEditingNotes && (
                  <Button icon="pi pi-pencil" size="small" text severity="info" onClick={() => startEdit(data, 'notes')} />
                )}
              </div>
              
              {isEditingNotes ? (
                <div className="h-full relative">
                  <div className="editor-container mb-2">
                    <Editor
                      value={editingValues[data.id]?.notes ?? data.notes ?? ''}
                      onTextChange={(e) => setEditingValues(prev => ({
                        ...prev,
                        [data.id]: { ...prev[data.id], notes: e.htmlValue || '' }
                      }))}
                      style={{ height: '300px', marginBottom: '0px' }}
                      className="flex-1"
                      placeholder="Enter internal notes..."
                      headerTemplate={
                        <span className="ql-formats">
                          <button className="ql-bold" aria-label="Bold"></button>
                          <button className="ql-italic" aria-label="Italic"></button>
                          <button className="ql-underline" aria-label="Underline"></button>
                          <button className="ql-strike" aria-label="Strike"></button>
                          <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
                          <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
                          <button className="ql-indent" value="-1" aria-label="Outdent"></button>
                          <button className="ql-indent" value="+1" aria-label="Indent"></button>
                          <select className="ql-color" aria-label="Text Color"></select>
                          <select className="ql-background" aria-label="Background Color"></select>
                          <select className="ql-align" aria-label="Text Align"></select>
                          <button className="ql-link" aria-label="Link"></button>
                          <button className="ql-clean" aria-label="Remove Formatting"></button>
                        </span>
                      }
                    />
                    <style jsx>{`
                      .editor-container :global(.ql-toolbar) {
                        background-color: #374151 !important;
                        border-color: #4B5563 !important;
                      }
                      .editor-container :global(.ql-toolbar .ql-stroke) {
                        stroke: #E5E7EB !important;
                      }
                      .editor-container :global(.ql-toolbar .ql-fill) {
                        fill: #E5E7EB !important;
                      }
                      .editor-container :global(.ql-toolbar button:hover) {
                        background-color: #4B5563 !important;
                      }
                      .editor-container :global(.ql-toolbar button.ql-active) {
                        background-color: #6B7280 !important;
                      }
                      .editor-container :global(.ql-toolbar .ql-picker-label) {
                        color: #E5E7EB !important;
                      }
                      .editor-container :global(.ql-toolbar .ql-picker-options) {
                        background-color: #374151 !important;
                        border-color: #4B5563 !important;
                      }
                      .editor-container :global(.ql-toolbar .ql-picker-item) {
                        color: #E5E7EB !important;
                      }
                      .editor-container :global(.ql-toolbar .ql-picker-item:hover) {
                        background-color: #4B5563 !important;
                      }
                      .editor-container :global(.ql-container) {
                        background-color: #1F2937 !important;
                        color: #FFFFFF ;
                        border-color: #4B5563 !important;
                      }
                      .editor-container :global(.ql-editor) {
                        color: #FFFFFF;
                      }
                      .editor-container :global(.ql-editor p) {
                        color: #FFFFFF ; 
                      }
                      .editor-container :global(.ql-editor.ql-blank::before) {
                        color: #FFFFFF;
                        opacity: 0.6;
                      }
                      .editor-container :global(.p-editor) {
                        margin-bottom: 0 !important;
                      }
                      .editor-container :global(.p-editor .ql-container) {
                        margin-bottom: 0 !important;
                      }
                    `}</style>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button icon="pi pi-check" label="Save" size="small" severity="success" onClick={() => saveField(data, 'notes')} />
                    <Button icon="pi pi-times" label="Cancel" size="small" severity="secondary" onClick={() => cancelEdit(data.id)} />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-100 leading-relaxed h-full">
                  {data.notes ? (
                    <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: data.notes }} />
                  ) : (
                    <p className="text-gray-400 italic m-0">No internal notes available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer - Last Updated Info */}
        <div className="mt-3 pt-2 border-t border-gray-700">
          <div className="text-xs text-gray-500 text-left">
            Last updated {data.last_updated_at ? formatLocalizedDateTime(data.last_updated_at) : "N/A"} by {data.last_updated_by}
          </div>
        </div>
      </div>
    );
  };

  const onRowDoubleClick = (event: any) => {
    const rowData = event.data;
    if (expandedRows && expandedRows[rowData.id]) {
      // Row is expanded, collapse it
      const newExpandedRows = { ...expandedRows };
      delete newExpandedRows[rowData.id];
      setExpandedRows(newExpandedRows);
    } else {
      // Row is collapsed, expand it
      setExpandedRows({ ...expandedRows, [rowData.id]: true });
      // Fetch client message when row is expanded
      if (rowData.identifier && accountSubdomain) {
        fetchClientMessage(rowData.identifier, rowData.return_year);
      }
    }
  };

  const toggleRowExpansion = (rowData: WorkqueueItem) => {
    if (expandedRows && expandedRows[rowData.id]) {
      const newExpandedRows = { ...expandedRows };
      delete newExpandedRows[rowData.id];
      setExpandedRows(newExpandedRows);
    } else {
      setExpandedRows({ ...expandedRows, [rowData.id]: true });
      if (rowData.identifier && accountSubdomain) {
        fetchClientMessage(rowData.identifier, rowData.return_year);
      } else if (rowData.identifier && !accountSubdomain) {
        // Try to fetch subdomain again if not available
        fetchAccountSubdomain().then(() => {
          if (accountSubdomain && rowData.identifier) {
            fetchClientMessage(rowData.identifier, rowData.return_year);
          }
        });
      }
    }
  };

  const startEdit = (rowData: WorkqueueItem, field: string) => {
    setEditingField({ ...editingField, [rowData.id]: field });
    setEditingValues({
      ...editingValues,
      [rowData.id]: {
        ...editingValues[rowData.id],
        [field]: field === 'received_at' ? formatDateForInput(rowData.received_at) : rowData[field]
      }
    });
  };

  const cancelEdit = (rowId: string) => {
    setEditingField({ ...editingField, [rowId]: null });
  };

  const saveField = async (rowData: WorkqueueItem, field: string) => {
    try {
      const newValue = editingValues[rowData.id]?.[field];
      let updateData: any = { 
        [field]: newValue,
        last_updated_at: getCurrentUTC(),
        last_updated_by: userId
      };

      // Handle date conversion - convert to UTC for storage
      if (field === 'received_at') {
        updateData[field] = convertInputDateToUTC(newValue);
      }

      // Update in Supabase
      const { error } = await supabase
        .from("workqueue")
        .update(updateData)
        .eq("id", rowData.id);

      if (error) {
        throw error;
      }

      // Update local state
      const updatedItems = items.map(item => 
        item.id === rowData.id ? { ...item, ...updateData } : item
      );

      // If status was updated, recalculate positions for all items
      if (field === 'status_id') {
        let newPosition = 0;
        let newExternalQueuePosition = 0;
        const _reorderedItems = updatedItems.map((item) => {
          if (item.status_id === completedStatusId) {
            return { ...item, position: null, external_queue_position: null };
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

        setItems(_reorderedItems);

        // Reload client message when status changes
        if (rowData.identifier && accountSubdomain) {
          fetchClientMessage(rowData.identifier, rowData.return_year);
        }
      } else {
        setItems(updatedItems);
      }

      // Clear editing state
      setEditingField({ ...editingField, [rowData.id]: null });

    } catch (error: any) {
      console.error(`Error updating ${field}:`, error);
      
      // Check for unique constraint violation (PostgreSQL error code 23505)
      let errorMessage = `Failed to update ${field}`;
      if ((error as any)?.code === '23505' || (error as any)?.message?.includes('23505')) {
        if (field === 'identifier' || field === 'return_year') {
          errorMessage = "That identifier is already in use for that return year.";
        }
      }
      
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
      });
    }
  };

  // Filter items based on year and completed status
  const filteredItems = items.filter(item => {
    // Year filter - if returnYear is null, show all years
    const yearMatches = returnYear === null || item.return_year === returnYear;
    
    // Completed status filter - if completedStatusId is null, show all items
    const completedMatches = showCompleted ? true : (completedStatusId === null || item.status_id !== completedStatusId);
    
    return yearMatches && completedMatches;
  });

  return (
    <div className="card h-full flex flex-col">
      <Toast ref={toast} position="bottom-left" />
      <WorkqueueToolbar
        showCompleted={showCompleted}
        handleShowCompleted={handleShowCompleted}
        openNew={openNew}
        globalFilterValue={globalFilterValue}
        onGlobalFilterChange={onGlobalFilterChange}
        returnYear={returnYear}
        onReturnYearChange={setReturnYear}
        items={items}
      />
      {loading ? (
        <div className="skeleton-table flex-1">
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
        <div className="flex-1">
          <DataTable
            value={filteredItems}
            tableStyle={{ minWidth: "50rem" }}
            stripedRows
            reorderableRows
            scrollable
            scrollHeight="calc(100vh - 250px)"
            virtualScrollerOptions={{ 
              itemSize: 70,
              delay: 0,
              lazy: false 
            }}
            onRowReorder={(e) => handleRowReorder(e.value)}
            dataKey="id"
            filters={filters}
            globalFilterFields={["identifier", "notes"]}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            onRowDoubleClick={onRowDoubleClick}
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
        </div>
      )}

      <Dialog
        visible={itemDialog}
        style={{ width: "60rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Add New Return"
        modal
        className="p-fluid"
        footer={itemDialogFooter}
        onHide={hideItemDialog}
      >
        <div className="p-3 bg-gray-900">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Side - Basic Information */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gray-800 rounded p-4 shadow-sm border border-gray-700">
                <div className="flex items-center mb-3">
                  <i className="pi pi-file-plus text-blue-400 mr-2"></i>
                  <h3 className="text-sm font-semibold text-gray-200">Basic Information</h3>
                </div>
                
                {/* First Row: Identifier, Return Year, Received Date */}
                <div className="grid grid-cols-3 gap-2 min-w-0 mb-4">
                  <div className="min-w-0">
                    <label htmlFor="identifier" className="text-xs font-medium text-gray-400 block mb-1">
                      Identifier *
                    </label>
                    <InputText
                      id="identifier"
                      value={item.identifier}
                      onChange={(e) => onInputChange(e, "identifier")}
                      required
                      autoFocus
                      className={classNames("text-sm", { "p-invalid": submitted && !item.identifier })}
                    />
                    {submitted && !item.identifier && (
                      <small className="text-red-400 text-xs">Identifier is required</small>
                    )}
                    {submitted && !isIdentifierAvailable && (
                      <small className="text-red-400 text-xs">Identifier is already taken</small>
                    )}
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="return_year" className="text-xs font-medium text-gray-400 block mb-1">
                      Return Year
                    </label>
                    <InputText
                      id="return_year"
                      type="number"
                      value={item.return_year?.toString() || ""}
                      onChange={(e) => onInputChange(e, "return_year")}
                      className="text-sm"
                    />
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="received_at" className="text-xs font-medium text-gray-400 block mb-1">
                      Received Date
                    </label>
                    <InputText
                      id="received_at"
                      type="date"
                      value={item.received_at ? formatDateForInput(item.received_at) : ''}
                      onChange={(e) => onInputChange(e, "received_at")}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Second Row: Status, Extension, Placeholder */}
                <div className="grid grid-cols-3 gap-2 min-w-0">
                  <div className="min-w-0">
                    <label htmlFor="status_id" className="text-xs font-medium text-gray-400 block mb-1">
                      Status
                    </label>
                    <Dropdown
                      id="status_id"
                      value={item.status_id}
                      options={statusDropdownOptions}
                      onChange={(e) => onDropdownChange(e, "status_id")}
                      itemTemplate={(option: { id: number; name: string }) => (
                        <Tag value={option.name} severity={statusColors[option.id]} />
                      )}
                      optionLabel="name"
                      optionValue="id"
                      className="text-sm"
                    />
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="extension_date_id" className="text-xs font-medium text-gray-400 block mb-1">
                      Extension Date
                    </label>
                    <Dropdown
                      id="extension_date_id"
                      value={item.extension_date_id ?? ""}
                      options={extensionDropdownOptions}
                      onChange={(e) => onDropdownChange(e, "extension_date_id")}
                      placeholder="No extension date set"
                      showClear
                      disabled={item.status_id !== extendedStatusId}
                      itemTemplate={(option: { id: number; name: string }) => (
                        <Tag value={option.name} severity={option.id ? "danger" : null} />
                      )}
                      optionLabel="name"
                      optionValue="id"
                      className={classNames("text-sm", { "p-invalid": submitted && item.status_id === extendedStatusId && !item.extension_date_id })}
                    />
                    {submitted && item.status_id === extendedStatusId && !item.extension_date_id && (
                      <small className="text-red-400 text-xs">Extension date is required for Extended status</small>
                    )}
                  </div>

                  {/* Placeholder */}
                  <div></div>
                </div>
              </div>
            </div>

            {/* Right Side - Notes */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded p-4 shadow-sm border border-gray-700 h-full">
                <div className="flex items-center mb-3">
                  <i className="pi pi-file-edit text-yellow-400 mr-2"></i>
                  <label className="text-sm font-semibold text-gray-200">Internal Notes</label>
                </div>
                
                <div className="editor-container">
                  <Editor
                    value={item.notes}
                    onTextChange={(e) => onRichTextChange(e.htmlValue || '', 'notes')}
                    style={{ height: '200px' }}
                    className="flex-1"
                    placeholder="Enter any additional notes..."
                    headerTemplate={
                      <span className="ql-formats">
                        <button className="ql-bold" aria-label="Bold"></button>
                        <button className="ql-italic" aria-label="Italic"></button>
                        <button className="ql-underline" aria-label="Underline"></button>
                        <button className="ql-strike" aria-label="Strike"></button>
                        <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
                        <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
                        <button className="ql-indent" value="-1" aria-label="Outdent"></button>
                        <button className="ql-indent" value="+1" aria-label="Indent"></button>
                        <select className="ql-color" aria-label="Text Color"></select>
                        <select className="ql-background" aria-label="Background Color"></select>
                        <select className="ql-align" aria-label="Text Align"></select>
                        <button className="ql-link" aria-label="Link"></button>
                        <button className="ql-clean" aria-label="Remove Formatting"></button>
                      </span>
                    }
                  />
                  <style jsx>{`
                    .editor-container :global(.ql-toolbar) {
                      background-color: #374151 !important;
                      border-color: #4B5563 !important;
                    }
                    .editor-container :global(.ql-toolbar .ql-stroke) {
                      stroke: #E5E7EB !important;
                    }
                    .editor-container :global(.ql-toolbar .ql-fill) {
                      fill: #E5E7EB !important;
                    }
                    .editor-container :global(.ql-toolbar button:hover) {
                      background-color: #4B5563 !important;
                    }
                    .editor-container :global(.ql-toolbar button.ql-active) {
                      background-color: #6B7280 !important;
                    }
                    .editor-container :global(.ql-toolbar .ql-picker-label) {
                      color: #E5E7EB !important;
                    }
                    .editor-container :global(.ql-toolbar .ql-picker-options) {
                      background-color: #374151 !important;
                      border-color: #4B5563 !important;
                    }
                    .editor-container :global(.ql-toolbar .ql-picker-item) {
                      color: #E5E7EB !important;
                    }
                    .editor-container :global(.ql-toolbar .ql-picker-item:hover) {
                      background-color: #4B5563 !important;
                    }
                    .editor-container :global(.ql-container) {
                      background-color: #1F2937 !important;
                      color: #FFFFFF;
                      border-color: #4B5563 !important;
                    }
                    .editor-container :global(.ql-editor) {
                      color: #FFFFFF;
                    }
                    .editor-container :global(.ql-editor p) {
                      color: #FFFFFF; 
                    }
                    .editor-container :global(.ql-editor.ql-blank::before) {
                      color: #FFFFFF;
                      opacity: 0.6;
                    }
                  `}</style>
                </div>
              </div>
            </div>
          </div>
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
