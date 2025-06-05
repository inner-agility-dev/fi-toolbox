import { expect, test } from '@oclif/test';

describe('doc:status', () => {
  test
    .stdout()
    .command(['doc:status'])
    .it('shows documentation status', (ctx) => {
      expect(ctx.stdout).to.contain('Documentation Collection Status');
      expect(ctx.stdout).to.contain('Active collection:');
      expect(ctx.stdout).to.contain('Working Directories:');
    });
});