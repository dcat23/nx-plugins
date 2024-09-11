import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { InitGeneratorSchema } from './schema';

export async function initGenerator(tree: Tree, options: InitGeneratorSchema) {
  return initGeneratorInternal(tree, {
    projectRoot: ".",
    name: "features",
    ...options
  });
}
export async function initGeneratorInternal(tree: Tree, options: InitGeneratorSchema) {
  const projectRoot = options.projectRoot;

  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
}

export default initGenerator;
