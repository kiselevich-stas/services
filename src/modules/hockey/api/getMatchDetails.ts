import { supabase} from "../../../lib/supabase.ts";

export async function getMatchDetails(matchId: number | string, locale = 'ru') {
    const { data, error } = await supabase.functions.invoke('hockey-match-details', {
        body: {
            matchId,
            locale,
        },
    })

    if (error) {
        throw error
    }

    return data?.item
}