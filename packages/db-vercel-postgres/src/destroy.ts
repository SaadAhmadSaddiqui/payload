import type { Destroy } from 'payload'
import type { Pool } from 'pg'

import type { VercelPostgresAdapter } from './types.js'

export const destroy: Destroy = async function destroy(this: VercelPostgresAdapter) {
  // Close pool if using standard pg.Pool (for local databases)
  // The drizzle client might be wrapping a pg.Pool
  if (this.drizzle && '$client' in this.drizzle) {
    const client = this.drizzle.$client as Pool
    if (client && typeof client.end === 'function') {
      try {
        await client.end()
      } catch (error) {
        if (this.payload?.logger) {
          this.payload.logger.warn({
            err: error,
            msg: 'Failed to close database client',
          })
        }
      }
    }
  }

  // Clear schema metadata
  if (this.enums) {
    this.enums = {}
  }
  this.schema = {}
  this.tables = {}
  this.relations = {}
  this.fieldConstraints = {}
  // @ts-expect-error - Setting to undefined for reinitialization
  this.drizzle = undefined
  this.initializing = new Promise((res, rej) => {
    this.resolveInitializing = res
    this.rejectInitializing = rej
  })
}
