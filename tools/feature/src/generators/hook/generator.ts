import { generateFiles, OverwriteStrategy, Tree } from '@nx/devkit';
import { HookGeneratorSchema, NormalizedHookGeneratorSchema } from './schema';
import { join } from 'path';
import { addToIndex, normalizeOptions } from '../../lib/utils';
import { prefixName } from './lib/normalize-options';


export async function hookGenerator(
  tree: Tree,
  options: HookGeneratorSchema
) {

  const normalizedOptions = await normalizeOptions(
    tree,
    'hooks',
    '@dcat23/nx-feature:hook',
    options,
    prefixName
  )

  const hookType = options.mutation ? "mutation" : "query";
  createHookFiles(tree, {
    ...normalizedOptions,
    hookType
  });

  addToIndex(tree, normalizedOptions);
}

export function createHookFiles(host: Tree, options: NormalizedHookGeneratorSchema) {
  generateFiles(
    host,
    join(__dirname, "files"),
    options.relativePath,
    {
    ...options,
    tmpl: ""
    },
    {
      overwriteStrategy: OverwriteStrategy.KeepExisting
    }
  )
}

export default hookGenerator;
