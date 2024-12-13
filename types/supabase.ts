// types/supabase.ts
export interface SupabaseUser {
    id: string;
    email: string;
    aud: string;
    role: string;
    app_metadata: any;
    user_metadata: any;
    created_at: string;
    updated_at: string;
  }


 export interface WorkqueueItem {
    position: number | null;
    received_at: Date;
    last_updated_at: Date;
    identifier:  string | null;
    status_id: number | 1;
    extension_date_id: number | null;
    [key: string]: any; // Allow extra properties
}

export interface StatusItem {
  id: number;
  name_internal: string;
  name_external: string;
  description: string;
}