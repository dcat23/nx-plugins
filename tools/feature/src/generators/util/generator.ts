import { formatFiles, generateFiles, joinPathFragments, OverwriteStrategy, Tree } from '@nx/devkit';
import { NormalizedUtilGeneratorSchema, UtilGeneratorSchema } from './schema';
import { addMiscFiles } from "../../lib/add-misc-file";
import { addToIndex } from "../../lib/add-to-index";
import { join } from "path";
import { normalizeOptions } from "../../lib/normalize-options";

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
      overwriteStrategy: OverwriteStrategy.KeepExisting
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

  if (!normalizedOptions.skipFile) {
    createUtilFile(tree, normalizedOptions)
  } else {
    normalizedOptions.filePath = ""
  }
  addMiscFiles(tree, normalizedOptions)
  addToIndex(tree, normalizedOptions);
  await formatFiles(tree);
}

export default utilGenerator;
