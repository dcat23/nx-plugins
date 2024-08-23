import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import {
  getProjects,
  readJson,
  readNxJson,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';

import { Schema } from './schema';
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
      expect(tree.exists(`${name}/src/pages/styles.css`)).toBeFalsy();
      expect(tree.exists(`${name}/src/app/global.css`)).toBeTruthy();
      expect(tree.exists(`${name}/src/app/page.tsx`)).toBeTruthy();
      expect(tree.exists(`${name}/src/app/layout.tsx`)).toBeTruthy();
      expect(tree.exists(`${name}/src/app/api/hello/route.ts`)).toBeTruthy();
      expect(tree.exists(`${name}/src/app/page.module.css`)).toBeTruthy();
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

  describe('--unit-test-runner none', () => {
    it('should not generate test configuration', async () => {
      const name = uniq();
      await presetGenerator(tree, {
        name,
        style: 'css',
        unitTestRunner: 'none',
        projectNameAndRootFormat: 'as-provided',
      });
      expect(tree.exists('jest.config.ts')).toBeFalsy();
      expect(tree.exists(`${name}/specs/index.spec.tsx`)).toBeFalsy();
    });
  });

  describe('--e2e-test-runner none', () => {
    it('should not generate test configuration', async () => {
      const name = uniq();

      await presetGenerator(tree, {
        name,
        style: 'css',
        e2eTestRunner: 'none',
        projectNameAndRootFormat: 'as-provided',
      });
      expect(tree.exists(`${name}-e2e`)).toBeFalsy();
    });
  });

});

function uniq() {
  return `str-${(Math.random() * 10000).toFixed(0)}`;
}
