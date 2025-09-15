import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useThreats, type Threat } from '@/hooks/useThreats';

interface ThreatFormProps {
  threat?: Threat;
  onSuccess?: () => void;
}

export const ThreatForm = ({ threat, onSuccess }: ThreatFormProps) => {
  const { addThreat, updateThreat } = useThreats();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: threat?.title || '',
    description: threat?.description || '',
    severity: threat?.severity || 'medium' as const,
    category: threat?.category || 'vulnerability',
    source: threat?.source || '',
    cve_id: threat?.cve_id || '',
    affected_systems: threat?.affected_systems || 0,
    mitigation_status: threat?.mitigation_status || 'unmitigated' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (threat) {
        await updateThreat(threat.id, formData);
      } else {
        await addThreat(formData);
      }
      
      setOpen(false);
      onSuccess?.();
      
      if (!threat) {
        setFormData({
          title: '',
          description: '',
          severity: 'medium',
          category: 'vulnerability',
          source: '',
          cve_id: '',
          affected_systems: 0,
          mitigation_status: 'unmitigated',
        });
      }
    } catch (error) {
      console.error('Error saving threat:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {threat ? 'Edit Threat' : 'Add Threat'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{threat ? 'Edit Threat' : 'Add New Threat'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select 
                value={formData.severity} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="malware">Malware</SelectItem>
                  <SelectItem value="phishing">Phishing</SelectItem>
                  <SelectItem value="vulnerability">Vulnerability</SelectItem>
                  <SelectItem value="data_breach">Data Breach</SelectItem>
                  <SelectItem value="ddos">DDoS</SelectItem>
                  <SelectItem value="insider_threat">Insider Threat</SelectItem>
                  <SelectItem value="ransomware">Ransomware</SelectItem>
                  <SelectItem value="apt">APT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mitigation_status">Status</Label>
              <Select 
                value={formData.mitigation_status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, mitigation_status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unmitigated">Unmitigated</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="mitigated">Mitigated</SelectItem>
                  <SelectItem value="false_positive">False Positive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cve_id">CVE ID</Label>
              <Input
                id="cve_id"
                value={formData.cve_id}
                onChange={(e) => setFormData(prev => ({ ...prev, cve_id: e.target.value }))}
                placeholder="CVE-2024-1234"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="affected_systems">Affected Systems</Label>
              <Input
                id="affected_systems"
                type="number"
                value={formData.affected_systems}
                onChange={(e) => setFormData(prev => ({ ...prev, affected_systems: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (threat ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};