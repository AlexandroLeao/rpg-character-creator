import { Router } from 'express'

import { requireAuth } from '../middleware/requireAuth.js'

import {
  createUserDatabaseClient,
} from '../lib/supabase.js'

import {
  validateCharacterInput,
  type CharacterInput,
} from '../lib/characterValidation.js'

export const characterRouter = Router()

/*
 * ADVENTURE FILES
 * CHARACTER API
 *
 * GET    /api/characters/me
 * PUT    /api/characters/me
 * DELETE /api/characters/me
 *
 * Characters belong to authenticated users.
 * Database access remains protected by RLS.
 */

/* ==========================================
   DATABASE COLUMNS
   ========================================== */

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
  motivation,
  created_at,
  updated_at
` as const

/* ==========================================
   DATABASE CHARACTER TYPE
   ========================================== */

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

  /*
   * Existing characters may have
   * no motivation.
   *
   * New characters require motivation.
   */

  motivation: string | null

  created_at: string
  updated_at: string
}

/* ==========================================
   PUBLIC CHARACTER REPRESENTATION
   ========================================== */

function toPublicCharacter(
  character: CharacterRow,
) {
  return {
    id: character.id,
    name: character.name,

    characterClass:
      character.character_class,

    ancestry: character.ancestry,
    background: character.background,

    weapon: character.weapon,
    artifact: character.artifact,

    personality: character.personality,
    aura: character.aura,

    companion: character.companion,
    motivation: character.motivation,

    createdAt: character.created_at,
    updatedAt: character.updated_at,
  }
}

/* ==========================================
   DATABASE INPUT REPRESENTATION
   ========================================== */

function toDatabaseFields(
  input: CharacterInput,
) {
  return {
    name: input.name,

    character_class:
      input.characterClass,

    ancestry: input.ancestry,
    background: input.background,

    weapon: input.weapon,
    artifact: input.artifact,

    personality: input.personality,
    aura: input.aura,

    companion: input.companion,
    motivation: input.motivation,
  }
}

/* ==========================================
   UPDATE EXISTING CHARACTER
   ========================================== */

async function updateUserCharacter(
  supabase:
    ReturnType<typeof createUserDatabaseClient>,

  userId: string,

  fields:
    ReturnType<typeof toDatabaseFields>,
) {
  return supabase
    .from('characters')
    .update(fields)
    .eq('user_id', userId)
    .select(characterColumns)
    .maybeSingle()
}

/* ==========================================
   GET CHARACTER
   ========================================== */

characterRouter.get(
  '/me',
  requireAuth,
  async (_req, res) => {
    const userId =
      res.locals.authenticatedUserId as string

    const accessToken =
      res.locals.authenticatedAccessToken as string

    try {
      const supabase =
        createUserDatabaseClient(accessToken)

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
  },
)

/* ==========================================
   CREATE OR UPDATE CHARACTER
   ========================================== */

characterRouter.put(
  '/me',
  requireAuth,
  async (req, res) => {
    /*
     * Validate every character choice.
     */

    const validation =
      validateCharacterInput(req.body)

    if (!validation.success) {
      res.status(400).json({
        error: 'Invalid character data',
        details: validation.errors,
      })

      return
    }

    /*
     * Use the verified user identity.
     */

    const userId =
      res.locals.authenticatedUserId as string

    const accessToken =
      res.locals.authenticatedAccessToken as string

    const fields =
      toDatabaseFields(validation.data)

    try {
      const supabase =
        createUserDatabaseClient(accessToken)

      /*
       * First try to update an
       * existing character.
       */

      const updateResult =
        await updateUserCharacter(
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
          character: toPublicCharacter(
            updateResult.data,
          ),
        })

        return
      }

      /*
       * No existing character.
       * Create a new record.
       */

      const insertResult = await supabase
        .from('characters')
        .insert({
          user_id: userId,
          ...fields,
        })
        .select(characterColumns)
        .single()

      /*
       * Handle concurrent creation.
       *
       * PostgreSQL error 23505 indicates
       * a unique constraint violation.
       */

      if (
        insertResult.error?.code === '23505'
      ) {
        const retryResult =
          await updateUserCharacter(
            supabase,
            userId,
            fields,
          )

        if (retryResult.error) {
          res.status(503).json({
            error:
              'Character storage unavailable',
          })

          return
        }

        if (!retryResult.data) {
          res.status(409).json({
            error:
              'Character changed. Please retry.',
          })

          return
        }

        res.status(200).json({
          character: toPublicCharacter(
            retryResult.data,
          ),
        })

        return
      }

      /*
       * Handle failed insertion.
       */

      if (
        insertResult.error ||
        !insertResult.data
      ) {
        res.status(503).json({
          error: 'Character storage unavailable',
        })

        return
      }

      /*
       * Character successfully created.
       */

      res.status(201).json({
        character: toPublicCharacter(
          insertResult.data,
        ),
      })
    } catch {
      res.status(503).json({
        error: 'Character storage unavailable',
      })
    }
  },
)

/* ==========================================
   DELETE CHARACTER
   ========================================== */

characterRouter.delete(
  '/me',
  requireAuth,
  async (_req, res) => {
    const userId =
      res.locals.authenticatedUserId as string

    const accessToken =
      res.locals.authenticatedAccessToken as string

    try {
      const supabase =
        createUserDatabaseClient(accessToken)

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
  },
)