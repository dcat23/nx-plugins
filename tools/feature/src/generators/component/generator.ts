import { Tree } from '@nx/devkit';
import { ComponentGeneratorSchema } from './schema';
import { addToIndex, normalizeOptions } from '../../lib/utils';
import { createComponentFile } from './lib/create-component-file';


export async function componentGenerator(
  tree: Tree,
  options: ComponentGeneratorSchema
) {
  const opts = await normalizeOptions(
    tree,
    'components',
    '@dcat23/nx-feature:component',
    options,
  );

  createComponentFile(tree, opts);

  addToIndex(tree, opts);
}

export default componentGenerator;
