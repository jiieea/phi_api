import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    readonly client: SupabaseClient;

    constructor() {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_KEY;
        if (!url || !key) throw new Error("Supabase Key or url is missing")
        this.client = createClient(url, key, {
            auth: { persistSession: true, autoRefreshToken: true }
        })
    }

}
