export type MiscType = "type" | "helper" | "mapper" | "constant"

export interface FeatureSchema {
  name: string;
  feature?: string;
  directory?: string;
  skipExport?: boolean;
  project?: string;
  packageName?: string;
  skipPackage?: boolean;
  misc?: MiscType[];
  type?: boolean;
  helper?: boolean;
  mapper?: boolean;
  constant?: boolean;

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
