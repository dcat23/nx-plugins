import { Tree } from '@nx/devkit';
import { ComponentGeneratorSchema } from './schema';
import { createComponentFile } from './lib/create-component-file';
import { normalizeOptions } from '../../lib/normalize-options';
import { addToIndex } from "../../lib/add-to-index";


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
