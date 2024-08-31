import { generateFiles, OverwriteStrategy, Tree } from "@nx/devkit";
import { NormalizedStoreGeneratorSchema } from "../schema";
import { join } from "path";

export function createStoreFiles(host: Tree, options: NormalizedStoreGeneratorSchema) {

  generateFiles(
    host,
    join(__dirname, "../files", options.storeType),
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
