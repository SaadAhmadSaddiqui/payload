import type { Destroy } from 'payload'

import type { SQLiteD1Adapter } from './types.js'

// eslint-disable-next-line @typescript-eslint/require-await
export const destroy: Destroy = async function destroy(this: SQLiteD1Adapter) {
  // D1 uses Cloudflare Workers binding - no explicit close needed
  // The binding is managed by the Workers runtime

  // Just clear schema metadata
  if (this.enums) {
    this.enums = {}
  }
  this.schema = {}
  this.tables = {}
  this.relations = {}
  this.fieldConstraints = {}
  // @ts-expect-error - Setting to undefined for reinitialization
  this.drizzle = undefined
  // @ts-expect-error - Clear the binding reference
  this.client = undefined
  this.initializing = new Promise((res, rej) => {
    this.resolveInitializing = res
    this.rejectInitializing = rej
  })
}
