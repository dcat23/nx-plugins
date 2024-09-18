import { formatFiles, names, Tree } from '@nx/devkit';
import { StoreGeneratorSchema } from './schema';
import { importPath } from "../../lib/utils";
import { createStoreFiles } from "./lib/create-store-files";
import { addToIndex } from "../../lib/add-to-index";
import { addMiscFiles } from "../../lib/add-misc-file";
import { zustandCreateMethod } from "./lib/zustand-options";
import { normalizeOptions } from "../../lib/normalize-options";

export async function storeGenerator(
  tree: Tree,
  options: StoreGeneratorSchema
) {
  return storeGeneratorInternal(tree, {
    packageName: "store",
    storeType: "zustand",
    ...options
  })
}

function storeMutator(name: string) {
  const n = names(name);
  const prefix = /^use/.test(n.fileName) ? "" : "use";
  const suffix = /store$/.test(n.fileName) ? "" : "store";
  const fileName = [prefix, n.fileName, suffix].join("-");
  return {
    ...n,
    fileName
  }
}

export async function storeGeneratorInternal(
  tree: Tree,
  options: StoreGeneratorSchema
) {
  const normalizedOptions = await normalizeOptions(
    tree,
    options.skipPackage ? "" : options.packageName,
    '@dcat23/nx-feature:store',
    options,
    storeMutator
  );

  const templateOptions = {
    ...normalizedOptions,
    createMethod: zustandCreateMethod(normalizedOptions),
    importPath: importPath(normalizedOptions),
    tmpl: ""
  }

  createStoreFiles(tree, templateOptions);
  addMiscFiles(tree, templateOptions);
  addToIndex(tree, templateOptions);
  await formatFiles(tree)
}

export default storeGenerator;
