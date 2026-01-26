import React, { MouseEventHandler } from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { ToggleButton } from "primereact/togglebutton";
import { Dropdown } from "primereact/dropdown";

interface WorkqueueToolbarProps {
  showCompleted: boolean;
  handleShowCompleted:() => void;
  openNew: MouseEventHandler;
  globalFilterValue: string;
  onGlobalFilterChange: any;
  returnYear: number | null;
  onReturnYearChange: (year: number | null) => void;
  items: any[];
}

export default function WorkqueueToolbar({
  showCompleted,
  handleShowCompleted,
  openNew,
  globalFilterValue,
  onGlobalFilterChange,
  returnYear,
  onReturnYearChange,
  items,
}: WorkqueueToolbarProps) {
  // Get unique years from the actual data
  const uniqueYears = [...new Set(items.map(item => item.return_year))].sort((a, b) => b - a);
  
  const yearOptions = [
    { label: "All Years", value: null },
    ...uniqueYears.map(year => ({ label: `${year}`, value: year }))
  ];

  const startContent = (
    <div className="flex items-center gap-3">
      <ToggleButton
        onLabel="Hide Completed"
        offLabel="Show Completed"
        checked={showCompleted}
        onChange={handleShowCompleted}
        className="text-sm"
      />
      <Dropdown
        value={returnYear}
        options={yearOptions}
        onChange={(e) => onReturnYearChange(e.value)}
        placeholder="Select Year"
        className="w-40"
        optionLabel="label"
        optionValue="value"
      />
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search..."
          className="w-64"
        />
      </IconField>
    </div>
  );

  const endContent = (
    <div className="flex items-center gap-2">
      <Button 
        label="Add New" 
        icon="pi pi-plus" 
        onClick={openNew}
        size="small"
      />
    </div>
  );

  return (
    <div className="card">
      <Toolbar start={startContent} end={endContent} className="border-none" />
    </div>
  );
}
