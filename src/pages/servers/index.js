import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { X, Server, Wifi, WifiOff, Loader2, CheckCircle2, XCircle, Trash2, Settings, Package } from 'lucide-react';
import { api } from '../../lib/api';

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Server className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </div>
    );
};

const ServerStatusBadge = ({ status }) => {
    const statusConfig = {
        active: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: CheckCircle2, label: 'Connected', ring: 'ring-emerald-600/20' },
        inactive: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-400', icon: WifiOff, label: 'Inactive', ring: 'ring-slate-600/20' },
        installing_k8s: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: Loader2, label: 'Installing K8s', ring: 'ring-blue-600/20' },
        k8s_ready: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: CheckCircle2, label: 'K8s Ready', ring: 'ring-emerald-600/20' },
        installation_failed: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: XCircle, label: 'Installation Failed', ring: 'ring-red-600/20' },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} ring-1 ${config.ring} shadow-sm`}>
            <Icon className={`h-3.5 w-3.5 ${status === 'installing_k8s' ? 'animate-spin' : ''}`} />
            {config.label}
        </span>
    );
};

export default function ServersPage() {
    const [servers, setServers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isK8sModalOpen, setIsK8sModalOpen] = useState(false);
    const [selectedServer, setSelectedServer] = useState(null);
    const [newServer, setNewServer] = useState({
        ip_address: '',
        name: '',
        username: '',
        password: '',
        port: 22,
    });
    const [k8sConfig, setK8sConfig] = useState({
        argocd_admin_password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(null);

    useEffect(() => {
        fetchServers();
        const interval = setInterval(fetchServers, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchServers = async () => {
        try {
            const res = await api.fetch('/servers');
            const data = await res.json();
            if (data.data) {
                setServers(data.data);
            }
        } catch (error) {
            console.error('Error fetching servers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setConnectionStatus(null);

        try {
            const res = await api.post('/servers', newServer);

            if (res.ok) {
                setNewServer({ ip_address: '', name: '', username: '', password: '', port: 22 });
                setIsModalOpen(false);
                fetchServers();
            } else {
                console.error('Failed to create server');
            }
        } catch (error) {
            console.error('Error creating server:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const testConnection = async (server) => {
        setConnectionStatus({ serverId: server.id, status: 'testing' });
        try {
            const res = await api.post(`/servers/${server.id}/check-connection`);
            const data = await res.json();

            if (res.ok) {
                setConnectionStatus({ serverId: server.id, status: 'success' });
                fetchServers();
            } else {
                setConnectionStatus({ serverId: server.id, status: 'failed', error: data.error || 'Connection failed' });
            }
        } catch (error) {
            setConnectionStatus({ serverId: server.id, status: 'failed', error: error.message });
        }
    };

    const installK8s = async () => {
        setIsLoading(true);
        try {
            const res = await api.post(`/servers/${selectedServer.id}/install-k8s`, k8sConfig);

            if (res.ok) {
                setIsK8sModalOpen(false);
                setK8sConfig({ git_branch: 'apps/production', argocd_admin_password: '' });
                fetchServers();
                alert('K8s installation started! This may take a few minutes.');
            } else {
                alert('Failed to start K8s installation');
            }
        } catch (error) {
            console.error('Error installing K8s:', error);
            alert('Error installing K8s');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteServer = async (id) => {
        if (!window.confirm('Are you sure you want to delete this server?')) return;

        try {
            const res = await api.delete(`/servers/${id}`);

            if (res.ok) {
                fetchServers();
            }
        } catch (error) {
            console.error('Error deleting server:', error);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">Servers</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Manage your infrastructure servers and Kubernetes clusters</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    <Server className="mr-2 h-5 w-5" />
                    Add Server
                </Button>
            </div>

            <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                <CardContent className="p-0">
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="grid grid-cols-6 gap-4 p-4 font-semibold border-b bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 text-slate-700 dark:text-slate-300">
                            <div className="col-span-2">Server Info</div>
                            <div>IP Address</div>
                            <div>Status</div>
                            <div className="col-span-2 text-center">Actions</div>
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {servers.map((server) => (
                                <div key={server.id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                                                <Server className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">{server.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{server.username}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-mono text-sm text-slate-700 dark:text-slate-300">{server.ip_address}:{server.port}</div>
                                    <div>
                                        <ServerStatusBadge status={server.status} />
                                    </div>
                                    <div className="flex col-span-2 gap-2 justify-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => testConnection(server)}
                                            disabled={connectionStatus?.serverId === server.id && connectionStatus?.status === 'testing'}
                                            className="border-slate-300 dark:border-slate-600"
                                        >
                                            {connectionStatus?.serverId === server.id && connectionStatus?.status === 'testing' ? (
                                                <>
                                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                    Testing
                                                </>
                                            ) : (
                                                <>
                                                    <Wifi className="h-3 w-3 mr-1" />
                                                    Test
                                                </>
                                            )}
                                        </Button>

                                        {server.status !== 'k8s_ready' && server.status !== 'installing_k8s' && (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedServer(server);
                                                    setIsK8sModalOpen(true);
                                                }}
                                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                                            >
                                                <Settings className="h-3 w-3 mr-1" />
                                                Install K8s
                                            </Button>
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteServer(server.id)}
                                            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {servers.length === 0 && (
                                <div className="p-16 text-center text-slate-500 dark:text-slate-400">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                                        <Server className="h-10 w-10 opacity-30" />
                                    </div>
                                    <p className="text-lg font-semibold mb-2">No servers configured</p>
                                    <p className="text-sm">Add your first server to get started</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add Server Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Server">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Server Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={newServer.name}
                                    onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                                    placeholder="e.g. production-01"
                                    className="mt-1.5 border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="ip" className="text-sm font-medium text-slate-700 dark:text-slate-300">IP Address</Label>
                                <Input
                                    id="ip"
                                    type="text"
                                    value={newServer.ip_address}
                                    onChange={(e) => setNewServer({ ...newServer, ip_address: e.target.value })}
                                    placeholder="e.g. 192.168.1.100"
                                    className="mt-1.5 border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">SSH Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={newServer.username}
                                    onChange={(e) => setNewServer({ ...newServer, username: e.target.value })}
                                    placeholder="SSH username"
                                    className="mt-1.5 border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">SSH Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newServer.password}
                                    onChange={(e) => setNewServer({ ...newServer, password: e.target.value })}
                                    placeholder="SSH password"
                                    className="mt-1.5 border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="port" className="text-sm font-medium text-slate-700 dark:text-slate-300">SSH Port</Label>
                                <Input
                                    id="port"
                                    type="number"
                                    value={newServer.port}
                                    onChange={(e) => setNewServer({ ...newServer, port: parseInt(e.target.value) })}
                                    placeholder="22"
                                    className="mt-1.5 border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 border-slate-300 dark:border-slate-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                        >
                            {isLoading ? 'Adding...' : 'Add Server'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Install K8s Modal */}
            <Modal isOpen={isK8sModalOpen} onClose={() => setIsK8sModalOpen(false)} title={`Install Kubernetes on ${selectedServer?.name}`}>
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        This will install K3s, Helm, and ArgoCD on your server. The process may take 5-10 minutes.
                    </p>

                    <div>
                        <Label htmlFor="argocd_password" className="text-sm font-medium text-slate-700 dark:text-slate-300">ArgoCD Admin Password</Label>
                        <Input
                            id="argocd_password"
                            type="password"
                            value={k8sConfig.argocd_admin_password}
                            onChange={(e) => setK8sConfig({ ...k8sConfig, argocd_admin_password: e.target.value })}
                            placeholder="Set admin password (you can change it later)"
                            className="mt-1.5 border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsK8sModalOpen(false)}
                            className="px-6 border-slate-300 dark:border-slate-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={installK8s}
                            disabled={isLoading}
                            className="px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md"
                        >
                            {isLoading ? 'Starting...' : 'Install K8s'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
