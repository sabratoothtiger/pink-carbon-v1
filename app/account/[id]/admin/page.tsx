import { Button } from "primereact/button";
import Link from "next/link";

interface AdminPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { id: accountId } = await params;

  return (
    <div>
      {/* Admin Content Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Management */}
        <div className="bg-surface-a border border-solid border-surface-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <i className="pi pi-users text-pink-500 text-2xl" />
            <h3 className="text-lg font-semibold text-white/[.87]">Users</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            Manage user access and permissions for this organization.
          </p>
          <Button
            label="Manage Users"
            icon="pi pi-arrow-right"
            iconPos="right"
            className="p-button-sm w-full"
            disabled
          />
        </div>

        {/* Settings */}
        <div className="bg-surface-a border border-solid border-surface-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <i className="pi pi-cog text-pink-500 text-2xl" />
            <h3 className="text-lg font-semibold text-white/[.87]">Settings</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            Configure organization settings and preferences.
          </p>
          <Button
            label="View Settings"
            icon="pi pi-arrow-right"
            iconPos="right"
            className="p-button-sm w-full"
            disabled
          />
        </div>

        {/* Exports */}
        <div className="bg-surface-a border border-solid border-surface-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <i className="pi pi-download text-pink-500 text-2xl" />
            <h3 className="text-lg font-semibold text-white/[.87]">Exports</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            Export workqueue data to CSV or Excel.
          </p>
          <Link href={`/account/${accountId}/admin/exports`}>
            <Button
              label="Go to Exports"
              icon="pi pi-arrow-right"
              iconPos="right"
              className="p-button-sm w-full"
            />
          </Link>
        </div>

        {/* Billing */}
        <div className="bg-surface-a border border-solid border-surface-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <i className="pi pi-credit-card text-pink-500 text-2xl" />
            <h3 className="text-lg font-semibold text-white/[.87]">Billing</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            Manage billing and subscription information.
          </p>
          <Button
            label="View Billing"
            icon="pi pi-arrow-right"
            iconPos="right"
            className="p-button-sm w-full"
            disabled
          />
        </div>

        {/* API Keys */}
        <div className="bg-surface-a border border-solid border-surface-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <i className="pi pi-key text-pink-500 text-2xl" />
            <h3 className="text-lg font-semibold text-white/[.87]">API Keys</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            Manage API keys and integrations.
          </p>
          <Button
            label="Manage Keys"
            icon="pi pi-arrow-right"
            iconPos="right"
            className="p-button-sm w-full"
            disabled
          />
        </div>

        {/* Audit Log */}
        <div className="bg-surface-a border border-solid border-surface-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <i className="pi pi-list text-pink-500 text-2xl" />
            <h3 className="text-lg font-semibold text-white/[.87]">Audit Log</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            View activity and change history.
          </p>
          <Button
            label="View Log"
            icon="pi pi-arrow-right"
            iconPos="right"
            className="p-button-sm w-full"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
