import { Tree } from '@nx/devkit';
import { UtilGeneratorSchema } from './schema';
import { addToIndex, normalizeOptions } from "../../lib/utils";
import { addMiscFiles } from "../../lib/add-misc-file";

export async function utilGenerator(
  tree: Tree,
  options: UtilGeneratorSchema
) {
  return utilGeneratorInternal(tree, {
    packageName: "utils",
    ...options
  })
}
export async function utilGeneratorInternal(
  tree: Tree,
  options: UtilGeneratorSchema
) {
  const opts = await normalizeOptions(
    tree,
    options.skipPackage ? "" : options.packageName,
    '@dcat23/nx-feature:util',
    options,
  );

  addMiscFiles(tree, opts)
  addToIndex(tree, opts);
}

export default utilGenerator;
