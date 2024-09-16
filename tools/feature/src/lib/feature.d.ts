import { NoPrefixNameType } from "./helper";

export type MiscType = "types" | "helper" | "mapper" | "constant"

export interface FeatureSchema {
  name: string;
  feature?: string;
  directory?: string;
  skipExport?: boolean;
  project?: string;
  packageName?: string;
  skipPackage?: boolean;
  allMisc?: boolean;
  misc?: MiscType[];
  types?: boolean;
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

export type Normalized<Schema extends FeatureSchema> = NormalizedFeature & Schema & NoPrefixNameType;
