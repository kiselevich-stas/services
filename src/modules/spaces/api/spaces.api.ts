import { supabase } from '../../../lib/supabase'
import type {
  CreateSpaceInvitePayload,
  CreateSpacePayload,
  Space,
  SpaceCardModel,
  SpaceDetailsModel,
  SpaceInvite,
  SpaceMeeting,
  SpaceMember,
} from '../types/spaces.types'

function assertNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Поле "${fieldName}" обязательно для заполнения`)
  }
}

function assertValidRole(role: unknown): asserts role is 'member' | 'admin' {
  if (role !== 'member' && role !== 'admin') {
    throw new Error('Некорректная роль приглашения')
  }
}

function assertValidDateOrNull(value: unknown, fieldName: string): asserts value is string | null {
  if (value === null || value === undefined || value === '') {
    return
  }

  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new Error(`Поле "${fieldName}" содержит некорректную дату`)
  }
}

function assertValidCreateSpacePayload(payload: CreateSpacePayload) {
  assertNonEmptyString(payload.title, 'Название пространства')
  assertNonEmptyString(payload.color, 'Цвет пространства')
  assertNonEmptyString(payload.visibility, 'Видимость пространства')
  assertNonEmptyString(payload.join_policy, 'Политика вступления')

  if (
      payload.description !== null &&
      payload.description !== undefined &&
      typeof payload.description !== 'string'
  ) {
    throw new Error('Описание пространства должно быть строкой')
  }
}

function assertValidCreateSpaceInvitePayload(payload: CreateSpaceInvitePayload) {
  assertNonEmptyString(payload.spaceId, 'ID пространства')
  assertValidRole(payload.role)
  assertValidDateOrNull(payload.expiresAt, 'Дата окончания действия ссылки')
}

function normalizeProfile<T>(profile: T | T[] | null | undefined): T | null {
  if (Array.isArray(profile)) {
    return profile[0] ?? null
  }

  return profile ?? null
}

async function getRequiredUser() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    throw authError
  }

  if (!user) {
    throw new Error('Нужно авторизоваться')
  }

  return user
}

export async function fetchSpaces(): Promise<SpaceCardModel[]> {
  const { data: spaces, error: spacesError } = await supabase
      .from('spaces')
      .select('*')
      .order('updated_at', { ascending: false })

  if (spacesError) {
    throw spacesError
  }

  if (!spaces?.length) {
    return []
  }

  const spaceIds = spaces.map((space) => space.id)

  const [
    { data: members, error: membersError },
  ] = await Promise.all([
    supabase
        .from('space_members')
        .select(`
        id,
        space_id,
        user_id,
        profiles!space_members_user_id_profiles_fkey (
          id,
          first_name,
          last_name,
          avatar_url,
          email
        )
      `)
        .in('space_id', spaceIds)
        .eq('status', 'active'),
  ])

  if (membersError) {
    throw membersError
  }

  const membersBySpace = new Map<string, SpaceCardModel['members_preview']>()
  const membersCountBySpace = new Map<string, number>()
  const nextMeetingBySpace = new Map<string, SpaceMeeting>()

  for (const member of members ?? []) {
    const list = membersBySpace.get(member.space_id) ?? []
    const profile = normalizeProfile(member.profiles)

    if (profile && list.length < 6) {
      list.push(profile)
    }

    membersBySpace.set(member.space_id, list)
    membersCountBySpace.set(
        member.space_id,
        (membersCountBySpace.get(member.space_id) ?? 0) + 1,
    )
  }

  return (spaces as Space[]).map((space) => ({
    ...space,
    members_count: membersCountBySpace.get(space.id) ?? 0,
    next_meeting: nextMeetingBySpace.get(space.id) ?? null,
    members_preview: membersBySpace.get(space.id) ?? [],
  }))
}

export async function fetchSpaceDetails(spaceId: string): Promise<SpaceDetailsModel> {
  assertNonEmptyString(spaceId, 'ID пространства')

  const normalizedSpaceId = spaceId.trim()

  const [
    { data: space, error: spaceError },
    { data: members, error: membersError },
    { data: invites, error: invitesError },
  ] = await Promise.all([
    supabase
        .from('spaces')
        .select('*')
        .eq('id', normalizedSpaceId)
        .maybeSingle(),
    supabase
        .from('space_members')
        .select(`
        *,
        profiles!space_members_user_id_profiles_fkey (
          id,
          first_name,
          last_name,
          avatar_url,
          email
        )
      `)
        .eq('space_id', normalizedSpaceId)
        .eq('status', 'active')
        .order('created_at', { ascending: true }),
    supabase
        .from('space_invites')
        .select('*')
        .eq('space_id', normalizedSpaceId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1),
  ])

  if (spaceError) {
    throw spaceError
  }

  if (!space) {
    throw new Error('Пространство не найдено или недоступно')
  }

  if (membersError) {
    throw membersError
  }

  if (invitesError) {
    throw invitesError
  }

  return {
    space: space as Space,
    members: (members ?? []).map((member) => ({
      ...member,
      profile: normalizeProfile(member.profiles),
    })) as SpaceMember[],
    activeInvite: ((invites ?? [])[0] ?? null) as SpaceInvite | null,
  }
}

export async function createSpace(payload: CreateSpacePayload): Promise<Space> {
  assertValidCreateSpacePayload(payload)
  await getRequiredUser()

  const { data, error } = await supabase.rpc('create_space', {
    p_title: payload.title.trim(),
    p_description: payload.description?.trim() || null,
    p_color: payload.color,
    p_visibility: payload.visibility,
    p_join_policy: payload.join_policy,
  })

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error('Не удалось создать пространство')
  }

  return data as Space
}

export async function createSpaceInvite(payload: CreateSpaceInvitePayload): Promise<SpaceInvite> {
  assertValidCreateSpaceInvitePayload(payload)
  await getRequiredUser()

  const { data, error } = await supabase.rpc('create_space_invite', {
    p_space_id: payload.spaceId.trim(),
    p_role: payload.role,
    p_expires_at: payload.expiresAt,
  })

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error('Не удалось создать ссылку-приглашение')
  }

  return data as SpaceInvite
}

export async function fetchInviteByCode(
    code: string,
): Promise<(SpaceInvite & {
  space: Pick<Space, 'id' | 'title' | 'description' | 'color'> | null
}) | null> {
  assertNonEmptyString(code, 'Код приглашения')

  const normalizedCode = code.trim()

  const { data, error } = await supabase
      .from('space_invites')
      .select('*, spaces(id, title, description, color)')
      .eq('code', normalizedCode)
      .eq('is_active', true)
      .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  return {
    ...data,
    space: normalizeProfile(data.spaces),
  }
}

export async function joinSpaceByCode(code: string): Promise<{ spaceId: string }> {
  assertNonEmptyString(code, 'Код приглашения')
  await getRequiredUser()

  const normalizedCode = code.trim()

  const { data, error } = await supabase.rpc('join_space_by_code', {
    p_code: normalizedCode,
  })

  if (error) {
    throw error
  }

  if (typeof data !== 'string' || !data.trim()) {
    throw new Error('Сервер вернул некорректный идентификатор пространства')
  }

  return { spaceId: data }
}