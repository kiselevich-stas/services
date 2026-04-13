import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { VacationPlan, VacationPlanStatus } from '../types/vacation'

export type VacationPlansSortMode =
    | 'startDateAsc'
    | 'startDateDesc'
    | 'createdAtDesc'
    | 'titleAsc'

export const useVacationStore = defineStore('vacation', () => {
    const search = ref('')
    const selectedStatus = ref<VacationPlanStatus | 'all'>('all')
    const sortMode = ref<VacationPlansSortMode>('startDateAsc')

    const isCreatePlanDialogOpen = ref(false)
    const isCreateDayDialogOpen = ref(false)
    const isCreateChecklistItemDialogOpen = ref(false)

    function setSearch(value: string): void {
        search.value = value
    }

    function setSelectedStatus(value: VacationPlanStatus | 'all'): void {
        selectedStatus.value = value
    }

    function setSortMode(value: VacationPlansSortMode): void {
        sortMode.value = value
    }

    function openCreatePlanDialog(): void {
        isCreatePlanDialogOpen.value = true
    }

    function closeCreatePlanDialog(): void {
        isCreatePlanDialogOpen.value = false
    }

    function openCreateDayDialog(): void {
        isCreateDayDialogOpen.value = true
    }

    function closeCreateDayDialog(): void {
        isCreateDayDialogOpen.value = false
    }

    function openCreateChecklistItemDialog(): void {
        isCreateChecklistItemDialogOpen.value = true
    }

    function closeCreateChecklistItemDialog(): void {
        isCreateChecklistItemDialogOpen.value = false
    }

    function resetFilters(): void {
        search.value = ''
        selectedStatus.value = 'all'
        sortMode.value = 'startDateAsc'
    }

    function filterPlans(plans: VacationPlan[]): VacationPlan[] {
        const normalizedSearch = search.value.trim().toLowerCase()

        let filteredPlans = [...plans]

        if (selectedStatus.value !== 'all') {
            filteredPlans = filteredPlans.filter(
                (plan) => plan.status === selectedStatus.value,
            )
        }

        if (normalizedSearch) {
            filteredPlans = filteredPlans.filter((plan) => {
                return [
                    plan.title,
                    plan.description,
                    plan.destination,
                ]
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedSearch)
            })
        }

        switch (sortMode.value) {
            case 'startDateAsc':
                filteredPlans.sort((firstPlan, secondPlan) => {
                    return (
                        new Date(firstPlan.startDate).getTime() -
                        new Date(secondPlan.startDate).getTime()
                    )
                })
                break

            case 'startDateDesc':
                filteredPlans.sort((firstPlan, secondPlan) => {
                    return (
                        new Date(secondPlan.startDate).getTime() -
                        new Date(firstPlan.startDate).getTime()
                    )
                })
                break

            case 'createdAtDesc':
                filteredPlans.sort((firstPlan, secondPlan) => {
                    return (
                        new Date(secondPlan.createdAt).getTime() -
                        new Date(firstPlan.createdAt).getTime()
                    )
                })
                break

            case 'titleAsc':
                filteredPlans.sort((firstPlan, secondPlan) =>
                    firstPlan.title.localeCompare(secondPlan.title),
                )
                break
        }

        return filteredPlans
    }

    const hasActiveFilters = computed(() => {
        return Boolean(
            search.value.trim() ||
            selectedStatus.value !== 'all' ||
            sortMode.value !== 'startDateAsc',
        )
    })

    return {
        search,
        selectedStatus,
        sortMode,

        isCreatePlanDialogOpen,
        isCreateDayDialogOpen,
        isCreateChecklistItemDialogOpen,

        hasActiveFilters,

        setSearch,
        setSelectedStatus,
        setSortMode,

        openCreatePlanDialog,
        closeCreatePlanDialog,

        openCreateDayDialog,
        closeCreateDayDialog,

        openCreateChecklistItemDialog,
        closeCreateChecklistItemDialog,

        resetFilters,
        filterPlans,
    }
})