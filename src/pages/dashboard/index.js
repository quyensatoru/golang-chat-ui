import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

export default function Dashboard() {
	return (
		<div className="flex-1 space-y-6 p-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Dashboard</h1>
				<div>
					<Button>Export</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				<Card>
					<CardHeader>
						<CardTitle>Total Revenue</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$45,231</div>
						<div className="text-sm text-muted-foreground">+12% this month</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Active Users</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">1,243</div>
						<div className="text-sm text-muted-foreground">+3% vs last week</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>New Signups</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">542</div>
						<div className="text-sm text-muted-foreground">+8% this month</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Conversion</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">4.2%</div>
						<div className="text-sm text-muted-foreground">Stable</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Overview</CardTitle>
					</CardHeader>
					<CardContent>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Recent Sales</CardTitle>
					</CardHeader>
					<CardContent>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
