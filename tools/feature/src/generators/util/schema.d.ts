import { FeatureSchema, Normalized } from "../../lib/feature";


export interface UtilGeneratorSchema extends FeatureSchema {
  skipFile?: boolean;
}

export type NormalizedUtilGeneratorSchema = Normalized<UtilGeneratorSchema>;
