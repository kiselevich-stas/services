import { computed, unref, type MaybeRefOrGetter} from "vue";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/vue-query'
import {createVacationDay, deleteVacationDay, updateVacationDay, fetchVacationDays} from "../api/days.ts";
import {createVacationChecklistItem, deleteVacationChecklistItem, toggleVacationChecklistItem, updateVacationChecklistItem, fetchVacationChecklistItems} from "../api/checklist.ts";
import {
    createVacationPlan,
    deleteVacationPlan,
    fetchVacationPlanById,
    fetchVacationPlanDetails,
    fetchVacationPlans,
    toggleVacationPlanFavorite,
    updateVacationPlan
} from "../api/plans.ts";

import {
    deleteChecklistItemFile,
    uploadChecklistItemFile
} from "../api/checklist-files.ts";

import {
    createVacationDayPoint,
    deleteVacationDayPoint,
    updateVacationDayPoint,
} from '../api/day-points'

import { vacationQueryKeys } from '../constants/queryKeys'
import type {
    VacationChecklistItemFormValues,
    VacationDayFormValues,
    VacationPlanFormValues,
    VacationDayPointFormValues
} from '../types/vacation'
export function useVacationPlansQuery(userId: MaybeRefOrGetter<string | null | undefined>) {
    return useQuery({
        queryKey: computed(() => {
            const resolvedUserId = unref(userId) ?? ''
            return vacationQueryKeys.plansList(resolvedUserId)
        }),
        queryFn: () => {
            const resolvedUserId = unref(userId)

            if (!resolvedUserId) {
                throw new Error('User id is required')
            }

            return fetchVacationPlans(resolvedUserId)
        },
        enabled: computed(() => Boolean(unref(userId))),
    })
}

export function useVacationPlanQuery(
    id: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    return useQuery({
        queryKey: computed(() => {
            const resolvedId = unref(id) ?? ''
            const resolvedUserId = unref(userId) ?? ''

            return vacationQueryKeys.planById(resolvedId, resolvedUserId)
        }),
        queryFn: () => {
            const resolvedId = unref(id)
            const resolvedUserId = unref(userId)

            if (!resolvedId || !resolvedUserId) {
                throw new Error('Plan id and user id are required')
            }

            return fetchVacationPlanById(resolvedId, resolvedUserId)
        },
        enabled: computed(() => Boolean(unref(id) && unref(userId))),
    })
}

export function useVacationPlanDetailsQuery(
    id: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    return useQuery({
        queryKey: computed(() => {
            const resolvedId = unref(id) ?? ''
            const resolvedUserId = unref(userId) ?? ''

            return vacationQueryKeys.planDetails(resolvedId, resolvedUserId)
        }),
        queryFn: () => {
            const resolvedId = unref(id)
            const resolvedUserId = unref(userId)

            if (!resolvedId || !resolvedUserId) {
                throw new Error('Plan id and user id are required')
            }

            return fetchVacationPlanDetails(resolvedId, resolvedUserId)
        },
        enabled: computed(() => Boolean(unref(id) && unref(userId))),
    })
}

export function useVacationDaysQuery(
    planId: MaybeRefOrGetter<string | null | undefined>,
) {
    return useQuery({
        queryKey: computed(() => vacationQueryKeys.days(unref(planId) ?? '')),
        queryFn: () => {
            const resolvedPlanId = unref(planId)

            if (!resolvedPlanId) {
                throw new Error('Plan id is required')
            }

            return fetchVacationDays(resolvedPlanId)
        },
        enabled: computed(() => Boolean(unref(planId))),
    })
}

export function useVacationChecklistQuery(
    planId: MaybeRefOrGetter<string | null | undefined>,
) {
    return useQuery({
        queryKey: computed(() => vacationQueryKeys.checklist(unref(planId) ?? '')),
        queryFn: () => {
            const resolvedPlanId = unref(planId)

            if (!resolvedPlanId) {
                throw new Error('Plan id is required')
            }

            return fetchVacationChecklistItems(resolvedPlanId)
        },
        enabled: computed(() => Boolean(unref(planId))),
    })
}

export function useCreateVacationPlanMutation(
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (values: VacationPlanFormValues) => {
            const resolvedUserId = unref(userId)

            if (!resolvedUserId) {
                throw new Error('User id is required')
            }

            return createVacationPlan(resolvedUserId, values)
        },
        onSuccess: async () => {
            const resolvedUserId = unref(userId)

            if (!resolvedUserId) {
                return
            }

            await queryClient.invalidateQueries({
                queryKey: vacationQueryKeys.plansList(resolvedUserId),
            })
        },
    })
}

export function useUpdateVacationPlanMutation(
    id: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (values: VacationPlanFormValues) => {
            const resolvedId = unref(id)
            const resolvedUserId = unref(userId)

            if (!resolvedId || !resolvedUserId) {
                throw new Error('Plan id and user id are required')
            }

            return updateVacationPlan(resolvedId, resolvedUserId, values)
        },
        onSuccess: async (_, __) => {
            const resolvedId = unref(id)
            const resolvedUserId = unref(userId)

            if (!resolvedId || !resolvedUserId) {
                return
            }

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: vacationQueryKeys.plansList(resolvedUserId),
                }),
                queryClient.invalidateQueries({
                    queryKey: vacationQueryKeys.planById(resolvedId, resolvedUserId),
                }),
                queryClient.invalidateQueries({
                    queryKey: vacationQueryKeys.planDetails(resolvedId, resolvedUserId),
                }),
            ])
        },
    })
}

export function useDeleteVacationPlanMutation(
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const resolvedUserId = unref(userId)

            if (!resolvedUserId) {
                throw new Error('User id is required')
            }

            await deleteVacationPlan(id, resolvedUserId)
            return id
        },
        onSuccess: async () => {
            const resolvedUserId = unref(userId)

            if (!resolvedUserId) {
                return
            }

            await queryClient.invalidateQueries({
                queryKey: vacationQueryKeys.plansList(resolvedUserId),
            })
        },
    })
}

export function useToggleVacationPlanFavoriteMutation(
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { id: string; isFavorite: boolean }) => {
            const resolvedUserId = unref(userId)

            if (!resolvedUserId) {
                throw new Error('User id is required')
            }

            return toggleVacationPlanFavorite(
                payload.id,
                resolvedUserId,
                payload.isFavorite,
            )
        },
        onSuccess: async (plan) => {
            const resolvedUserId = unref(userId)

            if (!resolvedUserId) {
                return
            }

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: vacationQueryKeys.plansList(resolvedUserId),
                }),
                queryClient.invalidateQueries({
                    queryKey: vacationQueryKeys.planById(plan.id, resolvedUserId),
                }),
                queryClient.invalidateQueries({
                    queryKey: vacationQueryKeys.planDetails(plan.id, resolvedUserId),
                }),
            ])
        },
    })
}

export function useCreateVacationDayMutation(
    planId: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (values: VacationDayFormValues) => {
            const resolvedPlanId = unref(planId)

            if (!resolvedPlanId) {
                throw new Error('Plan id is required')
            }

            return createVacationDay(resolvedPlanId, values)
        },
        onSuccess: async () => {
            const resolvedPlanId = unref(planId)
            const resolvedUserId = unref(userId)

            if (!resolvedPlanId) {
                return
            }

            const invalidateTasks = [
                queryClient.invalidateQueries({
                    queryKey: vacationQueryKeys.days(resolvedPlanId),
                }),
            ]

            if (resolvedUserId) {
                invalidateTasks.push(
                    queryClient.invalidateQueries({
                        queryKey: vacationQueryKeys.planDetails(resolvedPlanId, resolvedUserId),
                    }),
                )
            }

            await Promise.all(invalidateTasks)
        },
    })
}

export function useUpdateVacationDayMutation(
    planId: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { id: string; values: VacationDayFormValues }) => {
            return updateVacationDay(payload.id, payload.values)
        },
        onSuccess: async () => {
            const resolvedPlanId = unref(planId)
            const resolvedUserId = unref(userId)

            if (!resolvedPlanId) {
                return
            }

            const invalidateTasks = [
                queryClient.invalidateQueries({
                    queryKey: vacationQueryKeys.days(resolvedPlanId),
                }),
            ]

            if (resolvedUserId) {
                invalidateTasks.push(
                    queryClient.invalidateQueries({
                        queryKey: vacationQueryKeys.planDetails(resolvedPlanId, resolvedUserId),
                    }),
                )
            }

            await Promise.all(invalidateTasks)
        },
    })
}

export function useDeleteVacationDayMutation(
    planId: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteVacationDay(id)
            return id
        },
        onSuccess: async () => {
            const resolvedPlanId = unref(planId)
            const resolvedUserId = unref(userId)

            if (!resolvedPlanId) {
                return
            }

            const invalidateTasks = [
                queryClient.invalidateQueries({
                    queryKey: vacationQueryKeys.days(resolvedPlanId),
                }),
            ]

            if (resolvedUserId) {
                invalidateTasks.push(
                    queryClient.invalidateQueries({
                        queryKey: vacationQueryKeys.planDetails(resolvedPlanId, resolvedUserId),
                    }),
                )
            }

            await Promise.all(invalidateTasks)
        },
    })
}

export function useCreateVacationChecklistItemMutation(
    planId: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (values: VacationChecklistItemFormValues) => {
            const resolvedPlanId = unref(planId)

            if (!resolvedPlanId) {
                throw new Error('Plan id is required')
            }

            return createVacationChecklistItem(resolvedPlanId, values)
        },
        onSuccess: async () => {
            const resolvedPlanId = unref(planId)
            const resolvedUserId = unref(userId)

            if (!resolvedPlanId) {
                return
            }

            const invalidateTasks = [
                queryClient.invalidateQueries({
                    queryKey: vacationQueryKeys.checklist(resolvedPlanId),
                }),
            ]

            if (resolvedUserId) {
                invalidateTasks.push(
                    queryClient.invalidateQueries({
                        queryKey: vacationQueryKeys.planDetails(resolvedPlanId, resolvedUserId),
                    }),
                )
            }

            await Promise.all(invalidateTasks)
        },
    })
}

export function useUpdateVacationChecklistItemMutation(
    planId: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: {
            id: string
            values: VacationChecklistItemFormValues
        }) => {
            return updateVacationChecklistItem(payload.id, payload.values)
        },
        onSuccess: async () => {
            const resolvedPlanId = unref(planId)
            const resolvedUserId = unref(userId)

            if (!resolvedPlanId) {
                return
            }

            const invalidateTasks = [
                queryClient.invalidateQueries({
                    queryKey: vacationQueryKeys.checklist(resolvedPlanId),
                }),
            ]

            if (resolvedUserId) {
                invalidateTasks.push(
                    queryClient.invalidateQueries({
                        queryKey: vacationQueryKeys.planDetails(resolvedPlanId, resolvedUserId),
                    }),
                )
            }

            await Promise.all(invalidateTasks)
        },
    })
}

export function useToggleVacationChecklistItemMutation(
    planId: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { id: string; isDone: boolean }) => {
            return toggleVacationChecklistItem(payload.id, payload.isDone)
        },
        onSuccess: async () => {
            const resolvedPlanId = unref(planId)
            const resolvedUserId = unref(userId)

            if (!resolvedPlanId) {
                return
            }

            const invalidateTasks = [
                queryClient.invalidateQueries({
                    queryKey: vacationQueryKeys.checklist(resolvedPlanId),
                }),
            ]

            if (resolvedUserId) {
                invalidateTasks.push(
                    queryClient.invalidateQueries({
                        queryKey: vacationQueryKeys.planDetails(resolvedPlanId, resolvedUserId),
                    }),
                )
            }

            await Promise.all(invalidateTasks)
        },
    })
}

export function useDeleteVacationChecklistItemMutation(
    planId: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteVacationChecklistItem(id)
            return id
        },
        onSuccess: async () => {
            const resolvedPlanId = unref(planId)
            const resolvedUserId = unref(userId)

            if (!resolvedPlanId) {
                return
            }

            const invalidateTasks = [
                queryClient.invalidateQueries({
                    queryKey: vacationQueryKeys.checklist(resolvedPlanId),
                }),
            ]

            if (resolvedUserId) {
                invalidateTasks.push(
                    queryClient.invalidateQueries({
                        queryKey: vacationQueryKeys.planDetails(resolvedPlanId, resolvedUserId),
                    }),
                )
            }

            await Promise.all(invalidateTasks)
        },
    })
}
export function useUploadChecklistItemFileMutation(
    planId: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: {
            checklistItemId: string
            file: File
            fileType: 'document' | 'ticket'
        }) => {
            const resolvedUserId = unref(userId)

            if (!resolvedUserId) {
                throw new Error('User id is required')
            }

            return uploadChecklistItemFile({
                checklistItemId: payload.checklistItemId,
                userId: resolvedUserId,
                file: payload.file,
                fileType: payload.fileType,
            })
        },
        onSuccess: async () => {
            const resolvedPlanId = unref(planId)
            const resolvedUserId = unref(userId)

            if (!resolvedPlanId || !resolvedUserId) {
                return
            }

            await queryClient.invalidateQueries({
                queryKey: vacationQueryKeys.planDetails(resolvedPlanId, resolvedUserId),
            })
        },
    })
}

export function useDeleteChecklistItemFileMutation(
    planId: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteChecklistItemFile(id)
        },
        onSuccess: async () => {
            const resolvedPlanId = unref(planId)
            const resolvedUserId = unref(userId)

            if (!resolvedPlanId || !resolvedUserId) {
                return
            }

            await queryClient.invalidateQueries({
                queryKey: vacationQueryKeys.planDetails(resolvedPlanId, resolvedUserId),
            })
        },
    })
}
export function useCreateVacationDayPointMutation(
    planId: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: {
            dayId: string
            values: VacationDayPointFormValues
        }) => {
            const resolvedUserId = unref(userId)

            if (!payload.dayId || !resolvedUserId) {
                throw new Error('Day id and user id are required')
            }

            return createVacationDayPoint(payload.dayId, resolvedUserId, payload.values)
        },
        onSuccess: async () => {
            const resolvedPlanId = unref(planId)
            const resolvedUserId = unref(userId)

            if (!resolvedPlanId || !resolvedUserId) {
                return
            }

            await queryClient.invalidateQueries({
                queryKey: vacationQueryKeys.planDetails(resolvedPlanId, resolvedUserId),
            })
        },
    })
}

export function useUpdateVacationDayPointMutation(
    planId: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { id: string; values: VacationDayPointFormValues }) => {
            return updateVacationDayPoint(payload.id, payload.values)
        },
        onSuccess: async () => {
            const resolvedPlanId = unref(planId)
            const resolvedUserId = unref(userId)

            if (!resolvedPlanId || !resolvedUserId) {
                return
            }

            await queryClient.invalidateQueries({
                queryKey: vacationQueryKeys.planDetails(resolvedPlanId, resolvedUserId),
            })
        },
    })
}

export function useDeleteVacationDayPointMutation(
    planId: MaybeRefOrGetter<string | null | undefined>,
    userId: MaybeRefOrGetter<string | null | undefined>,
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteVacationDayPoint(id)
        },
        onSuccess: async () => {
            const resolvedPlanId = unref(planId)
            const resolvedUserId = unref(userId)

            if (!resolvedPlanId || !resolvedUserId) {
                return
            }

            await queryClient.invalidateQueries({
                queryKey: vacationQueryKeys.planDetails(resolvedPlanId, resolvedUserId),
            })
        },
    })
}
