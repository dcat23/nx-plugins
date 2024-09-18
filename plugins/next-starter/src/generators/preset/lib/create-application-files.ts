import {
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot as _offsetFromRoot,
  readJson,
  toJS,
  Tree,
  updateJson,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { getRelativePathToRootTsConfig } from '@nx/js';
import {
  createAppJsx,
  createStyleRules,
} from '@nx/next/src/generators/application/lib/create-application-files.helpers';
import { join } from 'path';
import { randomBytes } from 'crypto';

export function createApplicationFiles(host: Tree, options: NormalizedSchema): void {
  const offsetFromRoot = _offsetFromRoot(options.appProjectRoot);
  const layoutTypeSrcPath = joinPathFragments(
    offsetFromRoot,
    options.appProjectRoot,
    '.next/types/**/*.ts'
  );
  const layoutTypeDistPath = joinPathFragments(
    offsetFromRoot,
    options.outputPath,
    '.next/types/**/*.ts'
  );

  // scope tsconfig to the project directory so that it doesn't include other projects/libs
  const rootPath = options.rootProject
    ? options.src
      ? 'src/'
      : options.appDir
        ? 'app/'
        : 'pages/'
    : '';
  const authSecret = randomBytes(32).toString('hex')
  const templateVariables = {
    ...names(options.name),
    ...options,
    authSecret,
    dot: '.',
    tmpl: '',
    offsetFromRoot,
    layoutTypeSrcPath,
    rootPath,
    layoutTypeDistPath,
    rootTsConfigPath: getRelativePathToRootTsConfig(
      host,
      options.appProjectRoot
    ),
    appContent: createAppJsx(options.projectName),
    styleContent: createStyleRules(),
    pageStyleContent: `.page {}`,

    stylesExt: options.style === 'less' ? options.style : 'css',

  };

  const generatedAppFilePath = options.src
    ? join(options.appProjectRoot, 'src')
    : options.appProjectRoot;

  generateFiles(
    host,
    join(__dirname, '../files/common'),
    options.appProjectRoot,
    templateVariables
  );

  if (options.appDir) {
    generateFiles(
      host,
      join(__dirname, '../files/app'),
      join(generatedAppFilePath, 'app'),
      templateVariables
    );

    generateFiles(
      host,
      join(__dirname, '../files/src'),
      join(generatedAppFilePath),
      templateVariables
    );

    if (options.unitTestRunner === 'none') {
      host.delete(
        joinPathFragments(
          options.appProjectRoot,
          'specs',
          `index.spec.${options.js ? 'jsx' : 'tsx'}`
        )
      );
    }

    generateFiles(
      host,
      join(__dirname, '../files/app-default-layout'),
      join(generatedAppFilePath, 'app'),
      templateVariables
    );

    generateFiles(
      host,
      join(__dirname, '../files/theme', options.ui),
      join(generatedAppFilePath),
      templateVariables
    );
  } else {
    generateFiles(
      host,
      join(__dirname, '../files/pages'),
      join(generatedAppFilePath, 'pages'),
      templateVariables
    );
  }

  if (options.rootProject) {
    updateJson(host, 'tsconfig.base.json', (json) => {
      const appJSON = readJson(host, 'tsconfig.json');

      let { extends: _, ...updatedJson } = json;

      // Don't generate the `paths` object or else workspace libs will not work later.
      // It'll be generated as needed when a lib is first added.
      delete json.compilerOptions.paths;

      updatedJson = {
        ...updateJson,
        compilerOptions: {
          ...updatedJson.compilerOptions,
          ...appJSON.compilerOptions,
        },
        include: [
          ...new Set([
            ...(updatedJson.include || []),
            ...(appJSON.include || []),
          ]),
        ],
        exclude: [
          ...new Set([
            ...(updatedJson.exclude || []),
            ...(appJSON.exclude || []),
            `dist/${options.projectName}/**/*`,
          ]),
        ],
      };
      return updatedJson;
    });
    host.delete('tsconfig.json');
    host.rename('tsconfig.base.json', 'tsconfig.json');
  }

  if (options.unitTestRunner === 'none') {
    host.delete(`${options.appProjectRoot}/specs/${options.fileName}.spec.tsx`);
  }

  // SWC will be disabled if custom babelrc is provided.
  // Check for `!== false` because `create-nx-workspace` is not passing default values.
  if (options.swc !== false) {
    host.delete(`${options.appProjectRoot}/.babelrc`);
  }

  if (options.styledModule || options.style === 'tailwind') {
    if (options.appDir) {
      host.delete(`${generatedAppFilePath}/app/page.module.${options.style}`);
    } else {
      host.delete(
        `${generatedAppFilePath}/pages/${options.fileName}.module.${options.style}`
      );
    }
  }

  if (options.style !== 'styled-components') {
    host.delete(`${generatedAppFilePath}/pages/_document.tsx`);
  }

  if (options.js) {
    host.delete(`${options.appProjectRoot}/index.d.ts`);
    toJS(host);
    host.delete(`${options.appProjectRoot}/next-env.d.js`);
  }
}


