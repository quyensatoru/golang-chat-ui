import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';

// Basic modal component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default function ClustersPage() {
  const [clusters, setClusters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCluster, setNewCluster] = useState({
    ip_address: '',
    name: '',
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    try {
      const res = await fetch('http://localhost:3000/clusters', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.data) {
        setClusters(data.data);
      }
    } catch (error) {
      console.error('Error fetching clusters:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3000/clusters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newCluster),
      });

      if (res.ok) {
        setNewCluster({ ip_address: '', name: "", username: '', password: '' });
        setIsModalOpen(false);
        fetchClusters(); // Refresh the list
      } else {
        console.error('Failed to create cluster');
      }
    } catch (error) {
      console.error('Error creating cluster:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Clusters</CardTitle>
          <Button onClick={() => setIsModalOpen(true)}>Add Cluster</Button>
        </CardHeader>
        <CardContent>
          {/* Clusters list */}
          <div className="rounded-md border">
            <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b bg-muted/50">
              <div>IP Address</div>
              <div>Username</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="divide-y">
              {clusters.map((cluster) => (
                <div key={cluster._id} className="grid grid-cols-4 gap-4 p-4 items-center">
                  <div>{cluster.ip_address}</div>
                  <div>{cluster.username}</div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cluster.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cluster.status || 'unknown'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
              ))}
              {clusters.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No clusters found. Add one to get started.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Cluster Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-4">Add New Cluster</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Label</Label>
              <Input
                id="name"
                type="text"
                value={newCluster.name}
                onChange={(e) => setNewCluster({ ...newCluster, name: e.target.value })}
                placeholder="e.g cluster-01"
                required
              />
            </div>
            <div>
              <Label htmlFor="ip">IP Address</Label>
              <Input
                id="ip"
                type="text"
                value={newCluster.ip_address}
                onChange={(e) => setNewCluster({ ...newCluster, ip_address: e.target.value })}
                placeholder="e.g. 192.168.1.100"
                required
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={newCluster.username}
                onChange={(e) => setNewCluster({ ...newCluster, username: e.target.value })}
                placeholder="SSH username"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newCluster.password}
                onChange={(e) => setNewCluster({ ...newCluster, password: e.target.value })}
                placeholder="SSH password"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Cluster'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}