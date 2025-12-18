import type { Destroy } from 'payload'

import type { PostgresAdapter } from './types.js'

export const destroy: Destroy = async function destroy(this: PostgresAdapter) {
  // Close the connection pool to prevent zombie connections during HMR
  if (this.pool && typeof this.pool.end === 'function') {
    try {
      await this.pool.end()
    } catch (error) {
      // Log warning but don't throw - we want destroy to complete
      if (this.payload?.logger) {
        this.payload.logger.warn({
          err: error,
          msg: 'Failed to close database connection pool',
        })
      }
    }
    // @ts-expect-error - Setting to undefined so connect() will create a fresh pool
    this.pool = undefined
  }

  // Clear schema metadata (same as base implementation)
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
