
import React from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Avatar } from 'primereact/avatar';
import { SupabaseUser } from '../types/supabase';
import AvatarMenu from './agent-avatar-menu';

interface AgentToolbarProps {
    user: SupabaseUser;
  }

export default function AgentToolbar({ user }: AgentToolbarProps) {
    const startContent = (
        <React.Fragment>
        <span className="brand-name" style={{ display: "flex", alignItems: "center" }}>
          <span className="pink-text" style={{ marginLeft: "4px" }}>PINK</span>
          <span className="carbon-text">CARBON</span>
        </span>
        </React.Fragment>
    );

    const centerContent = (
        <div className="flex flex-wrap align-items-center gap-3">
        </div>
    );

    const endContent = (
        <React.Fragment>
            <div className="flex justify-center items-center gap-2">
                <AvatarMenu user={user} />
            </div>
        </React.Fragment>
    );

    return (
        <div className="card">
            <Toolbar start={startContent} center={centerContent} end={endContent} style={{ borderRadius: '0rem', backgroundImage: 'linear-gradient(to right, var(--bluegray-500), var(--bluegray-800))' }} />
        </div>
    );
}
        