export interface Consent {
    id: string;
    user_id: string;
    consent_type: string; // e.g., 'terms_of_service', 'marketing_emails'
    purpose: string;
    policy_version: string;
    status: 'granted' | 'revoked';
    created_at: string;
    revoked_at?: string | null;
    previous_consent_id?: string | null;
}

export type ConsentStatus = 'granted' | 'revoked';

export interface ConsentLogFilters {
    user_id?: string;
    consent_type?: string;
    status?: ConsentStatus;
    startDate?: Date;
    endDate?: Date;
}
