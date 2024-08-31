import { names, Tree } from '@nx/devkit';
import { StoreGeneratorSchema } from './schema';
import { addToIndex, normalizeOptions } from "../../lib/utils";
import { createStoreFiles } from "./lib/create-store-files";

export async function storeGenerator(
  tree: Tree,
  options: StoreGeneratorSchema
) {
  return storeGeneratorInternal(tree, {
    storeType: "zustand",
    ...options
  })
}

function storeMutator(name: string) {
  const n = names(name);
  const prefix = /^use/.test(n.fileName) ? "" : "use";
  const suffix = /store$/.test(n.fileName) ? "" : "store";
  const fileName = [prefix, n.fileName,suffix].join("-");
  return {
    ...n,
    fileName
  }
}

export async function storeGeneratorInternal(
  tree: Tree,
  options: StoreGeneratorSchema
) {
  const opts = await normalizeOptions(
    tree,
    'store',
    '@dcat23/nx-feature:store',
    options,
    storeMutator
  );

  createStoreFiles(tree, opts);
  addToIndex(tree, opts);
}

export default storeGenerator;
