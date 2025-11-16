import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
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

export default function SitesPage() {
  const [sites, setSites] = useState([]);
  const [clustersList, setClustersList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSite, setNewSite] = useState({
    cluster_id: '',
    app_api: {
      application_name: '',
      repo_image: '',
      domain: '',
      port: '',
      environment: '',
      services: {
        redis: false,
        mongo: false,
        rabbitmq: false,
      },
    },
    app_cms: {
      application_name: '',
      repo_image: '',
      domain: '',
      port: '',
      environment: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSites();
    fetchClusters();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await fetch('http://localhost:3000/deployments', { credentials: 'include' });
      const data = await res.json();
      if (data.data) setSites(data.data);
    } catch (e) {
      console.error('Error fetching sites', e);
    }
  };

  const fetchClusters = async () => {
    try {
      const res = await fetch('http://localhost:3000/clusters', { credentials: 'include' });
      const data = await res.json();
      if (data.data) setClustersList(data.data);
    } catch (e) {
      console.error('Error fetching clusters', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newSite),
      });
      if (res.ok) {
        setNewSite({
          cluster_id: '',
          app_api: {
            application_name: '',
            repo_image: '',
            domain: '',
            port: '',
            environment: '',
            services: { redis: false, mongo: false, rabbitmq: false },
          },
          app_cms: { application_name: '', repo_image: '', domain: '', port: '', environment: '' },
        });
        setIsModalOpen(false);
        fetchSites();
      } else {
        console.error('Failed to create site');
      }
    } catch (err) {
      console.error('Error creating site', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Sites</CardTitle>
          <Button onClick={() => setIsModalOpen(true)}>Add Site</Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b bg-muted/50">
              <div>App (API)</div>
              <div>App (CMS)</div>
              <div>Type</div>
              <div>Domain</div>
              <div>Actions</div>
            </div>
            <div className="divide-y">
              {sites.map((s) => (
                <div key={s._id} className="grid grid-cols-5 gap-4 p-4 items-center">
                  <div>
                    <div className="font-medium">{s.app_api?.application_name}</div>
                    <div className="text-xs text-muted-foreground">{s.app_api?.repo_image}</div>
                  </div>
                  <div>
                    <div className="font-medium">{s.app_cms?.application_name}</div>
                    <div className="text-xs text-muted-foreground">{s.app_cms?.repo_image}</div>
                  </div>
                  <div>{'API + CMS'}</div>
                  <div>{s.app_api?.domain || s.app_cms?.domain}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
              ))}
              {sites.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">No sites found. Add one to get started.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Site">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end mb-4">
                    <div>
                      <Label htmlFor="cluster_select">Select Cluster</Label>
                      <select
                        id="cluster_select"
                        value={newSite.cluster_id}
                        onChange={(e) => setNewSite({ ...newSite, cluster_id: e.target.value })}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">-- Select cluster --</option>
                        {clustersList.map((c) => (
                          <option key={c._id} value={c._id}>{c.name || c.ip_address || c._id}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">API Application</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="api_name">Application Name (API)</Label>
                  <Input id="api_name" placeholder="e.g. my-service-api" value={newSite.app_api.application_name} onChange={(e) => setNewSite({ ...newSite, app_api: { ...newSite.app_api, application_name: e.target.value } })} required />
                </div>
                <div>
                  <Label htmlFor="api_repo">Repository Image (API)</Label>
                  <Input id="api_repo" placeholder="e.g. myregistry/myapi:latest or docker.io/myapi:v1.0.0" value={newSite.app_api.repo_image} onChange={(e) => setNewSite({ ...newSite, app_api: { ...newSite.app_api, repo_image: e.target.value } })} />
                </div>
                <div>
                  <Label htmlFor="api_domain">Domain (API)</Label>
                  <Input id="api_domain" placeholder="e.g. api.example.com" value={newSite.app_api.domain} onChange={(e) => setNewSite({ ...newSite, app_api: { ...newSite.app_api, domain: e.target.value } })} />
                </div>
                <div>
                  <Label htmlFor="api_port">Port (API)</Label>
                  <Input id="api_port" placeholder="e.g. 8080" value={newSite.app_api.port} onChange={(e) => setNewSite({ ...newSite, app_api: { ...newSite.app_api, port: e.target.value } })} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="api_env">Environment (API)</Label>
                  <textarea id="api_env" rows="4" value={newSite.app_api.environment} onChange={(e) => setNewSite({ ...newSite, app_api: { ...newSite.app_api, environment: e.target.value } })} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder={'NODE_ENV=production\nLOG_LEVEL=info\nDEBUG=false'} />
                </div>

                <div className="col-span-2">
                  <Label>Services (API)</Label>
                  <div className="flex gap-4 items-center mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newSite.app_api.services.redis}
                        onChange={(e) => setNewSite({ ...newSite, app_api: { ...newSite.app_api, services: { ...newSite.app_api.services, redis: e.target.checked } } })}
                        style={{ accentColor: '#000' }}
                      />
                      <span className="text-sm">Redis</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newSite.app_api.services.mongo}
                        onChange={(e) => setNewSite({ ...newSite, app_api: { ...newSite.app_api, services: { ...newSite.app_api.services, mongo: e.target.checked } } })}
                        style={{ accentColor: '#000' }}
                      />
                      <span className="text-sm">MongoDB</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newSite.app_api.services.rabbitmq}
                        onChange={(e) => setNewSite({ ...newSite, app_api: { ...newSite.app_api, services: { ...newSite.app_api.services, rabbitmq: e.target.checked } } })}
                        style={{ accentColor: '#000' }}
                      />
                      <span className="text-sm">RabbitMQ</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">CMS Application</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cms_name">Application Name (CMS)</Label>
                  <Input id="cms_name" placeholder="e.g. my-cms" value={newSite.app_cms.application_name} onChange={(e) => setNewSite({ ...newSite, app_cms: { ...newSite.app_cms, application_name: e.target.value } })} required />
                </div>
                <div>
                  <Label htmlFor="cms_repo">Repository Image (CMS)</Label>
                  <Input id="cms_repo" placeholder="e.g. myregistry/mycms:latest" value={newSite.app_cms.repo_image} onChange={(e) => setNewSite({ ...newSite, app_cms: { ...newSite.app_cms, repo_image: e.target.value } })} />
                </div>
                <div>
                  <Label htmlFor="cms_domain">Domain (CMS)</Label>
                  <Input id="cms_domain" placeholder="e.g. cms.example.com" value={newSite.app_cms.domain} onChange={(e) => setNewSite({ ...newSite, app_cms: { ...newSite.app_cms, domain: e.target.value } })} />
                </div>
                <div>
                  <Label htmlFor="cms_port">Port (CMS)</Label>
                  <Input id="cms_port" placeholder="e.g. 3000" value={newSite.app_cms.port} onChange={(e) => setNewSite({ ...newSite, app_cms: { ...newSite.app_cms, port: e.target.value } })} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="cms_env">Environment (CMS)</Label>
                  <textarea id="cms_env" rows="4" value={newSite.app_cms.environment} onChange={(e) => setNewSite({ ...newSite, app_cms: { ...newSite.app_cms, environment: e.target.value } })} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder={'NODE_ENV=production\nCMS_URL=https://cms.example.com'} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Site'}</Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
