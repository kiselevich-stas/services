import {computed, toValue} from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getHockeyTeamEloSnapshots } from '../api/getHockeyTeamEloSnapshots'
import type { MaybeRefOrGetter } from 'vue'
export function useHockeyTeamEloSnapshots(
    teamId: MaybeRefOrGetter<string>,
    seasonId: MaybeRefOrGetter<string | undefined>,
    stageId?: MaybeRefOrGetter<string | undefined>,
) {
    return useQuery({
        queryKey: [
            'hockey-team-elo-snapshots',
            computed(() => toValue(teamId)),
            computed(() => toValue(seasonId)),
            computed(() => toValue(stageId)),
        ],
        queryFn: () =>
            getHockeyTeamEloSnapshots({
                teamId: toValue(teamId),
                seasonId: toValue(seasonId),
                stageId: toValue(stageId),
            }),
        enabled: computed(() => Boolean(toValue(teamId) && toValue(seasonId))),
        retry: false,
    })
}