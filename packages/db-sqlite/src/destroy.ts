import type { Destroy } from 'payload'

import type { SQLiteAdapter } from './types.js'

// eslint-disable-next-line @typescript-eslint/require-await
export const destroy: Destroy = async function destroy(this: SQLiteAdapter) {
  // Close the LibSQL client to prevent connection leaks
  if (this.client && typeof this.client.close === 'function') {
    try {
      this.client.close()
    } catch (error) {
      if (this.payload?.logger) {
        this.payload.logger.warn({
          err: error,
          msg: 'Failed to close database client',
        })
      }
    }
    // @ts-expect-error - Setting to undefined so connect() will create a fresh client
    this.client = undefined
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
