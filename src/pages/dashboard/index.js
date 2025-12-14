import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Activity, Users, CreditCard, DollarSign, ArrowUpRight, Server, AppWindow } from "lucide-react"

export default function Dashboard() {
	return (
		<div className="container mx-auto p-4 md:p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground mt-1">Overview of your infrastructure and applications.</p>
				</div>
				<div>
					<Button>Download Report</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Servers</CardTitle>
						<Server className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">3</div>
						<p className="text-xs text-muted-foreground">+1 from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Apps</CardTitle>
						<AppWindow className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">12</div>
						<p className="text-xs text-muted-foreground">+2 deployed today</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">24%</div>
						<p className="text-xs text-muted-foreground">-4% from last hour</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">64%</div>
						<p className="text-xs text-muted-foreground">+12% from last hour</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Overview</CardTitle>
					</CardHeader>
					<CardContent className="pl-2">
						<div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
							Chart Placeholder (Recharts/Chart.js)
						</div>
					</CardContent>
				</Card>
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-8">
							<div className="flex items-center">
								<div className="ml-4 space-y-1">
									<p className="text-sm font-medium leading-none">Server "prod-01" Connected</p>
									<p className="text-sm text-muted-foreground">2 minutes ago</p>
								</div>
								<div className="ml-auto font-medium text-green-600">Success</div>
							</div>
							<div className="flex items-center">
								<div className="ml-4 space-y-1">
									<p className="text-sm font-medium leading-none">App "api-gateway" Deployed</p>
									<p className="text-sm text-muted-foreground">1 hour ago</p>
								</div>
								<div className="ml-auto font-medium text-blue-600">Deployed</div>
							</div>
							<div className="flex items-center">
								<div className="ml-4 space-y-1">
									<p className="text-sm font-medium leading-none">K8s Installation Started</p>
									<p className="text-sm text-muted-foreground">3 hours ago</p>
								</div>
								<div className="ml-auto font-medium text-yellow-600">Pending</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
