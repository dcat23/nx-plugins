import { generateFiles, OverwriteStrategy, Tree } from '@nx/devkit';
import { NormalizedComponentGeneratorSchema } from '../schema';
import { join } from 'path';

export function createComponentFile(host: Tree, options: NormalizedComponentGeneratorSchema) {
  generateFiles(
    host,
    join(__dirname, "../files"),
    options.relativePath,
    {
      ...options,
      tmpl: ""
    },
    {
      overwriteStrategy: OverwriteStrategy.ThrowIfExisting
    }
  )
}
