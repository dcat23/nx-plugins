import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson, Tree } from '@nx/devkit';
import { presetGenerator } from './generator';
import { join } from 'path';

describe('app', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('App Router', () => {
    it('should generate files for app layout', async () => {
      const name = uniq();
      await presetGenerator(tree, {
        name,
        style: 'css',
        projectNameAndRootFormat: 'as-provided',
      });

      const tsConfig = readJson(tree, `${name}/tsconfig.json`);
      expect(tsConfig.include).toEqual([
        '**/*.ts',
        '**/*.tsx',
        '**/*.js',
        '**/*.jsx',
        `../${name}/.next/types/**/*.ts`,
        `../dist/${name}/.next/types/**/*.ts`,
        'next-env.d.ts',
      ]);

      expect(tree.exists(`${name}/src/app/page.tsx`)).toBeTruthy();
      expect(tree.exists(`${name}/src/app/providers.tsx`)).toBeTruthy();
      expect(tree.exists(`${name}/src/app/api/auth/[...nextauth]/route.ts`)).toBeTruthy();
      expect(tree.exists(`${name}/src/lib/auth/index.ts`)).toBeTruthy();
      expect(tree.exists(`${name}/public/favicon.ico`)).toBeTruthy();
    });

    it('should add layout types correctly for standalone apps', async () => {
      const name = uniq();
      await presetGenerator(tree, {
        name,
        style: 'css',
        appDir: true,
        rootProject: true,
        projectNameAndRootFormat: 'as-provided',
      });

      const tsConfig = readJson(tree, 'tsconfig.json');
      expect(tsConfig.include).toEqual([
        'src/**/*.ts',
        'src/**/*.tsx',
        'src/**/*.js',
        'src/**/*.jsx',
        '.next/types/**/*.ts',
        `dist/${name}/.next/types/**/*.ts`,
        'next-env.d.ts',
      ]);

      expect(tree.exists(`src/app/page.tsx`)).toBeTruthy();
      expect(tree.exists(`src/app/providers.tsx`)).toBeTruthy();
      expect(tree.exists(`src/app/api/auth/[...nextauth]/route.ts`)).toBeTruthy();
      expect(tree.exists(`src/lib/auth/index.ts`)).toBeTruthy();
      expect(tree.exists(`public/favicon.ico`)).toBeTruthy();
    });

    it('should generate an unstyled component page', async () => {
      const name = uniq();
      await presetGenerator(tree, {
        name,
        style: 'none',
        appDir: true,
        rootProject: true,
        projectNameAndRootFormat: 'as-provided',
      });

      const content = tree.read('src/app/page.tsx').toString();

      expect(content).not.toContain('import styles from');
      expect(content).not.toContain('const StyledPage');
      expect(content).not.toContain('className={styles.page}');
    });
  });

  it('should set up the nx next build builder', async () => {
    const name = uniq();

    await presetGenerator(tree, {
      name,
      style: 'css',
      projectNameAndRootFormat: 'as-provided',
    });

    expect(tree.read(join(name, 'next.config.js'), 'utf-8'))
      .toMatchInlineSnapshot(`
      "//@ts-check

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { composePlugins, withNx } = require('@nx/next');

      /**
       * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
       **/
      const nextConfig = {
        nx: {
          // Set this to true if you would like to use SVGR
          // See: https://github.com/gregberge/svgr
          svgr: false,
        },
      };

      const plugins = [
        // Add more Next.js plugins to this list if needed.
        withNx,
      ];

      module.exports = composePlugins(...plugins)(nextConfig);
      "
    `);
  });

  describe('--ui mui', () => {
    it('should add Material-ui to package.json', async () => {
      const name = uniq();
      await presetGenerator(tree, {
        name,
        style: 'css',
        ui: 'mui',
        projectNameAndRootFormat: 'as-provided',
      });
      const packageJson = readJson(tree, `package.json`);
      expect(packageJson.dependencies['@mui/material']).toBeTruthy();
      expect(packageJson.dependencies['@mui/icons-material']).toBeTruthy();
      expect(packageJson.dependencies['@mui/material-nextjs']).toBeTruthy();
      expect(packageJson.dependencies['@emotion/react']).toBeTruthy();
      expect(packageJson.dependencies['@emotion/styled']).toBeTruthy();
    });
  });

  describe('--ui radix', () => {
    it('should add radix-ui to package.json', async () => {
      const name = uniq();
      await presetGenerator(tree, {
        name,
        style: 'css',
        ui: 'radix',
        projectNameAndRootFormat: 'as-provided',
      });
      const packageJson = readJson(tree, `package.json`);
      expect(packageJson.dependencies['@radix-ui/themes']).toBeTruthy();
      const layoutTsx = tree.read(`${name}/src/app/providers.tsx`);
      expect(layoutTsx.includes("import { Theme } from '@radix-ui/themes'")).toBeTruthy();
    });
  });

  describe('Feature plugin', () => {
    it('should generate feature plugin files', async () => {
      const name = uniq();
      await presetGenerator(tree, {
        name,
        style: 'css',
        ui: 'radix',
        projectNameAndRootFormat: 'as-provided',
      });
      const packageJson = readJson(tree, `package.json`);
      expect(packageJson.devDependencies["@dcat23/nx-feature"]).toBeTruthy();
      expect(tree.exists(`${name}/src/lib/axios/index.ts`)).toBeTruthy();
    });
  });

});

function uniq() {
  return `str-${(Math.random() * 10000).toFixed(0)}`;
}
