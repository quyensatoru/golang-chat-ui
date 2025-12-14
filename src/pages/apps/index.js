import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { X, Package, CheckCircle2, XCircle, Clock } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-card rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1">
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </div>
    );
};

const AppStatusBadge = ({ status }) => {
    const statusConfig = {
        active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2, label: 'Active' },
        inactive: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle, label: 'Inactive' },
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending' },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            <Icon className="h-3 w-3" />
            {config.label}
        </span>
    );
};

export default function AppsPage() {
    const [apps, setApps] = useState([]);
    const [servers, setServers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newApp, setNewApp] = useState({
        name: '',
        helm_chart: '',
        server_id: '',
        services: [], // Array of { name: '', env_raw: '' }
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchApps();
        fetchServers();
    }, []);

    const fetchApps = async () => {
        try {
            const res = await fetch('http://localhost:3000/apps', {
                credentials: 'include',
            });
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
            const res = await fetch('http://localhost:3000/servers', {
                credentials: 'include',
            });
            const data = await res.json();
            if (data.data) {
                setServers(data.data.filter(s => s.status === 'k8s_ready'));
            }
        } catch (error) {
            console.error('Error fetching servers:', error);
        }
    };

    console.log('newApp:', newApp);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate and transform services
            const transformedServices = newApp.services.map((svc) => ({
                name: svc.name,
                env_raw: JSON.stringify(JSON.parse(svc.env_raw)),
            }));
            
            const payload = {
                ...newApp,
                services: transformedServices
            };

            const res = await fetch('http://localhost:3000/apps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setNewApp({
                    name: '',
                    helm_chart: '',
                    server_id: '',
                    services: [],
                });
                setIsModalOpen(false);
                fetchApps();
            } else {
                console.error('Failed to create app');
            }
        } catch (error) {
            console.error('Error creating app:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteApp = async (id) => {
        if (!window.confirm('Are you sure you want to delete this app?')) return;

        try {
            const res = await fetch(`http://localhost:3000/apps/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                fetchApps();
            }
        } catch (error) {
            console.error('Error deleting app:', error);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
                    <p className="text-muted-foreground mt-1">Deploy and manage your applications on Kubernetes</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} size="lg">
                    <Package className="mr-2 h-4 w-4" />
                    Deploy App
                </Button>
            </div>

            {servers.length === 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-6">
                        <p className="text-sm text-yellow-800">
                            ⚠️ No Kubernetes-ready servers available. Please add a server and install K8s first.
                        </p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardContent className="p-0">
                    <div className="rounded-md border">
                        <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b bg-muted/50">
                            <div className="col-span-2">Application</div>
                            <div className="col-span-2">Helm Chart / Services</div>
                            <div>Server</div>
                            <div>Status</div>
                        </div>
                        <div className="divide-y">
                            {apps.map((app) => (
                                <div key={app.id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Package className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{app.name}</div>
                                                <div className="text-xs text-muted-foreground">ID: {app.id}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-sm font-medium">{app.helm_chart}</div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {app.services && app.services.map((svc, idx) => (
                                                <span key={idx} className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                                                    {svc.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm">{app.server?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AppStatusBadge status={app.status} />
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteApp(app.id)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {apps.length === 0 && (
                                <div className="p-12 text-center text-muted-foreground">
                                    <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-lg font-medium mb-2">No applications deployed</p>
                                    <p className="text-sm">Deploy your first application to get started</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Deploy App Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Deploy New Application">
                <form onSubmit={handleSubmit}>
                    {servers.length === 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md text-sm mb-4">
                            ⚠️ No Kubernetes-ready servers available. Please go to the Servers page and install K8s on a server first.
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="server_id">Select Server</Label>
                            <select
                                id="server_id"
                                value={newApp.server_id}
                                onChange={(e) => setNewApp({ ...newApp, server_id: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                required
                            >
                                <option value="">-- Select a server --</option>
                                {servers.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.ip_address})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <Label htmlFor="name">Application Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={newApp.name}
                                    onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                                    placeholder="e.g. my-app"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="helm_chart">Helm Chart (Git URL)</Label>
                                <Input
                                    id="helm_chart"
                                    type="text"
                                    value={newApp.helm_chart}
                                    onChange={(e) => setNewApp({ ...newApp, helm_chart: e.target.value })}
                                    placeholder="e.g. https://github.com/my/repo.git"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label>Services</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setNewApp({ ...newApp, services: [...newApp.services, { name: '', env_raw: '' }] })}
                                >
                                    Add Service
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {newApp.services.map((service, index) => (
                                    <div key={index} className="p-3 border rounded-md relative bg-muted/20">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-6 w-6 p-0"
                                            onClick={() => {
                                                const updatedServices = [...newApp.services];
                                                updatedServices.splice(index, 1);
                                                setNewApp({ ...newApp, services: updatedServices });
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <div className="mb-3 pr-8">
                                            <Label className="text-xs text-muted-foreground">Service Name</Label>
                                            <Input
                                                value={service.name}
                                                onChange={(e) => {
                                                    const updatedServices = [...newApp.services];
                                                    updatedServices[index].name = e.target.value;
                                                    setNewApp({ ...newApp, services: updatedServices });
                                                }}
                                                placeholder="e.g. backend"
                                                className="mt-1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <div className="space-y-2">
                                                <Label className="text-xs text-muted-foreground">Environment Variables (JSON)</Label>
                                                <textarea
                                                    value={service.env_raw}
                                                    onChange={(e) => {
                                                        const updatedServices = [...newApp.services];
                                                        updatedServices[index].env_raw = e.target.value;
                                                        setNewApp({ ...newApp, services: updatedServices });
                                                    }}
                                                    rows={5}
                                                    placeholder={`{\n  "KEY": "VALUE",\n  "ANOTHER_KEY": "ANOTHER_VALUE"\n}`}
                                                    className="flex min-h-[5rem] w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || servers.length === 0}>
                            {isLoading ? 'Deploying...' : 'Deploy Application'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
