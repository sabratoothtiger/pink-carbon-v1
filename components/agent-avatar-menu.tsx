'use client'
import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { Avatar } from 'primereact/avatar';
import { SupabaseUser } from '@/types/supabase';
import { signOutAction } from '@/app/actions';

interface AgentToolbarProps {
    user: SupabaseUser;
  }

export default function AvatarMenu({ user }: AgentToolbarProps) {
    const menuRight = useRef<Menu>(null);
    
    const { user_metadata, email } = user;
    const greetingName = user_metadata?.first_name ? user_metadata.first_name : email;
    const initial = user_metadata?.first_name ? user_metadata.first_name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();

    const items: MenuItem[] = [
        {
            label: greetingName,
            items: [
                {
                    label: 'Settings',
                    icon: 'pi pi-cog'
                },
                {
                    label: 'Sign out',
                    icon: 'pi pi-sign-out',
                    command: () => signOutAction()
                }
            ]
        }
    ];

    return (
        <div className="card flex justify-content-center">
            <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
            <Button 
                icon={<Avatar label={initial} size='normal' shape="circle" 
    className="pink-avatar"/>} 
                className="p-button-rounded " 
                onClick={(event) => menuRight.current?.toggle(event)}
                aria-controls="popup_menu_right" 
                aria-haspopup
            />
        </div>
    )
}