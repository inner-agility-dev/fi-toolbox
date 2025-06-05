
import { Command } from '@oclif/core'
import { db } from '../../db/client'
import { getResourceSchema } from '../../schema/loader'

export default class List extends Command {
  static description = 'List all tasks'

  async run() {
    const schema = getResourceSchema('task');
    const rows = await db(schema.table).select();
    this.log(JSON.stringify(rows, null, 2));
  }
}
