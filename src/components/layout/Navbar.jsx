import React from 'react'
import { Menu, Sun, Moon } from 'lucide-react'
import { Bell } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import useFirebase from '../../hook/firebase'

function useTheme() {
    const { auth } = useFirebase();
    const [theme, setTheme] = React.useState(() => {
        if (typeof window === 'undefined') return 'light'
        return localStorage.getItem('theme') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    })
    const user = auth.currentUser;

    React.useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [theme])

    return [theme, setTheme, user]
}

export default function Navbar({ onMenuClick, title = 'Golang Tutorial' }) {
    const [theme, setTheme, user] = useTheme()

    return (
        <header className="sticky top-0 z-40 w-full bg-background/60 backdrop-blur-sm border-b h-[60px]">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-3">
                    <button onClick={onMenuClick} className="-ml-1 rounded-md p-2 hover:bg-accent">
                        <Menu className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">3</span>
                    </Button>

                    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>

                    <Button variant="ghost" onClick={() => { }} className="gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL} />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline">John Doe</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
