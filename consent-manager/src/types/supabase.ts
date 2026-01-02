export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      consents: {
        Row: {
          id: string
          user_id: string
          consent_type: string
          purpose: string
          policy_version: string
          status: 'granted' | 'revoked'
          created_at: string
          revoked_at: string | null
          previous_consent_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          consent_type: string
          purpose: string
          policy_version: string
          status: 'granted' | 'revoked'
          created_at?: string
          revoked_at?: string | null
          previous_consent_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          consent_type?: string
          purpose?: string
          policy_version?: string
          status?: 'granted' | 'revoked'
          created_at?: string
          revoked_at?: string | null
          previous_consent_id?: string | null
        }
      }
    }
  }
}
