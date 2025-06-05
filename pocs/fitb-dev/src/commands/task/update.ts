
import { Command, Flags } from '@oclif/core'
import { db } from '../../db/client'
import { getResourceSchema } from '../../schema/loader'

export default class Update extends Command {
  static description = 'Update a task by ID'

  static flags = {
    id: Flags.integer({ char: 'i', required: true }),
    data: Flags.string({ char: 'd', required: true })
  }

  async run() {
    const { flags } = await this.parse(Update)
    const schema = getResourceSchema('task');
    const data = JSON.parse(flags.data);
    const [updated] = await db(schema.table)
      .where(schema.idField, flags.id)
      .update(data)
      .returning('*');
    this.log(JSON.stringify(updated, null, 2));
  }
}
