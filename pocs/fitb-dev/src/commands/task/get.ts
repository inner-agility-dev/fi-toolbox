
import { Command, Flags } from '@oclif/core'
import { db } from '../../db/client'
import { getResourceSchema } from '../../schema/loader'

export default class Get extends Command {
  static description = 'Get a task by ID'

  static flags = {
    id: Flags.integer({ char: 'i', required: true })
  }

  async run() {
    const { flags } = await this.parse(Get)
    const schema = getResourceSchema('task');
    const row = await db(schema.table).where(schema.idField, flags.id).first();
    this.log(JSON.stringify(row, null, 2));
  }
}
