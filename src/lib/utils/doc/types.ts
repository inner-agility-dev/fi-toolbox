export type Collection = 'dev' | 'prod';

export interface DocConfig {
  source_project: string;
  target_project: string;
  collection: Collection;
  doc_extensions: string[];
  exclude_patterns: string[];
  include_paths: string[];
  exclude_paths: string[];
  max_file_size_mb: number;
  collection_description?: string;
}

export interface SnapshotMetadata {
  snapshot_id: string;
  created_at: string;
  collection: Collection;
  collection_description: string;
  file_count: number;
  total_size_mb: number;
  config_file: string;
}

export interface DocFile {
  source_path: string;
  relative_path: string;
  size_bytes: number;
}

export interface CollectionState {
  collection: Collection | 'unknown';
  switched_at?: string;
  backup_path?: string;
}

export interface SnapshotSummary {
  snapshot_id: string;
  created_at: string;
  file_count: number;
  size_mb: number;
  collection: Collection;
}