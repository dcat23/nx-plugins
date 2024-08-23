import { Schema as NxNextSchema } from '@nx/next/src/generators/application/schema';


export interface Schema extends NxNextSchema {
  ui?: "mui" | "none";
  database?: "postgres" | "mysql" | "none"
  authType?: "github" | "google"
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
