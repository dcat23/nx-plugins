import { generateFiles, OverwriteStrategy, Tree } from '@nx/devkit';
import { NormalizedUtilGeneratorSchema, UtilGeneratorSchema } from './schema';
import { normalizeOptions } from "../../lib/utils";
import { addMiscFiles } from "../../lib/add-misc-file";
import { addToIndex } from "../../lib/add-to-index";
import { join } from "path";

export async function utilGenerator(
  tree: Tree,
  options: UtilGeneratorSchema
) {
  return utilGeneratorInternal(tree, {
    packageName: "utils",
    ...options
  })
}

function createUtilFile(host: Tree, options: NormalizedUtilGeneratorSchema) {
  generateFiles(
    host,
    join(__dirname, "files"),
    options.relativePath,
    {
      ...options,
      tmpl: ""
    },
    {
      overwriteStrategy: OverwriteStrategy.Overwrite
    }
  )
}

export async function utilGeneratorInternal(
  tree: Tree,
  options: UtilGeneratorSchema
) {
  const normalizedOptions = await normalizeOptions(
    tree,
    options.skipPackage ? "" : options.packageName,
    '@dcat23/nx-feature:util',
    options,
  );

  normalizedOptions.filePath = ""
  createUtilFile(tree, normalizedOptions)
  addMiscFiles(tree, normalizedOptions)
  addToIndex(tree, normalizedOptions);
}

export default utilGenerator;
