import { createClient } from '../utils/supabase/client';

const supabase = createClient();

export class DashboardService {
    
    /**
     * Verify if current session belongs to an administrator.
     */
    static async checkAdminStatus(userId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', userId)
            .single();
        
        if (error) return false;
        return data?.is_admin || false;
    }

    /**
     * Fetch audit logs for the security fortress.
     */
    static async getAuditLogs(): Promise<any[]> {
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*, profiles:admin_id(full_name, username)')
            .order('created_at', { ascending: false })
            .limit(100);
            
        if (error) throw error;
        return data || [];
    }

    /**
     * Administrative Post Deletion (will trigger DB audit log)
     */
    static async deletePost(id: string): Promise<void> {
        const { error } = await supabase
            .from('community_posts')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
}
