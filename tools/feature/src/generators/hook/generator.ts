import { generateFiles, OverwriteStrategy, Tree } from '@nx/devkit';
import { HookGeneratorSchema, NormalizedHookGeneratorSchema } from './schema';
import { join } from 'path';
import { addToIndex, normalizeOptions } from '../../lib/utils';
import { prefixName } from './lib/normalize-options';
import { noPrefixName } from "../../lib/helper";
import { mutationOptions, queryOptions } from "./lib/helper";


export async function hookGenerator(
  tree: Tree,
  options: HookGeneratorSchema
) {
  if (!(options.mutation || options.query)) {
    // set a default as mutation for now
    options.mutation = true;
  }
  return hookGeneratorInternal(tree, {
    ...options,
  });
}
export async function hookGeneratorInternal(
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

  const templateOptions = {
    ...normalizedOptions,
    ...noPrefixName(normalizedOptions.name),
    ...mutationOptions(options.mutation),
    ...queryOptions(options.query),
    tmpl: "",
    skipFiles: ['mutation.ejs', 'query.ejs']
  }

  createHookFiles(tree, templateOptions);
  removeTemplates(tree, normalizedOptions.relativePath)
  addToIndex(tree, templateOptions);
}

function removeTemplates(tree: Tree, relativePath: any) {
  tree.delete(`${relativePath}/mutation.ejs`);
  tree.delete(`${relativePath}/query.ejs`);
}

export function createHookFiles(host: Tree, options: NormalizedHookGeneratorSchema) {
  generateFiles(
    host,
    join(__dirname, "files"),
    options.relativePath,
    options,
    {
      overwriteStrategy: OverwriteStrategy.Overwrite,
    }
  )
}

export default hookGenerator;
