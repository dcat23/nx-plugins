import { createProjectGraphAsync, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { addPlugin } from '@nx/devkit/src/utils/add-plugin';

export async function addRecommended(host: Tree, options: NormalizedSchema) {
  // Add the 'features' plugin
  const graph = await createProjectGraphAsync();

  const featurePluginOptions = {
    // Your plugin options here
  };

}
