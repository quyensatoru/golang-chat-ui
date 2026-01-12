import * as React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppProvider() {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const openMobile = () => setMobileOpen(true)
  const closeMobile = () => setMobileOpen(false)

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-72 border-r border-border">
        <Sidebar />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={openMobile} />
        <main className="flex-1 h-[calc(100vh-56px)] bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-900/50">
          <div className="max-w-7xl mx-auto p-4 h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={closeMobile} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-border p-4 overflow-auto">
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  )
}