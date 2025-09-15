import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Threat {
  id: string;
  title: string;
  description: string | null;
  severity: string;
  category: string;
  source: string | null;
  cve_id: string | null;
  affected_systems: number | null;
  mitigation_status: string;
  created_at: string | null;
  updated_at: string | null;
}

export const useThreats = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchThreats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('threats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThreats(data || []);
    } catch (error) {
      console.error('Error fetching threats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch threats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addThreat = async (threat: Omit<Threat, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('threats')
        .insert([threat])
        .select()
        .single();

      if (error) throw error;
      
      setThreats(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Threat added successfully",
      });
      return data;
    } catch (error) {
      console.error('Error adding threat:', error);
      toast({
        title: "Error",
        description: "Failed to add threat",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateThreat = async (id: string, updates: Partial<Threat>) => {
    try {
      const { data, error } = await supabase
        .from('threats')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setThreats(prev => prev.map(threat => 
        threat.id === id ? { ...threat, ...data } : threat
      ));
      toast({
        title: "Success",
        description: "Threat updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating threat:', error);
      toast({
        title: "Error",
        description: "Failed to update threat",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteThreat = async (id: string) => {
    try {
      const { error } = await supabase
        .from('threats')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setThreats(prev => prev.filter(threat => threat.id !== id));
      toast({
        title: "Success",
        description: "Threat deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting threat:', error);
      toast({
        title: "Error",
        description: "Failed to delete threat",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchThreats();
  }, []);

  return {
    threats,
    loading,
    addThreat,
    updateThreat,
    deleteThreat,
    refetch: fetchThreats,
  };
};