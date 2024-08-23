import { FeatureSchema, Normalized } from '../../lib/feature';

export interface ApiGeneratorSchema extends FeatureSchema {
  hook?: boolean;
}

export type NormalizedApiGeneratorSchema = Normalized<ApiGeneratorSchema> & {

}
