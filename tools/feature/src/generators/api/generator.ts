import { generateFiles, OverwriteStrategy, Tree } from '@nx/devkit';
import { ApiGeneratorSchema, NormalizedApiGeneratorSchema } from './schema';
import { hookGenerator } from '../hook/generator';
import { join } from 'path';
import { addToIndex, normalizeOptions } from '../../lib/utils';
import { noPrefixName } from "../../lib/helper";

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

  const templateOptions = {
    ...opts,
    ...noPrefixName(opts.name),
    tmpl: ""
  }

  createApiFiles(tree, templateOptions);
  addToIndex(tree, templateOptions);

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
    options,
    {
      overwriteStrategy: OverwriteStrategy.Overwrite
    }
  )
}

export default apiGenerator;

