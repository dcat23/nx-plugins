import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  type GeneratorCallback, ProjectConfiguration,
  readJson, readProjectConfiguration,
  removeDependenciesFromPackageJson,
  runTasksInSerial,
  Tree,
  writeJson,
} from '@nx/devkit';
import * as path from 'path';
import { InitGeneratorSchema } from './schema';
import { featureVersion, latestVersion } from "./lib/versions";

export async function initGenerator(tree: Tree, options: InitGeneratorSchema) {
  return initGeneratorInternal(tree, {
    projectRoot: ".",
    name: "features",
    ...options
  });
}

function updateDependencies(host: Tree, schema: InitGeneratorSchema) {
  const tasks: GeneratorCallback[] = [];
  tasks.push(removeDependenciesFromPackageJson(host, ['@dcat23/nx-feature'], []));

  tasks.push(
    addDependenciesToPackageJson(
      host,
      {
        '@tanstack/react-query': latestVersion,
        'axios': latestVersion,
        'sonner': latestVersion,
        'zod': latestVersion,
        'zustand': latestVersion,
      },
      {
        '@dcat23/nx-feature': featureVersion,
      },
      undefined,
      schema.keepExistingVersions
    )
  );

  return runTasksInSerial(...tasks);
}

function setDefaultTsConfig(tree: Tree, options: InitGeneratorSchema) {
  const tsConfigPath = path.join(options.projectRoot, "tsconfig.json")


  const tsConfig = tree.exists(tsConfigPath)
    ? readJson(tree, tsConfigPath)
    : {}

  tsConfig["compilerOptions"] ??= {};
  tsConfig["compilerOptions"]["baseUrl"] ??= options.projectRoot;
  tsConfig["compilerOptions"]["paths"] ??= {};
  tsConfig["compilerOptions"]["paths"]["@/*"] ??= [];

  const srcPath = `${options.projectRoot}/src/*`;
  const paths = tsConfig["compilerOptions"]["paths"]["@/*"] as string[]
  if (!paths.includes(srcPath)) {
    paths.push(srcPath);
    tsConfig["compilerOptions"]["paths"]["@/*"] = paths;
  }

  writeJson(tree, tsConfigPath, tsConfig);
}

export async function initGeneratorInternal(tree: Tree, options: InitGeneratorSchema) {
  const projectRoot = options.projectRoot;
  const projectName = options.name;

  let projectConfig: ProjectConfiguration;

  try {

    projectConfig = readProjectConfiguration(tree, projectName);
  } catch (error) {

    console.log({error})
    projectConfig = {
      root: projectRoot,
      projectType: 'library',
      sourceRoot: `${projectRoot}/src`,
      targets: {},
    };
    addProjectConfiguration(tree, projectName, projectConfig);
  }

  const templateOptions = {
    ...options,
    tmpl: ""
  }

  setDefaultTsConfig(tree, options)

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, templateOptions);
  await formatFiles(tree);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let installTask: GeneratorCallback = () => {};
  if (!options.skipPackageJson) {
    installTask = updateDependencies(tree, options);
  }

  return installTask;
}

export default initGenerator;
