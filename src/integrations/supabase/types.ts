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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          id: string
          label: string | null
          masked_hint: string | null
          provider: string
          status: Database["public"]["Enums"]["api_key_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          masked_hint?: string | null
          provider: string
          status?: Database["public"]["Enums"]["api_key_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          masked_hint?: string | null
          provider?: string
          status?: Database["public"]["Enums"]["api_key_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          created_at: string
          folder: string
          generation_id: string | null
          id: string
          is_favorite: boolean
          kind: Database["public"]["Enums"]["asset_kind"]
          mime_type: string | null
          name: string
          project_id: string | null
          size_bytes: number | null
          source: Database["public"]["Enums"]["asset_source"]
          thumbnail_url: string | null
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          folder?: string
          generation_id?: string | null
          id?: string
          is_favorite?: boolean
          kind?: Database["public"]["Enums"]["asset_kind"]
          mime_type?: string | null
          name?: string
          project_id?: string | null
          size_bytes?: number | null
          source?: Database["public"]["Enums"]["asset_source"]
          thumbnail_url?: string | null
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          folder?: string
          generation_id?: string | null
          id?: string
          is_favorite?: boolean
          kind?: Database["public"]["Enums"]["asset_kind"]
          mime_type?: string | null
          name?: string
          project_id?: string | null
          size_bytes?: number | null
          source?: Database["public"]["Enums"]["asset_source"]
          thumbnail_url?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "generations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          generation_id: string | null
          id: string
          kind: Database["public"]["Enums"]["credit_txn_kind"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          generation_id?: string | null
          id?: string
          kind: Database["public"]["Enums"]["credit_txn_kind"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          generation_id?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["credit_txn_kind"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "generations"
            referencedColumns: ["id"]
          },
        ]
      }
      credits: {
        Row: {
          balance: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      generations: {
        Row: {
          completed_at: string | null
          created_at: string
          credits_cost: number
          error: string | null
          id: string
          is_favorite: boolean
          metadata: Json
          model: string
          negative_prompt: string | null
          output_url: string | null
          progress: number
          project_id: string | null
          prompt: string
          started_at: string | null
          status: Database["public"]["Enums"]["generation_status"]
          thumbnail_url: string | null
          type: Database["public"]["Enums"]["generation_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          credits_cost?: number
          error?: string | null
          id?: string
          is_favorite?: boolean
          metadata?: Json
          model?: string
          negative_prompt?: string | null
          output_url?: string | null
          progress?: number
          project_id?: string | null
          prompt?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["generation_status"]
          thumbnail_url?: string | null
          type: Database["public"]["Enums"]["generation_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          credits_cost?: number
          error?: string | null
          id?: string
          is_favorite?: boolean
          metadata?: Json
          model?: string
          negative_prompt?: string | null
          output_url?: string | null
          progress?: number
          project_id?: string | null
          prompt?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["generation_status"]
          thumbnail_url?: string | null
          type?: Database["public"]["Enums"]["generation_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          badge: string | null
          cost_per_run: number
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          provider: string
          quality: string | null
          slug: string
          speed: string | null
          type: Database["public"]["Enums"]["generation_type"]
          updated_at: string
        }
        Insert: {
          badge?: string | null
          cost_per_run?: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          provider: string
          quality?: string | null
          slug: string
          speed?: string | null
          type: Database["public"]["Enums"]["generation_type"]
          updated_at?: string
        }
        Update: {
          badge?: string | null
          cost_per_run?: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          provider?: string
          quality?: string | null
          slug?: string
          speed?: string | null
          type?: Database["public"]["Enums"]["generation_type"]
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          kind: string
          link: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          kind?: string
          link?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          kind?: string
          link?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_archived: boolean
          is_favorite: boolean
          name: string
          status: Database["public"]["Enums"]["project_status"]
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean
          is_favorite?: boolean
          name?: string
          status?: Database["public"]["Enums"]["project_status"]
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean
          is_favorite?: boolean
          name?: string
          status?: Database["public"]["Enums"]["project_status"]
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string
          config: Json
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          is_active: boolean
          preview_url: string | null
          slug: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          config?: Json
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_active?: boolean
          preview_url?: string | null
          slug: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          config?: Json
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_active?: boolean
          preview_url?: string | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      voices: {
        Row: {
          accent: string | null
          avatar_url: string | null
          category: string
          created_at: string
          description: string | null
          gender: string | null
          id: string
          is_active: boolean
          language: string
          name: string
          preview_url: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          accent?: string | null
          avatar_url?: string | null
          category?: string
          created_at?: string
          description?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          language?: string
          name: string
          preview_url?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          accent?: string | null
          avatar_url?: string | null
          category?: string
          created_at?: string
          description?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          language?: string
          name?: string
          preview_url?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      api_key_status: "active" | "revoked"
      app_role: "admin" | "moderator" | "user"
      asset_kind: "image" | "video" | "audio" | "other"
      asset_source: "uploaded" | "generated"
      credit_txn_kind: "grant" | "spend" | "purchase" | "refund"
      generation_status:
        | "queued"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      generation_type: "image" | "video" | "voice" | "music" | "complete_video"
      project_status: "draft" | "in_progress" | "completed"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      api_key_status: ["active", "revoked"],
      app_role: ["admin", "moderator", "user"],
      asset_kind: ["image", "video", "audio", "other"],
      asset_source: ["uploaded", "generated"],
      credit_txn_kind: ["grant", "spend", "purchase", "refund"],
      generation_status: [
        "queued",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      generation_type: ["image", "video", "voice", "music", "complete_video"],
      project_status: ["draft", "in_progress", "completed"],
    },
  },
} as const
