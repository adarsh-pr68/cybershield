export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      intel_feeds: {
        Row: {
          created_at: string | null
          feed_name: string | null
          feed_url: string | null
          id: string | null
          is_active: boolean | null
          last_updated: string | null
        }
        Insert: {
          created_at?: string | null
          feed_name?: string | null
          feed_url?: string | null
          id?: string | null
          is_active?: boolean | null
          last_updated?: string | null
        }
        Update: {
          created_at?: string | null
          feed_name?: string | null
          feed_url?: string | null
          id?: string | null
          is_active?: boolean | null
          last_updated?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          organization: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          organization?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          organization?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rls_policies: {
        Row: {
          action: string | null
          policy_name: string | null
          rule: string | null
          table_name: string | null
        }
        Insert: {
          action?: string | null
          policy_name?: string | null
          rule?: string | null
          table_name?: string | null
        }
        Update: {
          action?: string | null
          policy_name?: string | null
          rule?: string | null
          table_name?: string | null
        }
        Relationships: []
      }
      security_metrics: {
        Row: {
          created_by: string | null
          id: string | null
          metric_name: string | null
          metric_value: number | null
          recorded_at: string | null
          unit: string | null
        }
        Insert: {
          created_by?: string | null
          id?: string | null
          metric_name?: string | null
          metric_value?: number | null
          recorded_at?: string | null
          unit?: string | null
        }
        Update: {
          created_by?: string | null
          id?: string | null
          metric_name?: string | null
          metric_value?: number | null
          recorded_at?: string | null
          unit?: string | null
        }
        Relationships: []
      }
      threat_actors: {
        Row: {
          activity_status: string | null
          aliases: string | null
          created_at: string | null
          first_seen: string | null
          id: string | null
          last_activity: string | null
          name: string | null
          origin_country: string | null
        }
        Insert: {
          activity_status?: string | null
          aliases?: string | null
          created_at?: string | null
          first_seen?: string | null
          id?: string | null
          last_activity?: string | null
          name?: string | null
          origin_country?: string | null
        }
        Update: {
          activity_status?: string | null
          aliases?: string | null
          created_at?: string | null
          first_seen?: string | null
          id?: string | null
          last_activity?: string | null
          name?: string | null
          origin_country?: string | null
        }
        Relationships: []
      }
      threats: {
        Row: {
          affected_systems: number | null
          category: string | null
          created_at: string | null
          cve_id: string | null
          description: string | null
          id: string | null
          mitigation_status: string | null
          severity: string | null
          source: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          affected_systems?: number | null
          category?: string | null
          created_at?: string | null
          cve_id?: string | null
          description?: string | null
          id?: string | null
          mitigation_status?: string | null
          severity?: string | null
          source?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          affected_systems?: number | null
          category?: string | null
          created_at?: string | null
          cve_id?: string | null
          description?: string | null
          id?: string | null
          mitigation_status?: string | null
          severity?: string | null
          source?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      triggers: {
        Row: {
          event: string | null
          function_name: string | null
          table_name: string | null
          timing: string | null
          trigger_name: string | null
        }
        Insert: {
          event?: string | null
          function_name?: string | null
          table_name?: string | null
          timing?: string | null
          trigger_name?: string | null
        }
        Update: {
          event?: string | null
          function_name?: string | null
          table_name?: string | null
          timing?: string | null
          trigger_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
