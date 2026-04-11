import {computed, toValue} from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getHockeyTeamPage} from "../api/getHockeyTeamPage.ts";
import type { MaybeRefOrGetter } from 'vue'
export function useHockeyTeamPage(
    teamId: MaybeRefOrGetter<string>,
    stageId: MaybeRefOrGetter<string | undefined>,
) {
    return useQuery({
        queryKey: ['hockey-team-page', toValue(teamId), toValue(stageId)],
        queryFn: () =>
            getHockeyTeamPage({
                teamId: toValue(teamId),
                stageId: toValue(stageId),
            }),
        enabled: computed(() => Boolean(toValue(teamId) && toValue(stageId))),
    })
}