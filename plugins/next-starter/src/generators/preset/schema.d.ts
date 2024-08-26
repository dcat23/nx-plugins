import { Schema as NxNextSchema } from '@nx/next/src/generators/application/schema';

export type UiLibrary = "mui" | "radix" | "none";
export type Database = "postgres" | "mysql" | "none";
export type AuthType = "github" | "google";

export interface Schema extends NxNextSchema {
  ui?: UiLibrary;
  database?: Database
  authType?: AuthType
}

export interface NormalizedSchema extends Schema {
  projectName: string;
  appProjectRoot: string;
  outputPath: string;
  e2eProjectName: string;
  e2eProjectRoot: string;
  e2eWebServerAddress: string;
  e2eWebServerTarget: string;
  e2ePort: number;
  parsedTags: string[];
  fileName: string;
  styledModule: null | string;
  js?: boolean;
}

export type Normalized<Schema extends NxNextSchema> = NormalizedSchema & Schema;
