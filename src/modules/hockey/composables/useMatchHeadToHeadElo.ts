import { computed, toValue } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'

import { getMatchHeadToHeadElo } from '../api/getMatchHeadToHeadElo'

export function useMatchHeadToHeadElo(
    teamAId: MaybeRefOrGetter<string | undefined>,
    teamBId: MaybeRefOrGetter<string | undefined>,
    seasonId?: MaybeRefOrGetter<string | undefined>,
    stageId?: MaybeRefOrGetter<string | undefined>,
) {
    return useQuery({
        queryKey: [
            'match-head-to-head-elo',
            computed(() => toValue(teamAId)),
            computed(() => toValue(teamBId)),
            computed(() => toValue(seasonId)),
            computed(() => toValue(stageId)),
        ],
        queryFn: () =>
            getMatchHeadToHeadElo({
                teamAId: String(toValue(teamAId)),
                teamBId: String(toValue(teamBId)),
                seasonId: toValue(seasonId),
                stageId: toValue(stageId),
            }),
        enabled: computed(() => Boolean(toValue(teamAId) && toValue(teamBId))),
        retry: false,
    })
}