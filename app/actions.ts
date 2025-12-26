'use server'

import { supabase } from '@/lib/supabase'

export type CallbackData = {
  name: string
  phone: string
  email?: string
  message?: string
}

export async function submitCallback(data: CallbackData) {
  try {
    const { error } = await supabase
      .from('callbacks')
      .insert([
        {
          client_name: data.name,
          client_phone: data.phone,
          client_email: data.email || null,
          message: data.message || null,
          status: 'pending'
        }
      ])
      .select()

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting callback:', error)
    return { success: false, error: 'Failed to submit request' }
  }
}