import { computed, unref, type MaybeRef } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getHockeyTeamPage } from '../api/getHockeyTeamPage'

export function useHockeyTeamPage(
    teamId: MaybeRef<string>,
    stageId?: MaybeRef<string | undefined>,
) {
    const resolvedTeamId = computed(() => unref(teamId))
    const resolvedStageId = computed(() => unref(stageId))

    return useQuery({
        queryKey: computed(() => [
            'hockey-team-page',
            resolvedTeamId.value,
            resolvedStageId.value,
        ]),
        queryFn: () => getHockeyTeamPage(resolvedTeamId.value, resolvedStageId.value),
        enabled: computed(() => Boolean(resolvedTeamId.value)),
        retry: false,
    })
}