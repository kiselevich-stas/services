export const vacationQueryKeys = {
    all: ['vacation'] as const,

    plans: () => [...vacationQueryKeys.all, 'plans'] as const,
    plansList: (userId: string) =>
        [...vacationQueryKeys.plans(), 'list', userId] as const,

    plan: () => [...vacationQueryKeys.all, 'plan'] as const,
    planById: (id: string, userId: string) =>
        [...vacationQueryKeys.plan(), 'by-id', id, userId] as const,

    planDetails: (id: string, userId: string) =>
        [...vacationQueryKeys.plan(), 'details', id, userId] as const,

    days: (planId: string) =>
        [...vacationQueryKeys.all, 'days', planId] as const,

    checklist: (planId: string) =>
        [...vacationQueryKeys.all, 'checklist', planId] as const,
}