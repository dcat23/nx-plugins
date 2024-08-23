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
import { InitSchema } from './schema';
import { reactDomVersion, reactVersion } from '@nx/react/src/utils/versions';
import {latestVersion, nextVersion, nxVersion} from '../../utils/verions';
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
        'axios': latestVersion,
        'sonner': latestVersion,
        '@tanstack/react-query': latestVersion,
        'zod': latestVersion,
        'zustand': latestVersion,
      },
      {
        '@nx/next': nxVersion,
        '@dcat23/nx-feature': latestVersion,
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
    // const { createNodes } = await import('@nx/next/src/plugins/plugin');
    // await addPluginV1(
    //   host,
    //   await createProjectGraphAsync(),
    //   '@nx/next/plugin',
    //   createNodes,
    //   {
    //     startTargetName: ['start', 'next:start', 'next-start'],
    //     buildTargetName: ['build', 'next:build', 'next-build'],
    //     devTargetName: ['dev', 'next:dev', 'next-dev'],
    //     serveStaticTargetName: [
    //       'serve-static',
    //       'next:serve-static',
    //       'next-serve-static',
    //     ],
    //   },
    //   schema.updatePackageScripts
    // );
  }

  addGitIgnoreEntry(host);

  let installTask: GeneratorCallback = () => {};
  if (!schema.skipPackageJson) {
    installTask = updateDependencies(host, schema);
  }

  return installTask;
}

export default initGenerator;
