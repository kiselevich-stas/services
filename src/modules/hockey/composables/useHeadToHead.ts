import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'
import { getHeadToHeadSummary} from "../api/hockey.functions.ts";
import { useHockeyStore } from '../store/useHockeyStore'

export const hockeyPairSchema = z
  .object({
    teamAId: z.string().min(1, 'Выберите первую команду'),
    teamBId: z.string().min(1, 'Выберите вторую команду'),
    stageId: z.string().min(1, 'Выберите сезон или стадию'),
  })
  .superRefine((value, context) => {
    if (value.teamAId === value.teamBId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['teamBId'],
        message: 'Команды должны отличаться',
      })
    }
  })

export function useHeadToHead(filters: {
  teamAId: string
  teamBId: string
  stageId: string
}) {
  const hockeyStore = useHockeyStore()

  const parsedFilters = computed(() => hockeyPairSchema.safeParse(filters))

  return useQuery({
    queryKey: computed(() => [
      'hockey',
      'head-to-head',
      filters.teamAId,
      filters.teamBId,
      filters.stageId,
    ]),
    enabled: computed(() => parsedFilters.value.success && hockeyStore.isLoaded),
    queryFn: async () => {
      const parsed = hockeyPairSchema.parse(filters)

      return getHeadToHeadSummary({
        teamAId: Number(parsed.teamAId),
        teamBId: Number(parsed.teamBId),
        stageId: Number(parsed.stageId),
        stages: hockeyStore.stages,
        teams: hockeyStore.teams,
      })
    },
  })
}
