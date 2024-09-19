import {
  addDependenciesToPackageJson,
  createProjectGraphAsync,
  type GeneratorCallback,
  readNxJson,
  removeDependenciesFromPackageJson,
  runTasksInSerial,
  type Tree,
} from '@nx/devkit';
import { addPluginV1 } from '@nx/devkit/src/utils/add-plugin';
import { InitSchema } from './schema';
import { reactDomVersion, reactVersion } from '@nx/react/src/utils/versions';
import { latestVersion, nextAuthVersion, nextStarterVersion, nextVersion } from '../../utils/verions';
import { addGitIgnoreEntry } from '@nx/next/src/utils/add-gitignore-entry';

function updateDependencies(host: Tree, schema: InitSchema) {
  const tasks: GeneratorCallback[] = [];

  tasks.push(removeDependenciesFromPackageJson(host, ['@dcat23/next-starter'], [
    '@nx/next',
    '@nx/js',
  ]));

  tasks.push(
    addDependenciesToPackageJson(
      host,
      {
        '@auth/prisma-adapter': latestVersion,
        '@prisma/client': latestVersion,
        '@tanstack/react-query': latestVersion,
        'next': nextVersion,
        'react': reactVersion,
        'axios': latestVersion,
        'react-dom': reactDomVersion,
        'next-auth': nextAuthVersion,
      },
      {
        '@dcat23/next-starter': nextStarterVersion,
        'prisma': latestVersion
      },
      undefined,
      schema.keepExistingVersions
    )
  );

  return runTasksInSerial(...tasks);
}

export function initGenerator(tree: Tree, schema: InitSchema) {
  return initGeneratorInternal(tree, { addPlugin: false, ...schema });
}

export async function initGeneratorInternal(
  host: Tree,
  schema: InitSchema
) {
  const nxJson = readNxJson(host);
  const addPluginDefault =
    process.env.NX_ADD_PLUGINS !== 'false' &&
    nxJson.useInferencePlugins !== false;

  schema.addPlugin ??= addPluginDefault;
  if (schema.addPlugin) {
    const { createNodes } = await import('@dcat23/next-starter');
    await addPluginV1(
      host,
      await createProjectGraphAsync(),
      '@dcat23/next-starter',
      createNodes,
      {
        startTargetName: ['start', 'next:start', 'next-start'],
        buildTargetName: ['build', 'next:build', 'next-build'],
        devTargetName: ['dev', 'next:dev', 'next-dev'],
        serveStaticTargetName: [
          'serve-static',
          'next:serve-static',
          'next-serve-static',
        ],
      },
      schema.updatePackageScripts
    );
  }

  addGitIgnoreEntry(host);

  let installTask: GeneratorCallback = () => {};
  if (!schema.skipPackageJson) {
    installTask = updateDependencies(host, schema);
  }

  return installTask;
}

export default initGenerator;
