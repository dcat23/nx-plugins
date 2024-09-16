import { formatFiles, generateFiles, OverwriteStrategy, Tree } from '@nx/devkit';
import { HookGeneratorSchema, NormalizedHookGeneratorSchema } from './schema';
import { join } from 'path';
import { addToIndex, normalizeOptions } from '../../lib/utils';
import { prefixName } from './lib/normalize-options';
import { mutationOptions, queryOptions } from "./lib/helper";
import { addMiscFiles } from "../../lib/add-misc-file";


export async function hookGenerator(
  tree: Tree,
  options: HookGeneratorSchema
) {
  if (!(options.mutation || options.query)) {
    // set a default as mutation for now
    options.mutation = true;
  }
  return hookGeneratorInternal(tree, {
    packageName: "hooks",
    ...options,
  });
}
export async function hookGeneratorInternal(
  tree: Tree,
  options: HookGeneratorSchema
) {

  const normalizedOptions = await normalizeOptions(
    tree,
    options.skipPackage ? "" : options.packageName,
    '@dcat23/nx-feature:hook',
    options,
    prefixName
  )

  const templateOptions = {
    ...normalizedOptions,
    ...mutationOptions(normalizedOptions),
    ...queryOptions(normalizedOptions),
    tmpl: "",
  }


  createHookFiles(tree, templateOptions);
  await addMiscFiles(tree, templateOptions);
  await addToIndex(tree, templateOptions);
  await formatFiles(tree);
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
