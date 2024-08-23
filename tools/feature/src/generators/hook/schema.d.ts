import { FeatureSchema, Normalized } from '../../lib/feature';

export interface HookGeneratorSchema extends FeatureSchema {
  query?: boolean,
  mutation?: boolean
}

export type NormalizedHookGeneratorSchema = Normalized<HookGeneratorSchema> & {
  hookType: HookType
}

type HookType = "query" | "mutation"
