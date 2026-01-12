import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Package, CheckCircle2, XCircle, Clock, Plus, Trash2, Info } from 'lucide-react';
import { api } from '../../lib/api';
import { useEffect, useState } from 'react';

const AppStatusBadge = ({ status }) => {
    const statusConfig = {
        active: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: CheckCircle2, label: 'Active', ring: 'ring-emerald-600/20' },
        inactive: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-400', icon: XCircle, label: 'Inactive', ring: 'ring-slate-600/20' },
        pending: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: Clock, label: 'Pending', ring: 'ring-amber-600/20' },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} ring-1 ${config.ring} shadow-sm`}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
        </span>
    );
};

export default function AppsPage() {
    const navigate = useNavigate();
    const [apps, setApps] = useState([]);
    const [servers, setServers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchApps();
        fetchServers();
    }, []);

    const fetchApps = async () => {
        try {
            const res = await api.fetch('/apps');
            const data = await res.json();
            if (data.data) {
                setApps(data.data);
            }
        } catch (error) {
            console.error('Error fetching apps:', error);
        }
    };

    const fetchServers = async () => {
        try {
            const res = await api.fetch('/servers');
            const data = await res.json();
            if (data.data) {
                setServers(data.data.filter(s => s.status === 'k8s_ready'));
            }
        } catch (error) {
            console.error('Error fetching servers:', error);
        }
    };


    const deleteApp = async (id) => {
        if (!window.confirm('Are you sure you want to delete this app?')) return;

        try {
            const res = await api.delete(`/apps/${id}`);

            if (res.ok) {
                fetchApps();
            }
        } catch (error) {
            console.error('Error deleting app:', error);
        }
    };


    return (
        <div className="container mx-auto p-4 md:p-6 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">Applications</h1>
                    <p className="text-slate-600 dark:text-slate-400 my-2 text-lg">Deploy and manage your applications on Kubernetes</p>
                </div>
                <Button
                    onClick={() => navigate('/apps/create')}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    <Package className="mr-2 h-5 w-5" />
                    Deploy App
                </Button>
            </div>

            {servers.length === 0 && (
                <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 shadow-md">
                    <CardContent className="pt-6">
                        <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            ⚠️ No Kubernetes-ready servers available. Please add a server and install K8s first.
                        </p>
                    </CardContent>
                </Card>
            )}

            <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                <CardContent className="p-0">
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="grid grid-cols-6 gap-4 p-4 font-semibold border-b bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 text-slate-700 dark:text-slate-300">
                            <div className="col-span-2">Application</div>
                            <div className="col-span-2">Helm Chart / Services</div>
                            <div>Server</div>
                            <div>Status</div>
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {apps.map((app) => (
                                <div key={app.id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                                                <Package className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">{app.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">ID: {app.id}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{app.helm_chart}</div>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {app.services && app.services.map((svc, idx) => (
                                                <span key={idx} className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md font-medium border border-blue-200 dark:border-blue-800">
                                                    {svc.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-slate-700 dark:text-slate-300">{app.server?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AppStatusBadge status={app.status} />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            onClick={() => deleteApp(app.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {apps.length === 0 && (
                                <div className="p-16 text-center text-slate-500 dark:text-slate-400">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                                        <Package className="h-10 w-10 opacity-30" />
                                    </div>
                                    <p className="text-lg font-semibold mb-2">No applications deployed</p>
                                    <p className="text-sm">Deploy your first application to get started</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
