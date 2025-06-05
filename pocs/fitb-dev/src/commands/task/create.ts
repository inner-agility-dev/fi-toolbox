
import { Command, Flags } from '@oclif/core'
import { db } from '../../db/client'
import { getResourceSchema } from '../../schema/loader'

export default class Create extends Command {
  static description = 'Create a new task'

  static flags = {
    data: Flags.string({ char: 'd', required: true })
  }

  async run() {
    const { flags } = await this.parse(Create)
    const schema = getResourceSchema('task');
    const data = JSON.parse(flags.data);
    const [inserted] = await db(schema.table).insert(data).returning('*');
    this.log(JSON.stringify(inserted, null, 2));
  }
}
