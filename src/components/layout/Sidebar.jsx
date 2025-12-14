import React from 'react'
import { Users, MessageSquare, Settings, Code, Server, Package, LayoutDashboard } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, path: '/dashboard', description: 'Overview and analytics' },
  { key: 'servers', label: 'Servers', icon: <Server className="h-4 w-4" />, path: '/servers', description: 'Manage infrastructure' },
  { key: 'apps', label: 'Applications', icon: <Package className="h-4 w-4" />, path: '/apps', description: 'Deploy and manage apps' },
  { key: 'editor', label: 'Editor', icon: <Code className="h-4 w-4" />, path: '/editor', description: 'Code editor' },
  { key: 'chat', label: 'Chat', icon: <MessageSquare className="h-4 w-4" />, path: '/chat', description: 'Messages' },
]

const footerItems = [
  { key: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" />, path: '/settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside className="flex h-full w-full flex-col justify-between bg-background px-2 py-4">
      <div>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Server className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold">K8s Manager</h2>
        </div>
        <nav className="mt-4 space-y-1 px-1">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path)
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center">{item.icon}</span>
                <div className="flex-1 text-left">
                  <div>{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="px-2">
        {footerItems.map(item => (
          <button key={item.key} onClick={() => navigate(item.path)} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <span className="inline-flex h-5 w-5 items-center justify-center">{item.icon}</span>
            <div>{item.label}</div>
          </button>
        ))}
      </div>
    </aside>
  )
}
