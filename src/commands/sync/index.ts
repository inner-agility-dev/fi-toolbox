import { Command, Flags } from '@oclif/core';
import { execSync } from 'child_process';
import { GitManager } from '../../lib/utils/git-manager';
import { SyncDirection, SyncMode, SyncOptions } from '../../lib/utils/types';

export default class Sync extends Command {
  static description = 'Sync between inner-agility-dev and lennylmiller repositories';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -r',
    '<%= config.bin %> <%= command.id %> --merge',
    '<%= config.bin %> <%= command.id %> -n',
    '<%= config.bin %> <%= command.id %> --status',
  ];

  static flags = {
    direction: Flags.string({
      description: 'Sync direction',
      options: ['forward', 'reverse'],
      default: 'forward',
    }),
    reverse: Flags.boolean({
      char: 'r',
      description: 'Sync from lennylmiller to inner-agility-dev',
      exclusive: ['direction'],
    }),
    merge: Flags.boolean({
      char: 'm',
      description: 'Use merge instead of rebase',
      default: false,
    }),
    'no-push': Flags.boolean({
      char: 'n',
      description: 'Don\'t push after sync',
      default: false,
    }),
    'no-pull': Flags.boolean({
      char: 'l',
      description: 'Don\'t pull before sync',
      default: false,
    }),
    status: Flags.boolean({
      char: 's',
      description: 'Show sync status only',
      default: false,
    }),
    help: Flags.help({ char: 'h' }),
  };

  private gitManager: GitManager;

  constructor(argv: string[], config: any) {
    super(argv, config);
    this.gitManager = new GitManager();
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Sync);

    // Show status if requested
    if (flags.status) {
      await this.showStatus();
      return;
    }

    // Determine sync options
    const options: SyncOptions = {
      direction: flags.reverse ? 'reverse' : (flags.direction as SyncDirection),
      mode: flags.merge ? 'merge' : 'rebase',
      push: !flags['no-push'],
      pull: !flags['no-pull'],
    };

    // Perform sync
    await this.performSync(options);
  }

  private async showStatus(): Promise<void> {
    this.log('Checking sync status...\n');

    try {
      // Fetch all remotes
      await this.gitManager.fetchAll();

      // Show branch status
      this.log('Branch status:');
      const branchStatus = await this.gitManager.getBranchStatus();
      this.log(branchStatus);

      // Show remote status
      this.log('\nRemote status:');
      const remoteStatus = await this.gitManager.getRemoteStatus();
      this.log(remoteStatus);

      // Show commit differences
      this.log('\nCommit differences:');
      try {
        const differences = await this.gitManager.getCommitDifferences();
        this.log(`main-rnd: ${differences.ahead} ahead, ${differences.behind} behind inner-agility-dev/main`);
      } catch (error) {
        this.log('Could not determine commit differences for inner-agility-dev');
      }
    } catch (error) {
      this.error(`Failed to check status: ${error}`);
    }
  }

  private async performSync(options: SyncOptions): Promise<void> {
    const directionText = options.direction === 'forward' 
      ? 'inner-agility-dev → lennylmiller' 
      : 'lennylmiller → inner-agility-dev';
    
    this.log(`Syncing repositories (${directionText})`);
    this.log(`Mode: ${options.mode}, Pull: ${options.pull}, Push: ${options.push}\n`);

    const currentBranch = await this.gitManager.getCurrentBranch();

    try {
      if (options.direction === 'forward') {
        await this.syncForward(options);
      } else {
        await this.syncReverse(options);
      }

      // Return to original branch if different
      const newBranch = await this.gitManager.getCurrentBranch();
      if (currentBranch !== newBranch) {
        this.log(`\n6. Returning to ${currentBranch} branch...`);
        await this.gitManager.checkout(currentBranch);
      }

      this.log('\n✅ Sync completed successfully!');
    } catch (error) {
      this.error(`\n❌ Sync failed!\n${error}`, { exit: 1 });
    }
  }

  private async syncForward(options: SyncOptions): Promise<void> {
    // Sync from inner-agility-dev to lennylmiller
    this.log('1. Switching to main-rnd branch...');
    await this.gitManager.checkout('main-rnd');

    if (options.pull) {
      this.log('2. Pulling latest from inner-agility-dev...');
      await this.gitManager.pull('inner-agility-dev', 'main');
    }

    this.log('3. Switching to main-prod branch...');
    await this.gitManager.checkout('main-prod');

    this.log(`4. ${options.mode === 'merge' ? 'Merging' : 'Rebasing'} main-rnd...`);
    if (options.mode === 'merge') {
      await this.gitManager.merge('main-rnd');
    } else {
      await this.gitManager.rebase('main-rnd');
    }

    if (options.push) {
      this.log('5. Pushing to lennylmiller...');
      await this.gitManager.push('lennylmiller', 'main-prod:main', true);
    }
  }

  private async syncReverse(options: SyncOptions): Promise<void> {
    // Sync from lennylmiller to inner-agility-dev
    this.log('1. Switching to main-prod branch...');
    await this.gitManager.checkout('main-prod');

    if (options.pull) {
      this.log('2. Pulling latest from lennylmiller...');
      await this.gitManager.pull('lennylmiller', 'main:main-prod');
    }

    this.log('3. Switching to main-rnd branch...');
    await this.gitManager.checkout('main-rnd');

    this.log(`4. ${options.mode === 'merge' ? 'Merging' : 'Rebasing'} main-prod...`);
    if (options.mode === 'merge') {
      await this.gitManager.merge('main-prod');
    } else {
      await this.gitManager.rebase('main-prod');
    }

    if (options.push) {
      this.log('5. Pushing to inner-agility-dev...');
      await this.gitManager.push('inner-agility-dev', 'main-rnd:main');
    }
  }
}