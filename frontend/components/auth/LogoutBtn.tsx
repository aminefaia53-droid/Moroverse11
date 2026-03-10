"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LogoutBtn() {
    const { lang } = useLanguage();
    const isAr = lang === "ar";
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setLoading(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.refresh();
        setLoading(false);
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 text-white/50 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-xl transition-all text-sm font-medium disabled:opacity-50 border border-transparent hover:border-red-500/20"
        >
            <LogOut className="w-4 h-4" />
            <span>{loading ? "..." : (isAr ? "خروج" : "Logout")}</span>
        </button>
    );
}
