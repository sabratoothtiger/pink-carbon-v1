import React, { MouseEventHandler } from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { ToggleButton } from "primereact/togglebutton";

interface WorkqueueToolbarProps {
  showCompleted: boolean;
  handleShowCompleted:() => void;
  openNew: MouseEventHandler;
  globalFilterValue: string;
  onGlobalFilterChange: any;
}

export default function WorkqueueToolbar({
  showCompleted,
  handleShowCompleted,
  openNew,
  globalFilterValue,
  onGlobalFilterChange,
}: WorkqueueToolbarProps) {
  const startContent = (
    <div className="mr-5 flex items-center gap-3">
      <Button icon="pi pi-plus" onClick={openNew} />
      <ToggleButton
        onLabel="Hide Completed"
        offLabel="Show all"
        checked={showCompleted}
        onChange={handleShowCompleted}
      />
    </div>
  );

  const centerContent = (
    <></>
  );

  const endContent = (
    <React.Fragment>
      <IconField iconPosition="left">
      <InputIcon className="pi pi-search" />
      <InputText type="search" placeholder="Search" value={globalFilterValue} onChange={(e) => onGlobalFilterChange(e)}/>
    </IconField>
    </React.Fragment>
  );

  return (
    <div className="card">
      <Toolbar start={startContent} center={centerContent} end={endContent} className="border-none" />
    </div>
  );
}
