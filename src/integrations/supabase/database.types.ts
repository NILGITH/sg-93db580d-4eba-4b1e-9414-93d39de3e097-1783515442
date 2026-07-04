/* eslint-disable @typescript-eslint/no-empty-object-type */
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
      agencies: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          postal_code: string | null
          siret: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          postal_code?: string | null
          siret?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          siret?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      mandates: {
        Row: {
          agency_id: string
          commission_amount: number | null
          commission_rate: number | null
          created_at: string | null
          documents: string[] | null
          end_date: string | null
          id: string
          is_active: boolean | null
          mandate_type: Database["public"]["Enums"]["mandate_type"]
          owner_id: string
          property_id: string
          reference: string
          start_date: string
          terms: string | null
          updated_at: string | null
        }
        Insert: {
          agency_id: string
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string | null
          documents?: string[] | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          mandate_type: Database["public"]["Enums"]["mandate_type"]
          owner_id: string
          property_id: string
          reference: string
          start_date: string
          terms?: string | null
          updated_at?: string | null
        }
        Update: {
          agency_id?: string
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string | null
          documents?: string[] | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          mandate_type?: Database["public"]["Enums"]["mandate_type"]
          owner_id?: string
          property_id?: string
          reference?: string
          start_date?: string
          terms?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mandates_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mandates_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mandates_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      owners: {
        Row: {
          address: string | null
          agency_id: string
          city: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          agency_id: string
          city?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          agency_id?: string
          city?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "owners_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          agency_id: string
          amount: number
          created_at: string | null
          description: string | null
          id: string
          is_validated: boolean | null
          mandate_id: string | null
          owner_id: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          property_id: string | null
          receipt_url: string | null
          reference: string | null
          updated_at: string | null
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          agency_id: string
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_validated?: boolean | null
          mandate_id?: string | null
          owner_id?: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          property_id?: string | null
          receipt_url?: string | null
          reference?: string | null
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          agency_id?: string
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_validated?: boolean | null
          mandate_id?: string | null
          owner_id?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          property_id?: string | null
          receipt_url?: string | null
          reference?: string | null
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_mandate_id_fkey"
            columns: ["mandate_id"]
            isOneToOne: false
            referencedRelation: "mandates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agency_id: string | null
          created_at: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          agency_id: string
          bathrooms: number | null
          bedrooms: number | null
          charges: number | null
          city: string
          created_at: string | null
          description: string | null
          features: Json | null
          floor: number | null
          id: string
          latitude: number | null
          longitude: number | null
          photos: string[] | null
          postal_code: string | null
          price: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          reference: string
          rental_price: number | null
          rooms: number | null
          status: Database["public"]["Enums"]["property_status"] | null
          surface_area: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          address: string
          agency_id: string
          bathrooms?: number | null
          bedrooms?: number | null
          charges?: number | null
          city: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          floor?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          photos?: string[] | null
          postal_code?: string | null
          price?: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          reference: string
          rental_price?: number | null
          rooms?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          surface_area?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          agency_id?: string
          bathrooms?: number | null
          bedrooms?: number | null
          charges?: number | null
          city?: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          floor?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          photos?: string[] | null
          postal_code?: string | null
          price?: number | null
          property_type?: Database["public"]["Enums"]["property_type"]
          reference?: string
          rental_price?: number | null
          rooms?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          surface_area?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      mandate_type: "gestion" | "location" | "vente" | "gestion_complete"
      payment_method:
        | "mobile_money"
        | "carte_bancaire"
        | "virement"
        | "cheque"
        | "especes"
      property_status: "disponible" | "loue" | "vendu" | "travaux" | "reserve"
      property_type:
        | "appartement"
        | "maison"
        | "studio"
        | "duplex"
        | "villa"
        | "terrain"
        | "commerce"
        | "bureau"
      user_role:
        | "super_admin"
        | "admin_agence"
        | "comptable"
        | "commercial"
        | "secretaire"
        | "proprietaire"
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
    Enums: {
      mandate_type: ["gestion", "location", "vente", "gestion_complete"],
      payment_method: [
        "mobile_money",
        "carte_bancaire",
        "virement",
        "cheque",
        "especes",
      ],
      property_status: ["disponible", "loue", "vendu", "travaux", "reserve"],
      property_type: [
        "appartement",
        "maison",
        "studio",
        "duplex",
        "villa",
        "terrain",
        "commerce",
        "bureau",
      ],
      user_role: [
        "super_admin",
        "admin_agence",
        "comptable",
        "commercial",
        "secretaire",
        "proprietaire",
      ],
    },
  },
} as const
