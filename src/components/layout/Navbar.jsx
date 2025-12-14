import React from 'react'
import { Menu, Sun, Moon, LogOut } from 'lucide-react'
import { Bell } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import useFirebase from '../../hook/firebase'
import { useNavigate } from 'react-router-dom'

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

export default function Navbar({ onMenuClick, title = 'K8s Manager' }) {
    const [theme, setTheme, user] = useTheme()
    const { auth } = useFirebase()
    const navigate = useNavigate()
    const [showUserMenu, setShowUserMenu] = React.useState(false)

    const handleLogout = async () => {
        await auth.signOut()
        navigate('/')
    }

    const getInitials = (name) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <header className="sticky top-0 z-40 w-full bg-background/60 backdrop-blur-sm border-b h-[60px]">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-3">
                    <button onClick={onMenuClick} className="-ml-1 rounded-md p-2 hover:bg-accent md:hidden">
                        <Menu className="h-5 w-5" />
                    </button>
                    <h1 className="text-lg font-semibold hidden md:block">{title}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">3</span>
                    </Button>

                    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>

                    <div className="relative">
                        <Button
                            variant="ghost"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="gap-2"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.photoURL} />
                                <AvatarFallback>{getInitials(user?.displayName || user?.email)}</AvatarFallback>
                            </Avatar>
                            <span className="hidden sm:inline">{user?.displayName || user?.email?.split('@')[0]}</span>
                        </Button>

                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-card border rounded-md shadow-lg z-50 py-1">
                                    <div className="px-4 py-3 border-b">
                                        <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
