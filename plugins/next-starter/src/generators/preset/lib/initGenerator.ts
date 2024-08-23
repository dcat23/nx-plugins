import {
  addDependenciesToPackageJson,
  createProjectGraphAsync,
  type GeneratorCallback,
  readNxJson,
  removeDependenciesFromPackageJson,
  runTasksInSerial,
  type Tree
} from '@nx/devkit';
import { addPluginV1 } from '@nx/devkit/src/utils/add-plugin';
import { InitSchema } from '@nx/next/src/generators/init/schema';
import { nxVersion, prismaVersion, reactDomVersion, reactVersion } from './versions';
import { nextVersion } from '@nx/next/src/utils/versions';
import { addGitIgnoreEntry } from '@nx/next/src/utils/add-gitignore-entry';

function updateDependencies(host: Tree, schema: InitSchema) {
  const tasks: GeneratorCallback[] = [];

  tasks.push(removeDependenciesFromPackageJson(host, ['@nx/next'], []));

  tasks.push(
    addDependenciesToPackageJson(
      host,
      {
        next: nextVersion,
        react: reactVersion,
        'react-dom': reactDomVersion,
        'axios': 'latest',
        '@next-auth/prisma-adapter': '^1.0.7',
        '@prisma/client': prismaVersion,
        'sonner': '^1.2.0',
        '@tanstack/react-query': '^5.29.0',
        'zod': '^3.22.4',
        'zustand': '^4.5.2',
      },
      {
        '@nx/next': nxVersion,
        'prisma': prismaVersion,
      },
      undefined,
      schema.keepExistingVersions
    )
  );

  return runTasksInSerial(...tasks);
}

export function nextInitGenerator(tree: Tree, schema: InitSchema) {
  return nextInitGeneratorInternal(tree, { addPlugin: false, ...schema });
}

export async function nextInitGeneratorInternal(
  host: Tree,
  schema: InitSchema
) {
  const nxJson = readNxJson(host);
  const addPluginDefault =
    process.env.NX_ADD_PLUGINS !== 'false' &&
    nxJson.useInferencePlugins !== false;

  schema.addPlugin ??= addPluginDefault;
  if (schema.addPlugin) {
    const { createNodes } = await import('@nx/next/src/plugins/plugin');
    await addPluginV1(
      host,
      await createProjectGraphAsync(),
      '@nx/next/plugin',
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

export default nextInitGenerator;
