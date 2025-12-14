import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import useFirebase from "../../hook/firebase"
import { User, Settings as SettingsIcon, Shield, LogOut, Bell, Moon } from "lucide-react"

export default function SettingsPage() {
	const { auth } = useFirebase();

	const handleLogout = async () => {
		if (auth) {
			await auth.signOut()
		}
	}

	const user = auth?.currentUser;

	return (
		<div className="container mx-auto p-4 md:p-6 space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
			</div>

			<div className="grid gap-6 md:grid-cols-[220px_1fr]">
				<nav className="flex flex-col space-y-1">
					<Button variant="secondary" className="justify-start">
						<User className="mr-2 h-4 w-4" />
						Profile
					</Button>
					<Button variant="ghost" className="justify-start">
						<SettingsIcon className="mr-2 h-4 w-4" />
						Account
					</Button>
					<Button variant="ghost" className="justify-start">
						<Shield className="mr-2 h-4 w-4" />
						Security
					</Button>
					<Button variant="ghost" className="justify-start">
						<Bell className="mr-2 h-4 w-4" />
						Notifications
					</Button>
				</nav>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Profile Information</CardTitle>
							<CardDescription>Update your personal information.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-2">
								<Label htmlFor="name">Display Name</Label>
								<Input id="name" placeholder="John Doe" defaultValue={user?.displayName || ''} />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" placeholder="john@example.com" defaultValue={user?.email || ''} disabled />
							</div>
							<div className="flex justify-end">
								<Button>Save Changes</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Appearance</CardTitle>
							<CardDescription>Customize the look and feel of the application.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<Label className="text-base">Dark Mode</Label>
									<p className="text-sm text-muted-foreground">
										Toggle dark mode for better viewing at night.
									</p>
								</div>
								<Button variant="outline" size="icon">
									<Moon className="h-4 w-4" />
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card className="border-red-200">
						<CardHeader>
							<CardTitle className="text-red-600">Danger Zone</CardTitle>
							<CardDescription>Irreversible actions for your account.</CardDescription>
						</CardHeader>
						<CardContent>
							<Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
								<LogOut className="mr-2 h-4 w-4" />
								Sign out
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
