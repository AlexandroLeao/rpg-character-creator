import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { createUserDatabaseClient } from '../lib/supabase.js'
import {
  validateCharacterInput,
  type CharacterInput,
} from '../lib/characterValidation.js'

export const characterRouter = Router()

const characterColumns = `
  id,
  name,
  character_class,
  ancestry,
  background,
  weapon,
  artifact,
  personality,
  aura,
  companion,
  created_at,
  updated_at
` as const

type CharacterRow = {
  id: string
  name: string
  character_class: string
  ancestry: string
  background: string
  weapon: string
  artifact: string
  personality: string
  aura: string
  companion: string
  created_at: string
  updated_at: string
}

function toPublicCharacter(character: CharacterRow) {
  return {
    id: character.id,
    name: character.name,
    characterClass: character.character_class,
    ancestry: character.ancestry,
    background: character.background,
    weapon: character.weapon,
    artifact: character.artifact,
    personality: character.personality,
    aura: character.aura,
    companion: character.companion,
    createdAt: character.created_at,
    updatedAt: character.updated_at,
  }
}

function toDatabaseFields(input: CharacterInput) {
  return {
    name: input.name,
    character_class: input.characterClass,
    ancestry: input.ancestry,
    background: input.background,
    weapon: input.weapon,
    artifact: input.artifact,
    personality: input.personality,
    aura: input.aura,
    companion: input.companion,
  }
}

async function updateUserCharacter(
  supabase: ReturnType<typeof createUserDatabaseClient>,
  userId: string,
  fields: ReturnType<typeof toDatabaseFields>,
) {
  return supabase
    .from('characters')
    .update(fields)
    .eq('user_id', userId)
    .select(characterColumns)
    .maybeSingle()
}

characterRouter.get('/me', requireAuth, async (_req, res) => {
  const userId = res.locals.authenticatedUserId as string

  const accessToken =
    res.locals.authenticatedAccessToken as string

  try {
    const supabase = createUserDatabaseClient(accessToken)

    const { data, error } = await supabase
      .from('characters')
      .select(characterColumns)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      res.status(503).json({
        error: 'Character storage unavailable',
      })
      return
    }

    if (!data) {
      res.status(404).json({
        error: 'Character not found',
      })
      return
    }

    res.status(200).json({
      character: toPublicCharacter(data),
    })
  } catch {
    res.status(503).json({
      error: 'Character storage unavailable',
    })
  }
})

characterRouter.put('/me', requireAuth, async (req, res) => {
  const validation = validateCharacterInput(req.body)

  if (!validation.success) {
    res.status(400).json({
      error: 'Invalid character data',
      details: validation.errors,
    })
    return
  }

  const userId = res.locals.authenticatedUserId as string

  const accessToken =
    res.locals.authenticatedAccessToken as string

  const fields = toDatabaseFields(validation.data)

  try {
    const supabase = createUserDatabaseClient(accessToken)

    const updateResult = await updateUserCharacter(
      supabase,
      userId,
      fields,
    )

    if (updateResult.error) {
      res.status(503).json({
        error: 'Character storage unavailable',
      })
      return
    }

    if (updateResult.data) {
      res.status(200).json({
        character: toPublicCharacter(updateResult.data),
      })
      return
    }

    const insertResult = await supabase
      .from('characters')
      .insert({
        user_id: userId,
        ...fields,
      })
      .select(characterColumns)
      .single()

    if (insertResult.error?.code === '23505') {
      const retryResult = await updateUserCharacter(
        supabase,
        userId,
        fields,
      )

      if (retryResult.error) {
        res.status(503).json({
          error: 'Character storage unavailable',
        })
        return
      }

      if (!retryResult.data) {
        res.status(409).json({
          error: 'Character changed. Please retry.',
        })
        return
      }

      res.status(200).json({
        character: toPublicCharacter(retryResult.data),
      })
      return
    }

    if (insertResult.error || !insertResult.data) {
      res.status(503).json({
        error: 'Character storage unavailable',
      })
      return
    }

    res.status(201).json({
      character: toPublicCharacter(insertResult.data),
    })
  } catch {
    res.status(503).json({
      error: 'Character storage unavailable',
    })
  }
})

characterRouter.delete('/me', requireAuth, async (_req, res) => {
  const userId = res.locals.authenticatedUserId as string

  const accessToken =
    res.locals.authenticatedAccessToken as string

  try {
    const supabase = createUserDatabaseClient(accessToken)

    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('user_id', userId)

    if (error) {
      res.status(503).json({
        error: 'Character storage unavailable',
      })
      return
    }

    res.status(204).send()
  } catch {
    res.status(503).json({
      error: 'Character storage unavailable',
    })
  }
})