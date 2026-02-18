import { createContext, useContext, useMemo, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { SideNav } from '@/layouts/executive/SideNav'
import { TopBar } from '@/layouts/executive/TopBar'
import { clearActiveRole } from '@/shared/lib/role'

type TopBarState = {
  title: string
  subtitle?: string
}

type ExecutiveLayoutContextValue = {
  topBar: TopBarState
  setTopBar: (next: TopBarState) => void
}

const ExecutiveLayoutContext = createContext<ExecutiveLayoutContextValue | null>(null)

export function useExecutiveTopBar() {
  const ctx = useContext(ExecutiveLayoutContext)
  if (!ctx) throw new Error('useExecutiveTopBar must be used within ExecutiveLayout')
  return ctx
}

export function ExecutiveLayout() {
  const navigate = useNavigate()
  const [topBar, setTopBar] = useState<TopBarState>({
    title: 'Portfolio Dashboard',
    subtitle: 'Executive portfolio view',
  })

  const value = useMemo(() => ({ topBar, setTopBar }), [topBar])

  return (
    <ExecutiveLayoutContext.Provider value={value}>
      <div className="h-full bg-zinc-50">
        <div className="flex h-full">
          <aside className="hidden w-[280px] shrink-0 border-r border-zinc-200 bg-white lg:block">
            <SideNav />
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
              <TopBar
                title={topBar.title}
                subtitle={topBar.subtitle}
                onLogout={() => {
                  clearActiveRole()
                  navigate('/login', { replace: true })
                }}
              />
            </header>

            <main className="flex-1 overflow-auto px-4 py-5 sm:px-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </ExecutiveLayoutContext.Provider>
  )
}
