import { expect, test } from '@oclif/test';

describe('sync', () => {
  test
    .stdout()
    .command(['sync', '--help'])
    .it('shows help', (ctx) => {
      expect(ctx.stdout).to.contain('Sync between inner-agility-dev and lennylmiller repositories');
      expect(ctx.stdout).to.contain('--direction');
      expect(ctx.stdout).to.contain('--reverse');
      expect(ctx.stdout).to.contain('--merge');
      expect(ctx.stdout).to.contain('--no-push');
      expect(ctx.stdout).to.contain('--no-pull');
      expect(ctx.stdout).to.contain('--status');
    });

  test
    .stdout()
    .command(['sync', '--status'])
    .catch(/Git command failed/)
    .it('attempts to show status', (ctx) => {
      // This will fail in test environment without git repo
      // but it validates that the command tries to execute
      expect(ctx.stdout).to.contain('Checking sync status');
    });
});