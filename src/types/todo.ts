export type PriorityLevel = 1 | 2 | 3 | 4 | 5;

export const PRIORITY_LABELS: Record<PriorityLevel, { name: string, icon: string }> = {
    1: { name: "Critical", icon: "🔴" },
    2: { name: "High", icon: "🟠" },
    3: { name: "Medium", icon: "🟡" },
    4: { name: "Low", icon: "🟢" },
    5: { name: "Very Low", icon: "⚪" },
};

export interface TodoItem {
    id: number;
    text: string;
    status: boolean;
    createdAt: number;
    priority: PriorityLevel;
    completedAt?: number;
    category?: string;
}