import { FeatureSchema, Normalized } from "../../lib/feature";

export type StoreType = "zustand" | "context"

export interface StoreGeneratorSchema extends FeatureSchema {
  storeType: StoreType
}

export type NormalizedStoreGeneratorSchema = Normalized<StoreGeneratorSchema>;
