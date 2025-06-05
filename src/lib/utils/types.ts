export type SyncDirection = 'forward' | 'reverse';
export type SyncMode = 'merge' | 'rebase';

export interface SyncOptions {
  direction: SyncDirection;
  mode: SyncMode;
  push: boolean;
  pull: boolean;
}

export interface CommitDifferences {
  ahead: number;
  behind: number;
}

export interface GitRemote {
  name: string;
  url: string;
  type: 'fetch' | 'push';
}

export interface GitBranch {
  name: string;
  commit: string;
  tracking?: string;
  ahead?: number;
  behind?: number;
}