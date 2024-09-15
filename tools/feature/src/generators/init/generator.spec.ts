import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { initGenerator } from './generator';
import { InitGeneratorSchema } from './schema';

describe('init generator', () => {
  let tree: Tree;
  const options: InitGeneratorSchema = { name: 'test', projectRoot: "." };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await initGenerator(tree, options);
    const root = options.projectRoot
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
    expect(tree.exists(`${root}/src/lib/axios/index.ts`)).toBe(true);
    expect(tree.exists(`${root}/src/lib/axios/error.ts`)).toBe(true);
    expect(tree.exists(`${root}/src/lib/providers/react-query-provider.tsx`)).toBe(true);
    expect(tree.exists(`${root}/src/lib/config.ts`)).toBe(true);
    expect(tree.exists(`${root}/src/lib/constants.ts`)).toBe(true);
  });
});
