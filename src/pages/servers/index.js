import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { X, Server, Wifi, WifiOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
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

const ServerStatusBadge = ({ status }) => {
    const statusConfig = {
        active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2, label: 'Connected' },
        inactive: { bg: 'bg-gray-100', text: 'text-gray-800', icon: WifiOff, label: 'Inactive' },
        installing_k8s: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Loader2, label: 'Installing K8s' },
        k8s_ready: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle2, label: 'K8s Ready' },
        installation_failed: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Installation Failed' },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            <Icon className={`h-3 w-3 ${status === 'installing_k8s' ? 'animate-spin' : ''}`} />
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
        git_branch: 'apps/production',
        argocd_admin_password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(null);

    useEffect(() => {
        fetchServers();
        const interval = setInterval(fetchServers, 10000); // Refresh every 10s to update status
        return () => clearInterval(interval);
    }, []);

    const fetchServers = async () => {
        try {
            const res = await fetch('http://localhost:3000/servers', {
                credentials: 'include',
            });
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
            const res = await fetch('http://localhost:3000/servers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(newServer),
            });

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
            const res = await fetch(`http://localhost:3000/servers/${server.id}/check-connection`, {
                method: 'POST',
                credentials: 'include',
            });
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
            const res = await fetch(`http://localhost:3000/servers/${selectedServer.id}/install-k8s`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(k8sConfig),
            });

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
            const res = await fetch(`http://localhost:3000/servers/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                fetchServers();
            }
        } catch (error) {
            console.error('Error deleting server:', error);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Servers</h1>
                    <p className="text-muted-foreground mt-1">Manage your infrastructure servers and Kubernetes clusters</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} size="lg">
                    <Server className="mr-2 h-4 w-4" />
                    Add Server
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="rounded-md border">
                        <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b bg-muted/50">
                            <div className="col-span-2">Server Info</div>
                            <div>IP Address</div>
                            <div>Status</div>
                            <div className="col-span-2 text-center">Actions</div>
                        </div>
                        <div className="divide-y">
                            {servers.map((server) => (
                                <div key={server.id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Server className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{server.name}</div>
                                                <div className="text-xs text-muted-foreground">{server.username}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-mono text-sm">{server.ip_address}:{server.port}</div>
                                    <div>
                                        <ServerStatusBadge status={server.status} />
                                    </div>
                                    <div className="flex col-span-2 gap-2 justify-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => testConnection(server)}
                                            disabled={connectionStatus?.serverId === server.id && connectionStatus?.status === 'testing'}
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
                                            >
                                                Install K8s
                                            </Button>
                                        )}

                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => deleteServer(server.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {servers.length === 0 && (
                                <div className="p-12 text-center text-muted-foreground">
                                    <Server className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-lg font-medium mb-2">No servers configured</p>
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
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="name">Server Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={newServer.name}
                                    onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                                    placeholder="e.g. production-01"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="ip">IP Address</Label>
                                <Input
                                    id="ip"
                                    type="text"
                                    value={newServer.ip_address}
                                    onChange={(e) => setNewServer({ ...newServer, ip_address: e.target.value })}
                                    placeholder="e.g. 192.168.1.100"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="username">SSH Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={newServer.username}
                                    onChange={(e) => setNewServer({ ...newServer, username: e.target.value })}
                                    placeholder="SSH username"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">SSH Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newServer.password}
                                    onChange={(e) => setNewServer({ ...newServer, password: e.target.value })}
                                    placeholder="SSH password"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="port">SSH Port</Label>
                                <Input
                                    id="port"
                                    type="number"
                                    value={newServer.port}
                                    onChange={(e) => setNewServer({ ...newServer, port: parseInt(e.target.value) })}
                                    placeholder="22"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Server'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Install K8s Modal */}
            <Modal isOpen={isK8sModalOpen} onClose={() => setIsK8sModalOpen(false)} title={`Install Kubernetes on ${selectedServer?.name}`}>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        This will install K3s, Helm, and ArgoCD on your server. The process may take 5-10 minutes.
                    </p>

                    <div>
                        <Label htmlFor="git_branch">GitOps Branch</Label>
                        <Input
                            id="git_branch"
                            type="text"
                            value={k8sConfig.git_branch}
                            onChange={(e) => setK8sConfig({ ...k8sConfig, git_branch: e.target.value })}
                            placeholder="HEAD"
                        />
                    </div>

                    <div>
                        <Label htmlFor="argocd_password">ArgoCD Admin Password</Label>
                        <Input
                            id="argocd_password"
                            type="password"
                            value={k8sConfig.argocd_admin_password}
                            onChange={(e) => setK8sConfig({ ...k8sConfig, argocd_admin_password: e.target.value })}
                            placeholder="Set admin password (you can change it later)"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsK8sModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={installK8s} disabled={isLoading}>
                            {isLoading ? 'Starting...' : 'Install K8s'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
