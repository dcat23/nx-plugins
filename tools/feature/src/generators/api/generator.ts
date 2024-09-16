import { generateFiles, OverwriteStrategy, Tree } from '@nx/devkit';
import { ApiGeneratorSchema, NormalizedApiGeneratorSchema } from './schema';
import { hookGenerator } from '../hook/generator';
import { join } from 'path';
import { normalizeOptions } from '../../lib/utils';
import { addMiscFiles } from "../../lib/add-misc-file";
import { addToIndex } from "../../lib/add-to-index";

export async function apiGenerator(
  tree: Tree,
  options: ApiGeneratorSchema
) {
  return apiGeneratorInternal(tree, {
    packageName: "api",
    ...options
  });
}

export async function apiGeneratorInternal(
  tree: Tree,
  options: ApiGeneratorSchema
) {
  const normalizedOptions = await normalizeOptions(
    tree,
    options.skipPackage ? "" : options.packageName,
    '@dcat23/nx-feature:api',
    options,
  )

  const templateOptions = {
    ...normalizedOptions,
    tmpl: ""
  }

  createApiFiles(tree, templateOptions);
  addMiscFiles(tree, templateOptions);
  addToIndex(tree, templateOptions);

  if (normalizedOptions.hook || normalizedOptions.mutation || normalizedOptions.query) {
    await hookGenerator(tree, {
      ...normalizedOptions,
      name: templateOptions.noPrefixName,
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

