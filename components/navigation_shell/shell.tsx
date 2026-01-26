"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Sidebar } from 'primereact/sidebar'
import { PanelMenu } from 'primereact/panelmenu'
import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Menu } from 'primereact/menu'
import { createClient } from "@/lib/supabase/client"
import Search from './search'
import type { SupabaseUser } from "@/lib/supabase/types"

interface ShellProps {
  children: React.ReactNode
  user?: SupabaseUser
  hasMultipleAccounts?: boolean
  currentAccount?: { id: string; display_name: string } | null
  userAccountIds?: number[]
}

export default function Shell({ children, user, hasMultipleAccounts = false, currentAccount = null, userAccountIds = [] }: ShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const menuRef = useRef<Menu>(null)
  const supabase = createClient()

  // Extract account ID from current pathname
  const getCurrentAccountId = () => {
    const match = pathname.match(/\/account\/([^/]+)/)
    return match ? match[1] : null
  }

  const accountId = getCurrentAccountId()
  const isInAccountContext = accountId !== null

  // Dynamic menu items based on account context
  const getMenuItems = () => {
    if (!isInAccountContext) {
      return [
        {
          label: 'Admin',
          icon: 'pi pi-cog',
          command: () => router.push('/admin')
        }
      ]
    }

    return [
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-bar',
        command: () => router.push(`/account/${accountId}/dashboard`)
      },
      {
        label: 'Workqueue',
        icon: 'pi pi-list',
        command: () => router.push(`/account//${accountId}/workqueue`)
      },
      {
        label: 'Admin',
        icon: 'pi pi-cog',
        command: () => router.push(`/account/${accountId}/admin`)
      }
    ]
  }

  const menuItems = getMenuItems()

  const getUserMenuItems = () => {
    /* TODO: Add Profile and Settings when those pages are ready */
    const baseItems: any[] = []
    /* const baseItems: any[] = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => router.push('/profile')
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        command: () => router.push('/settings')
      }
    ] */

    // Add separator and Switch Organization if user has multiple accounts
    if (hasMultipleAccounts) {
      baseItems.push(
        {
          separator: true
        },
        {
          label: 'Switch Organization',
          icon: 'pi pi-building',
          command: () => router.push('/account')
        }
      )
    }

    // Add logout
    baseItems.push(
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          // Handle logout
          router.push('/sign-in')
        }
      }
    )

    return baseItems
  }

  const userMenuItems = getUserMenuItems()

  const handleUserMenuToggle = (event: React.MouseEvent) => {
    menuRef.current?.toggle(event)
  }

  const start = (
    <div className="flex items-center">
      <Button
        icon="pi pi-bars"
        className="md:hidden p-button-text"
        onClick={() => setSidebarVisible(true)}
        aria-label="Menu"
      />
      <div className="ml-3">
        <span className="text-pink-500 text-2xl font-bold">PINK</span>
        <span className="text-primary text-2xl font-bold ml-1">CARBON</span>
        </div>
      {currentAccount && (
        <div className="flex items-center ml-4">
          <span className="text-text-secondary text-lg">|</span>
          <span className="text-primary text-lg font-medium ml-2">
            {currentAccount.display_name}
          </span>
        </div>
      )}
    </div>
  )

  const end = (
    <div className="flex items-center gap-3">
      {/* Search */}
      {/* TODO: Re-enable search when ready  */}
      {/* <Search accountId={accountId} /> */}

      {/* User Menu */}
      <div className="flex items-center">
        <Button
          onClick={handleUserMenuToggle}
          className="p-button-text flex items-center gap-2"
          aria-label="User menu"
        >
          <Avatar
            icon="pi pi-user"
            size="normal"
            shape="circle"
            className="pink-avatar"
          />
          <span className="hidden md:inline text-white">
            {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}
          </span>
        </Button>
        <Menu
          model={userMenuItems}
          popup
          ref={menuRef}
          className="mt-2"
        />
      </div>
    </div>
  )

  return (
    <div className="h-screen bg-surface-a flex flex-col">
      {/* Top Navigation */}
      <Menubar
        start={start}
        end={end}
        className="border-none bg-surface-a border-b border-surface-border p-3"
      />

      {/* Mobile Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="w-64 md:hidden"
      >
        <div className="p-4">
          <div className="mb-4">
            <span className="text-pink-500 text-2xl font-bold">PINK</span>
            <span className="text-primary text-2xl font-bold ml-1">CARBON</span>
          </div>
          <PanelMenu
            model={menuItems}
            className="w-full border-none"
          />
        </div>
      </Sidebar>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-16 bg-surface-a border-r border-surface-border">
          <div className="p-4 h-full flex flex-col">
            {/* Top menu items */}
            <div className="flex flex-col gap-2">
              {menuItems.filter(item => item.label !== 'Admin').map((item, index) => (
                <Button
                  key={index}
                  icon={item.icon}
                  className="p-button-text w-full justify-center"
                  onClick={item.command}
                  tooltip={item.label}
                  tooltipOptions={{ position: 'right' }}
                  aria-label={item.label}
                />
              ))}
            </div>
            
            {/* Bottom menu items */}
            <div className="flex flex-col gap-2 mt-auto">
              <div className="border-t border-surface-border mx-2 mb-2"></div>
              {menuItems.filter(item => item.label === 'Admin').map((item, index) => (
                <Button
                  key={index}
                  icon={item.icon}
                  className="p-button-text w-full justify-center"
                  onClick={item.command}
                  tooltip={item.label}
                  tooltipOptions={{ position: 'right' }}
                  aria-label={item.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}