import { supabase} from "../../../lib/supabase.ts";

type GetHockeyTeamPageParams = {
    teamId: string
    stageId?: string
}

export async function getHockeyTeamPage(params: GetHockeyTeamPageParams) {
    const { data, error } = await supabase.functions.invoke('get-team-info', {
        body: {
            teamId: params.teamId,
            stageId: params.stageId,
        },
    })

    if (error) {
        throw new Error(error.message || 'Не удалось загрузить страницу команды')
    }

    return data?.item
}