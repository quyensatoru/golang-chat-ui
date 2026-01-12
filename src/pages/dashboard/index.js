import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Activity, Users, CreditCard, DollarSign, ArrowUpRight, Server, AppWindow, TrendingUp, TrendingDown } from "lucide-react"

export default function Dashboard() {
	return (
		<div className="container mx-auto p-4 md:p-6 min-h-screen">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">Dashboard</h1>
					<p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Overview of your infrastructure and applications</p>
				</div>
				<Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
					Download Report
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
				<Card className="border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-800 dark:to-slate-800/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Servers</CardTitle>
						<div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
							<Server className="h-4 w-4 text-white" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">3</div>
						<div className="flex items-center gap-1 mt-2">
							<TrendingUp className="h-3 w-3 text-emerald-600" />
							<p className="text-xs text-emerald-600 font-medium">+1 from last month</p>
						</div>
					</CardContent>
				</Card>

				<Card className="border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-800 dark:to-slate-800/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Active Apps</CardTitle>
						<div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
							<AppWindow className="h-4 w-4 text-white" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">12</div>
						<div className="flex items-center gap-1 mt-2">
							<TrendingUp className="h-3 w-3 text-emerald-600" />
							<p className="text-xs text-emerald-600 font-medium">+2 deployed today</p>
						</div>
					</CardContent>
				</Card>

				<Card className="border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-800 dark:to-slate-800/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">CPU Usage</CardTitle>
						<div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md">
							<Activity className="h-4 w-4 text-white" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">24%</div>
						<div className="flex items-center gap-1 mt-2">
							<TrendingDown className="h-3 w-3 text-emerald-600" />
							<p className="text-xs text-emerald-600 font-medium">-4% from last hour</p>
						</div>
					</CardContent>
				</Card>

				<Card className="border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-800 dark:to-slate-800/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Memory Usage</CardTitle>
						<div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-md">
							<Activity className="h-4 w-4 text-white" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">64%</div>
						<div className="flex items-center gap-1 mt-2">
							<TrendingUp className="h-3 w-3 text-amber-600" />
							<p className="text-xs text-amber-600 font-medium">+12% from last hour</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4 border-slate-200 dark:border-slate-700 shadow-lg">
					<CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
						<CardTitle className="flex items-center gap-2">
							<div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md">
								<Activity className="h-4 w-4 text-white" />
							</div>
							Overview
						</CardTitle>
					</CardHeader>
					<CardContent className="pl-2 pt-6">
						<div className="h-[200px] flex items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
							<div className="text-center">
								<Activity className="h-10 w-10 mx-auto mb-2 opacity-30" />
								<p className="text-sm">Chart Placeholder (Recharts/Chart.js)</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="col-span-3 border-slate-200 dark:border-slate-700 shadow-lg">
					<CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
						<CardTitle className="flex items-center gap-2">
							<div className="p-1.5 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-md">
								<Activity className="h-4 w-4 text-white" />
							</div>
							Recent Activity
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-6">
						<div className="space-y-4">
							<div className="flex items-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
								<div className="ml-2 space-y-1 flex-1">
									<p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Server "prod-01" Connected</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">2 minutes ago</p>
								</div>
								<div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold border border-emerald-200 dark:border-emerald-700">
									Success
								</div>
							</div>

							<div className="flex items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
								<div className="ml-2 space-y-1 flex-1">
									<p className="text-sm font-semibold text-slate-900 dark:text-slate-100">App "api-gateway" Deployed</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">1 hour ago</p>
								</div>
								<div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-700">
									Deployed
								</div>
							</div>

							<div className="flex items-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
								<div className="ml-2 space-y-1 flex-1">
									<p className="text-sm font-semibold text-slate-900 dark:text-slate-100">K8s Installation Started</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">3 hours ago</p>
								</div>
								<div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full text-xs font-semibold border border-amber-200 dark:border-amber-700">
									Pending
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
