import { join } from 'path';
import { FeatureSchema, Normalized } from './feature';


export function importPath(options: Normalized<FeatureSchema>): string {
  const { feature, directory } = options;
  const importPath = join(directory)
  return `@/${importPath.toString()}`;
}
