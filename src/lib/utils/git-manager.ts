import { execSync } from 'child_process';

export class GitManager {
  /**
   * Execute a git command and return the output
   */
  private git(command: string): string {
    try {
      return execSync(`git ${command}`, { encoding: 'utf8' }).trim();
    } catch (error: any) {
      throw new Error(`Git command failed: git ${command}\n${error.message}`);
    }
  }

  /**
   * Get the current branch name
   */
  async getCurrentBranch(): Promise<string> {
    return this.git('branch --show-current');
  }

  /**
   * Checkout a branch
   */
  async checkout(branch: string): Promise<void> {
    this.git(`checkout ${branch}`);
  }

  /**
   * Fetch all remotes
   */
  async fetchAll(): Promise<void> {
    this.git('fetch --all');
  }

  /**
   * Pull from a remote
   */
  async pull(remote: string, refspec?: string): Promise<void> {
    if (refspec) {
      this.git(`pull ${remote} ${refspec}`);
    } else {
      this.git(`pull ${remote}`);
    }
  }

  /**
   * Push to a remote
   */
  async push(remote: string, refspec: string, setUpstream = false): Promise<void> {
    const upstreamFlag = setUpstream ? '-u ' : '';
    this.git(`push ${upstreamFlag}${remote} ${refspec}`);
  }

  /**
   * Merge a branch
   */
  async merge(branch: string): Promise<void> {
    this.git(`merge ${branch}`);
  }

  /**
   * Rebase onto a branch
   */
  async rebase(branch: string): Promise<void> {
    this.git(`rebase ${branch}`);
  }

  /**
   * Get branch status
   */
  async getBranchStatus(): Promise<string> {
    return this.git('branch -vv');
  }

  /**
   * Get remote status
   */
  async getRemoteStatus(): Promise<string> {
    return this.git('remote -v');
  }

  /**
   * Get commit differences between branches
   */
  async getCommitDifferences(): Promise<{ ahead: number; behind: number }> {
    const ahead = parseInt(this.git('rev-list --count inner-agility-dev/main..main-rnd'), 10);
    const behind = parseInt(this.git('rev-list --count main-rnd..inner-agility-dev/main'), 10);
    return { ahead, behind };
  }
}