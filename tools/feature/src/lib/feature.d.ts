export interface FeatureSchema {
  name: string;
  feature?: string;
  directory?: string;
  skipExport?: boolean;
  project?: string;
}

export interface NormalizedFeature {
  artifactName: string;
  className: string;
  constantName: string;
  fileName: string;
  propertyName: string;
  filePath: string;
  indexPath: string;
  relativePath: string;
  projectName: string;
}

export type Normalized<Schema extends FeatureSchema> = NormalizedFeature & Schema;
