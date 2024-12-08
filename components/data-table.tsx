
"use client";

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { StatusItem, WorkqueueItem } from '@/types/supabase';
import { getCompletedStatusId } from '@/utils/helpers';
import { Tag } from 'primereact/tag';
import { getStatusData, getWorkqueueData } from '@/utils/supabase/fetch-data';
import { InputSwitch } from 'primereact/inputswitch';
import AddNewItemSidebar from './add-new-workqueue-item';
import { Button } from 'primereact/button';

export default function Workqueue() {
    const [items, setItems] = useState<WorkqueueItem[]>([]);
    const [statuses, setStatuses] = useState<StatusItem[]>([]);

    const [showCompleted, setShowCompleted] = useState(false);
    const [showAddItemSidebar, setShowAddItemSidebar] = useState(false);

    const getSeverity = (statusId: number) => {
        switch (statusId) {
            case 3:  // Awaiting info
                return 'warning';
            case 5:  // Completed
                return 'success'
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

    const columns: { field: keyof WorkqueueItem; header: string; body?: (rowData: WorkqueueItem) => JSX.Element | string;}[] = [
        { field: 'position', header: 'Position' },
        { field: 'identifier', header: 'Identifier' },
        { field: 'status_id', header: 'Status', body: statusBodyTemplate},
        { field: 'received_at', header: 'Received' },
        { field: 'last_updated_at', header: 'Last Updated' },
        { field: 'extension_date_id', header: 'Extension Date' }
    ];

    const completedStatusId = getCompletedStatusId();

    useEffect(() => {
        async function fetchData() {
            const workqueueData = await getWorkqueueData();
            if (workqueueData) setItems(workqueueData);
            const statusData = await getStatusData();
            if (statusData) setStatuses(statusData)
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
        var newPosition = 0
        // Update the position field for each item
        const updatedItems = reorderedItems.map((item, index) => {
            // Skip the position calculation for "Completed" returns
            if (item.status_id === completedStatusId) {
                return {
                    ...item,
                    position: null, 
                };
            }
            newPosition++
            return {
                ...item,
                position: (newPosition), // Update position based on the new row order (1-based index)
            };
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
        setShowAddItemSidebar(false);  // Close the sidebar after adding the item
    };

    // Filter items to exclude completed items (status_id === 5) unless the toggle is enabled
    const filteredItems = items.filter(item => (showCompleted || item.status_id !== 5));

    return (
        <div className="card">
            <div className="flex justify-start mb-2">
                <Button className='p-button' label="Add New Item" icon="pi pi-plus" onClick={() => setShowAddItemSidebar(true)} />
            </div>
            {/* InputSwitch to show/hide completed items */}
            <div className="flex justify-end mb-2">
                <span className="mr-2">Show Completed</span>
                <InputSwitch
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.value)}
                />
            </div>
            <DataTable
                    value={filteredItems}
                reorderableColumns
                reorderableRows
                onRowReorder={handleRowReorder}
                tableStyle={{ minWidth: '50rem' }}
                stripedRows
            >
                <Column rowReorder style={{ width: '3rem' }} />
                {dynamicColumns}
            </DataTable>

            {/* Sidebar component */}
            <AddNewItemSidebar
                visible={showAddItemSidebar}
                onHide={() => setShowAddItemSidebar(false)}
                onAddItem={handleAddItem}
            />
        </div>
    );
}
