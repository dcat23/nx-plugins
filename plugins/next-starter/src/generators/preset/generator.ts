import {
  addDependenciesToPackageJson,
  formatFiles,
  GeneratorCallback,
  readProjectConfiguration,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import { Schema } from './schema';
import { initGenerator as jsInitGenerator } from '@nx/js';
import { showPossibleWarnings } from '@nx/next/src/generators/application/lib/show-possible-warnings';
import { addE2e } from '@nx/next/src/generators/application/lib/add-e2e';
import { addJest } from '@nx/next/src/generators/application/lib/add-jest';
import { setupTailwindGenerator } from '@nx/react';
import { updateJestConfig } from '@nx/next/src/generators/application/lib/update-jest-config';
import { updateCypressTsConfig } from '@nx/next/src/generators/application/lib/update-cypress-tsconfig';
import { testingLibraryReactVersion, typesReactDomVersion, typesReactVersion } from '@nx/react/src/utils/versions';
import { addLinting } from '@nx/next/src/generators/application/lib/add-linting';
import { tsLibVersion } from '@nx/next/src/utils/versions';
import { logShowProjectCommand } from '@nx/devkit/src/utils/log-show-project-command';
import { createApplicationFiles } from './lib/create-application-files';
import { normalizeOptions } from './lib/normalize-options';
import { addUiDependencies } from './lib/add-ui-dependencies';
import initGenerator from "../init/generator";
import { addProject } from "./lib/add-project";
import { setDefaults } from "./lib/set-defaults";
import { initGenerator as featureInitGenerator } from '@dcat23/nx-feature';


export async function presetGenerator(
  host: Tree,
  schema: Schema
) {
  return presetGeneratorInternal(host, {
    addPlugin: false,
    rootProject: false,
    projectNameAndRootFormat: 'derived',
    ...schema,
  })
}

export async function presetGeneratorInternal(
  host: Tree,
  schema: Schema
) {

  const tasks: GeneratorCallback[] = [];
  const options = await normalizeOptions(host, schema);

  showPossibleWarnings(host, options);

  const jsInitTask = await jsInitGenerator(host, {
    js: options.js,
    skipPackageJson: options.skipPackageJson,
    skipFormat: true,
  });
  tasks.push(jsInitTask);

  const initTask = await initGenerator(host, {
    ...options,
    skipFormat: true,
  });
  tasks.push(initTask);


  createApplicationFiles(host, options);

  addProject(host, options);

  const featureInitTask = await featureInitGenerator(host, {
    ...options,
    projectRoot: options.appProjectRoot,
    keepExistingVersions: true
  });
  tasks.push(featureInitTask);

  const e2eTask = await addE2e(host, options);
  tasks.push(e2eTask);

  const jestTask = await addJest(host, options);
  tasks.push(jestTask);

  const lintTask = await addLinting(host, options);
  tasks.push(lintTask);

  if (options.style === 'tailwind') {
    const tailwindTask = await setupTailwindGenerator(host, {
      project: options.projectName,
    });

    tasks.push(tailwindTask);
  }

  if (options.ui !== "none") {
    const uiTask = addUiDependencies(host, options)
    tasks.push(uiTask)
  }

  updateJestConfig(host, options);
  updateCypressTsConfig(host, options);
  setDefaults(host, options);

  if (!options.skipPackageJson) {
    const devDependencies: Record<string, string> = {
      '@types/react': typesReactVersion,
      '@types/react-dom': typesReactDomVersion,
    };

    if (schema.unitTestRunner && schema.unitTestRunner !== 'none') {
      devDependencies['@testing-library/react'] = testingLibraryReactVersion;
    }

    tasks.push(
      addDependenciesToPackageJson(
        host,
        { tslib: tsLibVersion },
        devDependencies
      )
    );
  }

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  tasks.push(() => {
    logShowProjectCommand(options.projectName);
  });

  return runTasksInSerial(...tasks);
}

export default presetGenerator;
