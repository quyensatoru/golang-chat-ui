import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import useFirebase from "../../hook/firebase"

export default function SettingsPage() {
    const { auth } = useFirebase();
    const handleLogout = () => {
        auth.signOut()
    }
	return (
		<div className="flex-1 p-6">
			<h1 className="mb-4 text-2xl font-semibold">Settings</h1>
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Profile</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-2">
							<Label>Full name</Label>
							<Input placeholder="John Doe" />
							<Label>Email</Label>
							<Input placeholder="john@example.com" />
							<div className="pt-2">
								<Button>Save</Button>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Preferences</CardTitle>
					</CardHeader>
					<CardContent>
                        <Button variant="outline" onClick={handleLogout}>Logout</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
