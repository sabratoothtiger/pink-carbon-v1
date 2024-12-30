import React from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { ToggleButton } from "primereact/togglebutton";

interface WorkqueueToolbarProps {
  showCompleted: boolean;
  setShowCompleted: (value: boolean) => void;
  setShowAddItemSidebar: (value: boolean) => void;
}

export default function WorkqueueToolbar({
  showCompleted,
  setShowCompleted,
  setShowAddItemSidebar,
}: WorkqueueToolbarProps) {
  const startContent = (
    <div className="mr-5 flex items-center gap-3">
      <Button icon="pi pi-plus" onClick={() => setShowAddItemSidebar(true)} />
      <ToggleButton
        onLabel="Hide Completed"
        offLabel="Show all"
        checked={showCompleted}
        onChange={(e) => setShowCompleted(e.value)}
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
      <InputText placeholder="Search (no worky)" />
    </IconField>
    </React.Fragment>
  );

  return (
    <div className="card">
      <Toolbar start={startContent} center={centerContent} end={endContent} className="border-none" />
    </div>
  );
}
