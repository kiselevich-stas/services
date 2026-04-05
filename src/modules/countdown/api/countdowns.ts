import { supabase } from '../../../lib/supabase'
import type { CountdownEvent, CountdownFormValues, CountdownRow } from '../types/countdown'

function mapRow(row: CountdownRow): CountdownEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    targetDate: row.target_date,
    emoji: row.emoji,
    mood: row.mood,
    color: row.color,
    createdAt: row.created_at,
  }
}

export async function fetchCountdowns(userId: string): Promise<CountdownEvent[]> {
  const { data, error } = await supabase
    .from('countdowns')
    .select('*')
    .eq('user_id', userId)
    .order('target_date', { ascending: true })

  if (error) throw error

  return (data ?? []).map((row) => mapRow(row as CountdownRow))
}

export async function createCountdown(
  userId: string,
  values: CountdownFormValues,
): Promise<CountdownEvent> {
  const { data, error } = await supabase
    .from('countdowns')
    .insert({
      user_id: userId,
      title: values.title,
      description: values.description,
      target_date: values.targetDate,
      emoji: values.emoji,
      mood: values.mood,
      color: values.color,
    })
    .select('*')
    .single()

  if (error) throw error

  return mapRow(data as CountdownRow)
}

export async function updateCountdown(
  id: string,
  userId: string,
  values: CountdownFormValues,
): Promise<CountdownEvent> {
  const { data, error } = await supabase
    .from('countdowns')
    .update({
      title: values.title,
      description: values.description,
      target_date: values.targetDate,
      emoji: values.emoji,
      mood: values.mood,
      color: values.color,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw error

  return mapRow(data as CountdownRow)
}

export async function deleteCountdown(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('countdowns')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}
