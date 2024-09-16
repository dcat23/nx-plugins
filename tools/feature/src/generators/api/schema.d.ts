import { FeatureSchema, Normalized } from '../../lib/feature';

export interface ApiGeneratorSchema extends FeatureSchema {
  hook?: boolean;
  mutation?: boolean;
  query?: boolean;
}

export type NormalizedApiGeneratorSchema = Normalized<ApiGeneratorSchema> & {

}
