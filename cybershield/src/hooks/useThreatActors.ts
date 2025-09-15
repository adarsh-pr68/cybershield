import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ThreatActor {
  id: string;
  name: string;
  aliases: string | null;
  origin_country: string | null;
  activity_status: string | null;
  first_seen: string | null;
  last_activity: string | null;
  created_at: string | null;
}

export const useThreatActors = () => {
  const [threatActors, setThreatActors] = useState<ThreatActor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchThreatActors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('threat_actors')
        .select('*')
        .order('last_activity', { ascending: false });

      if (error) throw error;
      setThreatActors(data || []);
    } catch (error) {
      console.error('Error fetching threat actors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch threat actors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreatActors();
  }, []);

  return {
    threatActors,
    loading,
    refetch: fetchThreatActors,
  };
};