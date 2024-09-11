import { generateFiles, OverwriteStrategy, Tree } from '@nx/devkit';
import { ApiGeneratorSchema, NormalizedApiGeneratorSchema } from './schema';
import { hookGenerator } from '../hook/generator';
import { join } from 'path';
import { addToIndex, normalizeOptions } from '../../lib/utils';

export async function apiGenerator(
  tree: Tree,
  options: ApiGeneratorSchema
) {
  const opts = await normalizeOptions(
    tree,
    'api',
    '@dcat23/nx-feature:api',
    options,
  )

  createApiFiles(tree, opts);
  addToIndex(tree, opts);

  if (opts.hook) {
    await hookGenerator(tree, {
      name: opts.name,
      feature: opts.feature,
      directory: options.directory,
      mutation: true,
    });
  }
}

function createApiFiles(host: Tree, options: NormalizedApiGeneratorSchema) {
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

export default apiGenerator;

