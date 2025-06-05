import { Command } from '@oclif/core';

export default class Doc extends Command {
  static description = 'Documentation management commands';

  static examples = [
    '<%= config.bin %> <%= command.id %> switch prod',
    '<%= config.bin %> <%= command.id %> snapshot',
    '<%= config.bin %> <%= command.id %> status',
  ];

  async run(): Promise<void> {
    // Show help when no subcommand is provided
    await this.config.runCommand('help', ['doc']);
  }
}