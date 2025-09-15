import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface SecurityMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  unit: string | null;
  recorded_at: string | null;
  created_by: string | null;
}

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('security_metrics')
        .select('*')
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch security metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    loading,
    refetch: fetchMetrics,
  };
};