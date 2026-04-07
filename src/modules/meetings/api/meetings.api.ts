import { supabase } from '../../../lib/supabase'
import type {
    Meeting,
    MeetingCreatePayload,
    MeetingDetails,
    MeetingParticipant,
    MeetingVoteStatus,
} from '../types'

export async function getMeetings(): Promise<Meeting[]> {
    const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('starts_at', { ascending: true })

    if (error) {
        throw error
    }

    return (data ?? []) as Meeting[]
}

export async function getMeetingById(meetingId: string): Promise<MeetingDetails | null> {
    const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', meetingId)
        .single()

    if (meetingError) {
        throw meetingError
    }

    const { data: participants, error: participantsError } = await supabase
        .from('meeting_participants')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('created_at', { ascending: true })

    if (participantsError) {
        throw participantsError
    }

    return {
        ...(meeting as Meeting),
        participants: (participants ?? []) as MeetingParticipant[],
    }
}

export async function createMeeting(payload: MeetingCreatePayload): Promise<Meeting> {
    const insertPayload = {
        title: payload.title,
        description: payload.description || '',
        creator_id: payload.creatorId,
        place_id: payload.place.id || null,
        place_title: payload.place.name,
        place_subtitle: null,
        place_address: payload.place.address,
        place_latitude: payload.place.lat,
        place_longitude: payload.place.lng,
        place_uri: null,
        place_image_url: payload.placeImageUrl || null,
        place_kind: payload.place.kind || 'point',
        starts_at: payload.startsAt,
    }

    console.log('createMeeting payload', insertPayload)

    const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .insert(insertPayload)
        .select()
        .single()

    if (meetingError) {
        throw meetingError
    }

    if (payload.invitedUserIds.length > 0) {
        const rows = payload.invitedUserIds.map((userId) => ({
            meeting_id: meeting.id,
            user_id: userId,
            status: 'pending' as const,
        }))

        const { error: participantsError } = await supabase
            .from('meeting_participants')
            .insert(rows)

        if (participantsError) {
            throw participantsError
        }
    }

    return meeting as Meeting
}

export async function updateVote(meetingId: string, userId: string, status: MeetingVoteStatus) {
    const { error } = await supabase
        .from('meeting_participants')
        .update({ status })
        .eq('meeting_id', meetingId)
        .eq('user_id', userId)

    if (error) {
        throw error
    }
}