
import { Command, Flags } from '@oclif/core'
import { db } from '../../db/client'
import { getResourceSchema } from '../../schema/loader'

export default class Delete extends Command {
  static description = 'Delete a task by ID'

  static flags = {
    id: Flags.integer({ char: 'i', required: true })
  }

  async run() {
    const { flags } = await this.parse(Delete)
    const schema = getResourceSchema('task');
    await db(schema.table).where(schema.idField, flags.id).del();
    this.log(`Task with ID ${flags.id} deleted.`);
  }
}
