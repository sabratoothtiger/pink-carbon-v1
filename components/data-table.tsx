"use client";

import React, { useState, useEffect } from 'react';
import { DataTable, DataTableDataSelectableEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { StatusItem, WorkqueueItem } from '@/types/supabase';
import { getCompletedStatusId } from '@/utils/helpers';
import { Tag } from 'primereact/tag';
import { getStatusData, getWorkqueueData } from '@/utils/supabase/fetch-data';
import { InputSwitch } from 'primereact/inputswitch';
import AddNewItemSidebar from './add-new-workqueue-item';
import { Button } from 'primereact/button';
import { ToggleButton } from 'primereact/togglebutton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { format } from 'date-fns';
import { createClient } from '@/utils/supabase/client';


export default function Workqueue() {
  const [items, setItems] = useState<WorkqueueItem[]>([]);
  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isCellSelectable = (event: DataTableDataSelectableEvent) =>
    event.data.field === 'identifier' || event.data.field === 'last_updated_at' ? false : true;

  const [showCompleted, setShowCompleted] = useState(false);
  const [showAddItemSidebar, setShowAddItemSidebar] = useState(false);

    // Initialize the Supabase client on the client side
    const supabase = createClient();

  const getSeverity = (statusId: number) => {
    switch (statusId) {
      case 3:  // Awaiting info
        return 'warning';
      case 5:  // Completed
        return 'success';
      case 6:  // Extended
        return 'warning';
      default:
        return 'info';
    }
  };

  function getStatusNameInternalById(statusId: number): string | null {
    const status = statuses.find((status) => status.id === statusId);

    if (status) {
      return status.name_internal;
    }

    return "Unknown Status";
  }

  const statusBodyTemplate = (rowData: WorkqueueItem) => {
    return <Tag value={getStatusNameInternalById(rowData.status_id)} severity={getSeverity(rowData.status_id)} />;
  };

  const receivedDateBodyTemplate = (rowData: WorkqueueItem) => {
    return rowData.received_at ? format(new Date(rowData.received_at), 'MM/dd/yyyy') : '';
  };

  const updatedDateBodyTemplate = (rowData: WorkqueueItem) => {
    return rowData.last_updated_at ? format(new Date(rowData.last_updated_at), 'MM/dd/yyyy') : '';
  };

  const columns: { field: keyof WorkqueueItem; header: string; body?: (rowData: WorkqueueItem) => JSX.Element | string; }[] = [
    { field: 'position', header: 'Position' },
    { field: 'identifier', header: 'Identifier' },
    { field: 'status_id', header: 'Status', body: statusBodyTemplate },
    { field: 'received_at', header: 'Received on', body: receivedDateBodyTemplate },
    { field: 'last_updated_at', header: 'Last updated on', body: updatedDateBodyTemplate },
    { field: 'extension_date_id', header: 'Extension date' }
  ];

  const completedStatusId = getCompletedStatusId();

  // Fetch data once the component mounts
  useEffect(() => {
    async function fetchData() {
      const workqueueData = await getWorkqueueData();
      if (workqueueData) setItems(workqueueData);
      const statusData = await getStatusData();
      if (statusData) setStatuses(statusData);
      setLoading(false);
    }

    fetchData();
  }, []);

  const dynamicColumns = columns.map((col) => (
    <Column
      key={col.field}
      columnKey={col.field as string}
      field={col.field as string}
      header={col.header}
      body={col.body}
    />
  ));

  const handleRowReorder = (e: any) => {
    const reorderedItems = e.value as WorkqueueItem[];
    let newPosition = 0;
    const updatedItems = reorderedItems.map((item, index) => {
      if (item.status_id === completedStatusId) {
        return { ...item, position: null };
      }
      newPosition++;
      return { ...item, position: newPosition };
    });
    setItems(updatedItems);
  };

  const handleAddItem = (newItem: WorkqueueItem) => {
    setItems((prevItems) => [
      ...prevItems,
      {
        ...newItem,
        status_id: 1, // Default status_id "Received"
        received_at: newItem.received_at || new Date().toISOString(),
      },
    ]);
    setShowAddItemSidebar(false);
  };

  const filteredItems = items.filter(item => (showCompleted || item.status_id !== 5));

  return (
    <div className="card">
      {loading ? (
        <ProgressSpinner aria-label="Loading" className="flex justify-center" />
      ) : (
        <>
          <div className="flex justify-between mb-2">
            <Button label="Add New Item" icon="pi pi-plus" onClick={() => setShowAddItemSidebar(true)} />
            <ToggleButton onLabel="Hide Completed" offLabel="Show all" checked={showCompleted} onChange={(e) => setShowCompleted(e.value)} />
          </div>
          <DataTable
            value={filteredItems}
            reorderableColumns
            reorderableRows
            onRowReorder={handleRowReorder}
            tableStyle={{ minWidth: '50rem' }}
            stripedRows
            isDataSelectable={isCellSelectable}
          >
            <Column rowReorder style={{ width: '3rem' }} />
            {dynamicColumns}
          </DataTable>

          <AddNewItemSidebar
            visible={showAddItemSidebar}
            onHide={() => setShowAddItemSidebar(false)}
            onAddItem={handleAddItem}
          />
        </>
      )}
    </div>
  );
}
