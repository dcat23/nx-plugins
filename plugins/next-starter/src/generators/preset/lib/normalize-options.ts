import { NormalizedSchema, Schema } from '../schema';
import { joinPathFragments, names, readNxJson, Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { assertValidStyle } from '@nx/react';
import { Linter } from '@nx/eslint';
import { NextStarterPluginOptions } from "@dcat23/next-starter";

export async function normalizeOptions(
  host: Tree,
  options: Schema
): Promise<NormalizedSchema> {
  const {
    projectName: appProjectName,
    projectRoot: appProjectRoot,
    projectNameAndRootFormat,
  } = await determineProjectNameAndRootOptions(host, {
    name: options.name,
    projectType: 'application',
    directory: options.directory,
    projectNameAndRootFormat: options.projectNameAndRootFormat,
    rootProject: options.rootProject,
    callingGenerator: '@dcat23/next-starter:preset',
  });
  options.rootProject = appProjectRoot === '.';
  options.projectNameAndRootFormat = projectNameAndRootFormat;

  const nxJson = readNxJson(host);
  const addPlugin =
    process.env.NX_ADD_PLUGINS !== 'false' &&
    nxJson.useInferencePlugins !== false;

  options.addPlugin ??= addPlugin;

  let e2eWebServerTarget = options.addPlugin ? 'start' : 'serve';
  if (options.addPlugin) {
    if (nxJson.plugins) {
      for (const plugin of nxJson.plugins) {
        if (
          typeof plugin === 'object' &&
          plugin.plugin === '@dcat23/next-starter' &&
          (plugin.options as NextStarterPluginOptions).startTargetName
        ) {
          e2eWebServerTarget = (plugin.options as NextStarterPluginOptions)
            .startTargetName;
        }
      }
    }
  }

  let e2ePort = options.addPlugin ? 3000 : 4200;
  if (
    nxJson.targetDefaults?.[e2eWebServerTarget] &&
    (nxJson.targetDefaults?.[e2eWebServerTarget].options?.port ||
      nxJson.targetDefaults?.[e2eWebServerTarget].options?.env?.PORT)
  ) {
    e2ePort =
      nxJson.targetDefaults?.[e2eWebServerTarget].options?.port ||
      nxJson.targetDefaults?.[e2eWebServerTarget].options?.env?.PORT;
  }

  const e2eProjectName = options.rootProject ? 'e2e' : `${appProjectName}-e2e`;
  const e2eProjectRoot = options.rootProject ? 'e2e' : `${appProjectRoot}-e2e`;
  const e2eWebServerAddress = `http://localhost:${e2ePort}`;

  const name = names(options.name).fileName;

  const outputPath = joinPathFragments(
    'dist',
    appProjectRoot,
    ...(options.rootProject ? [name] : [])
  );

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const fileName = 'index';

  const appDir = options.appDir ?? true;
  const src = options.src ?? true;

  const styledModule = /^(css|scss|less|tailwind)$/.test(options.style)
    ? null
    : options.style;

  assertValidStyle(options.style);

  return {
    ...options,
    appDir,
    src,
    appProjectRoot,
    e2eProjectName,
    e2eProjectRoot,
    e2eWebServerAddress,
    e2eWebServerTarget,
    e2ePort,
    e2eTestRunner: options.e2eTestRunner || 'playwright',
    fileName,
    linter: options.linter || Linter.EsLint,
    name,
    outputPath,
    parsedTags,
    projectName: appProjectName,
    style: options.style || 'css',
    styledModule,
    unitTestRunner: options.unitTestRunner || 'jest',
    authType: options.authType || "github",
    database: options.database || 'postgres',
    ui: options.ui || 'mui',
  };
}
