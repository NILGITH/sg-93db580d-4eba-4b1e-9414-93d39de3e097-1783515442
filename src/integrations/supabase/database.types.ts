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
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          cover_image_url: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          client_email: string
          client_name: string
          client_phone: string | null
          created_at: string | null
          deposit_amount: number | null
          deposit_paid: boolean | null
          end_date: string
          id: string
          nights: number
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_reference: string | null
          property_id: string
          prospect_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          updated_at: string | null
        }
        Insert: {
          client_email: string
          client_name: string
          client_phone?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          deposit_paid?: boolean | null
          end_date: string
          id?: string
          nights: number
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_reference?: string | null
          property_id: string
          prospect_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          updated_at?: string | null
        }
        Update: {
          client_email?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          deposit_paid?: boolean | null
          end_date?: string
          id?: string
          nights?: number
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_reference?: string | null
          property_id?: string
          prospect_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          amount: number
          clauses: string | null
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at: string | null
          created_by: string | null
          deposit_amount: number | null
          end_date: string | null
          file_url: string | null
          id: string
          owner_id: string | null
          property_id: string
          reference: string
          signed_at: string | null
          signed_by_owner: boolean | null
          signed_by_tenant: boolean | null
          start_date: string
          status: Database["public"]["Enums"]["contract_status"] | null
          tenant_id: string | null
          terms: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          clauses?: string | null
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at?: string | null
          created_by?: string | null
          deposit_amount?: number | null
          end_date?: string | null
          file_url?: string | null
          id?: string
          owner_id?: string | null
          property_id: string
          reference: string
          signed_at?: string | null
          signed_by_owner?: boolean | null
          signed_by_tenant?: boolean | null
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          tenant_id?: string | null
          terms?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          clauses?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string | null
          created_by?: string | null
          deposit_amount?: number | null
          end_date?: string | null
          file_url?: string | null
          id?: string
          owner_id?: string | null
          property_id?: string
          reference?: string
          signed_at?: string | null
          signed_by_owner?: boolean | null
          signed_by_tenant?: boolean | null
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          tenant_id?: string | null
          terms?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          contract_id: string | null
          created_at: string | null
          file_size: number | null
          file_url: string
          id: string
          intervention_id: string | null
          mime_type: string | null
          name: string
          property_id: string | null
          type: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          contract_id?: string | null
          created_at?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          intervention_id?: string | null
          mime_type?: string | null
          name: string
          property_id?: string | null
          type: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          contract_id?: string | null
          created_at?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          intervention_id?: string | null
          mime_type?: string | null
          name?: string
          property_id?: string | null
          type?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_items: {
        Row: {
          active: boolean | null
          answer: string
          category: string | null
          created_at: string | null
          id: string
          order_index: number | null
          question: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          answer: string
          category?: string | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          question: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          answer?: string
          category?: string | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      interventions: {
        Row: {
          actual_cost: number | null
          agent_comment: string | null
          completed_date: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_cost: number | null
          id: string
          intervention_type: Database["public"]["Enums"]["intervention_type"]
          photos_after: string[] | null
          photos_before: string[] | null
          property_id: string
          provider_comment: string | null
          provider_id: string | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["intervention_status"] | null
          title: string
          updated_at: string | null
          validated_by: string | null
        }
        Insert: {
          actual_cost?: number | null
          agent_comment?: string | null
          completed_date?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          intervention_type: Database["public"]["Enums"]["intervention_type"]
          photos_after?: string[] | null
          photos_before?: string[] | null
          property_id: string
          provider_comment?: string | null
          provider_id?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["intervention_status"] | null
          title: string
          updated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          actual_cost?: number | null
          agent_comment?: string | null
          completed_date?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          intervention_type?: Database["public"]["Enums"]["intervention_type"]
          photos_after?: string[] | null
          photos_before?: string[] | null
          property_id?: string
          provider_comment?: string | null
          provider_id?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["intervention_status"] | null
          title?: string
          updated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interventions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          read: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          read?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          notification_type?: Database["public"]["Enums"]["notification_type"]
          read?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      owners: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          id_card_number: string | null
          last_name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          id_card_number?: string | null
          last_name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          id_card_number?: string | null
          last_name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "owners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          is_validated: boolean | null
          owner_id: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_type: Database["public"]["Enums"]["payment_type"]
          photo_justificatif: string | null
          property_id: string | null
          receipt_url: string | null
          reference: string | null
          tenant_id: string | null
          updated_at: string | null
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_validated?: boolean | null
          owner_id?: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_type: Database["public"]["Enums"]["payment_type"]
          photo_justificatif?: string | null
          property_id?: string | null
          receipt_url?: string | null
          reference?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_validated?: boolean | null
          owner_id?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_type?: Database["public"]["Enums"]["payment_type"]
          photo_justificatif?: string | null
          property_id?: string | null
          receipt_url?: string | null
          reference?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
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
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          bathrooms: number | null
          bedrooms: number | null
          charges: number | null
          city: string
          commune: string | null
          created_at: string | null
          description: string | null
          equipments: Json | null
          featured: boolean | null
          features: Json | null
          floor: number | null
          id: string
          latitude: number | null
          longitude: number | null
          owner_id: string | null
          photos: string[] | null
          postal_code: string | null
          price: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          published: boolean | null
          quartier: string | null
          reference: string
          rental_price: number | null
          rooms: number | null
          status: Database["public"]["Enums"]["property_status"] | null
          surface_area: number | null
          title: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          videos: string[] | null
        }
        Insert: {
          address: string
          bathrooms?: number | null
          bedrooms?: number | null
          charges?: number | null
          city: string
          commune?: string | null
          created_at?: string | null
          description?: string | null
          equipments?: Json | null
          featured?: boolean | null
          features?: Json | null
          floor?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          owner_id?: string | null
          photos?: string[] | null
          postal_code?: string | null
          price?: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          published?: boolean | null
          quartier?: string | null
          reference: string
          rental_price?: number | null
          rooms?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          surface_area?: number | null
          title: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          videos?: string[] | null
        }
        Update: {
          address?: string
          bathrooms?: number | null
          bedrooms?: number | null
          charges?: number | null
          city?: string
          commune?: string | null
          created_at?: string | null
          description?: string | null
          equipments?: Json | null
          featured?: boolean | null
          features?: Json | null
          floor?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          owner_id?: string | null
          photos?: string[] | null
          postal_code?: string | null
          price?: number | null
          property_type?: Database["public"]["Enums"]["property_type"]
          published?: boolean | null
          quartier?: string | null
          reference?: string
          rental_price?: number | null
          rooms?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          surface_area?: number | null
          title?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          videos?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      prospects: {
        Row: {
          assigned_to: string | null
          budget: number | null
          created_at: string | null
          demand_type: Database["public"]["Enums"]["demand_type"]
          email: string
          first_name: string
          id: string
          last_contact_date: string | null
          last_name: string
          message: string | null
          notes: string | null
          phone: string | null
          property_id: string | null
          status: Database["public"]["Enums"]["prospect_status"] | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget?: number | null
          created_at?: string | null
          demand_type: Database["public"]["Enums"]["demand_type"]
          email: string
          first_name: string
          id?: string
          last_contact_date?: string | null
          last_name: string
          message?: string | null
          notes?: string | null
          phone?: string | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["prospect_status"] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget?: number | null
          created_at?: string | null
          demand_type?: Database["public"]["Enums"]["demand_type"]
          email?: string
          first_name?: string
          id?: string
          last_contact_date?: string | null
          last_name?: string
          message?: string | null
          notes?: string | null
          phone?: string | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["prospect_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospects_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospects_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          active: boolean | null
          address: string | null
          company_name: string
          contact_name: string
          created_at: string | null
          email: string
          id: string
          phone: string
          rating: number | null
          siret: string | null
          specialty: Database["public"]["Enums"]["intervention_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          company_name: string
          contact_name: string
          created_at?: string | null
          email: string
          id?: string
          phone: string
          rating?: number | null
          siret?: string | null
          specialty: Database["public"]["Enums"]["intervention_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          company_name?: string
          contact_name?: string
          created_at?: string | null
          email?: string
          id?: string
          phone?: string
          rating?: number | null
          siret?: string | null
          specialty?: Database["public"]["Enums"]["intervention_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          file_url: string | null
          generated_at: string | null
          id: string
          net_income: number | null
          owner_id: string
          period_end: string
          period_start: string
          report_type: Database["public"]["Enums"]["report_type"]
          sent_at: string | null
          total_expenses: number | null
          total_revenue: number | null
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          generated_at?: string | null
          id?: string
          net_income?: number | null
          owner_id: string
          period_end: string
          period_start: string
          report_type: Database["public"]["Enums"]["report_type"]
          sent_at?: string | null
          total_expenses?: number | null
          total_revenue?: number | null
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          generated_at?: string | null
          id?: string
          net_income?: number | null
          owner_id?: string
          period_end?: string
          period_start?: string
          report_type?: Database["public"]["Enums"]["report_type"]
          sent_at?: string | null
          total_expenses?: number | null
          total_revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string | null
          deposit_amount: number | null
          email: string
          first_name: string
          id: string
          id_card_number: string | null
          last_name: string
          monthly_rent: number | null
          notes: string | null
          phone: string | null
          property_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          email: string
          first_name: string
          id?: string
          id_card_number?: string | null
          last_name: string
          monthly_rent?: number | null
          notes?: string | null
          phone?: string | null
          property_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          email?: string
          first_name?: string
          id?: string
          id_card_number?: string | null
          last_name?: string
          monthly_rent?: number | null
          notes?: string | null
          phone?: string | null
          property_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          id: string
          message: string | null
          preferred_date: string
          property_id: string
          prospect_id: string | null
          status: Database["public"]["Enums"]["visit_status"] | null
          updated_at: string | null
          visitor_email: string
          visitor_name: string
          visitor_phone: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          preferred_date: string
          property_id: string
          prospect_id?: string | null
          status?: Database["public"]["Enums"]["visit_status"] | null
          updated_at?: string | null
          visitor_email: string
          visitor_name: string
          visitor_phone?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          preferred_date?: string
          property_id?: string
          prospect_id?: string | null
          status?: Database["public"]["Enums"]["visit_status"] | null
          updated_at?: string | null
          visitor_email?: string
          visitor_name?: string
          visitor_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
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
      booking_status: "en_attente" | "confirmee" | "annulee" | "terminee"
      contract_status: "brouillon" | "en_cours" | "termine" | "resilie"
      contract_type: "location" | "vente" | "gestion"
      demand_type: "visite" | "information" | "reservation"
      intervention_status:
        | "planifiee"
        | "en_cours"
        | "terminee"
        | "validee"
        | "annulee"
      intervention_type:
        | "plomberie"
        | "peinture"
        | "climatisation"
        | "maconnerie"
        | "nettoyage"
        | "electricite"
        | "jardinage"
        | "serrurerie"
        | "autre"
      notification_type:
        | "visite"
        | "reservation"
        | "prospect"
        | "intervention"
        | "paiement"
        | "rapport"
        | "contrat"
      payment_method:
        | "especes"
        | "mobile_money"
        | "carte"
        | "cheque"
        | "virement"
      payment_type: "loyer" | "acompte" | "reservation" | "caution" | "frais"
      property_status: "disponible" | "loue" | "vendu" | "reserve"
      property_type:
        | "appartement"
        | "maison"
        | "villa"
        | "terrain"
        | "bureau"
        | "commerce"
        | "immeuble"
        | "studio"
      prospect_status:
        | "nouveau"
        | "contacte"
        | "qualifie"
        | "negocie"
        | "converti"
        | "perdu"
      report_type: "mensuel" | "trimestriel" | "semestriel" | "annuel"
      transaction_type: "vente" | "location"
      user_role:
        | "admin"
        | "agent"
        | "secretary"
        | "accountant"
        | "provider"
        | "owner"
      visit_status: "en_attente" | "confirmee" | "effectuee" | "annulee"
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
      booking_status: ["en_attente", "confirmee", "annulee", "terminee"],
      contract_status: ["brouillon", "en_cours", "termine", "resilie"],
      contract_type: ["location", "vente", "gestion"],
      demand_type: ["visite", "information", "reservation"],
      intervention_status: [
        "planifiee",
        "en_cours",
        "terminee",
        "validee",
        "annulee",
      ],
      intervention_type: [
        "plomberie",
        "peinture",
        "climatisation",
        "maconnerie",
        "nettoyage",
        "electricite",
        "jardinage",
        "serrurerie",
        "autre",
      ],
      notification_type: [
        "visite",
        "reservation",
        "prospect",
        "intervention",
        "paiement",
        "rapport",
        "contrat",
      ],
      payment_method: [
        "especes",
        "mobile_money",
        "carte",
        "cheque",
        "virement",
      ],
      payment_type: ["loyer", "acompte", "reservation", "caution", "frais"],
      property_status: ["disponible", "loue", "vendu", "reserve"],
      property_type: [
        "appartement",
        "maison",
        "villa",
        "terrain",
        "bureau",
        "commerce",
        "immeuble",
        "studio",
      ],
      prospect_status: [
        "nouveau",
        "contacte",
        "qualifie",
        "negocie",
        "converti",
        "perdu",
      ],
      report_type: ["mensuel", "trimestriel", "semestriel", "annuel"],
      transaction_type: ["vente", "location"],
      user_role: [
        "admin",
        "agent",
        "secretary",
        "accountant",
        "provider",
        "owner",
      ],
      visit_status: ["en_attente", "confirmee", "effectuee", "annulee"],
    },
  },
} as const
