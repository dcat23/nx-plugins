import {
  addDependenciesToPackageJson,
  formatFiles,
  GeneratorCallback,
  joinPathFragments,
  runTasksInSerial,
  Tree
} from '@nx/devkit';
import {Schema} from './schema';
import {showPossibleWarnings} from '@nx/next/src/generators/application/lib/show-possible-warnings';
import {addE2e} from '@nx/next/src/generators/application/lib/add-e2e';
import {addJest} from '@nx/next/src/generators/application/lib/add-jest';
import {setupTailwindGenerator} from '@nx/react';
import {addStyleDependencies} from '@nx/next/src/utils/styles';
import {updateJestConfig} from '@nx/next/src/generators/application/lib/update-jest-config';
import {updateCypressTsConfig} from '@nx/next/src/generators/application/lib/update-cypress-tsconfig';
import {customServerGenerator} from '@nx/next/src/generators/custom-server/custom-server';
import {testingLibraryReactVersion, typesReactDomVersion, typesReactVersion} from '@nx/react/src/utils/versions';
import {addLinting} from '@nx/next/src/generators/application/lib/add-linting';
import {tsLibVersion} from '@nx/next/src/utils/versions';
import {logShowProjectCommand} from '@nx/devkit/src/utils/log-show-project-command';
import {createApplicationFiles} from './lib/create-application-files';
import {normalizeOptions} from './lib/normalize-options';
import {addMuiDependencies} from './lib/utils';
import initGenerator from "../init/generator";
import {addProject} from "./lib/add-project";
import {addFeature} from "./lib/add-feature";
import {setDefaults} from "./lib/set-defaults";

export async function presetGenerator(
  host: Tree,
  schema: Schema
) {
  return presetGeneratorInternal(host, {
    addPlugin: true,
    authType: "github",
    ui: "mui",
    database: "postgres",
    projectNameAndRootFormat: 'derived',
    rootProject: false,
    ...schema,
    js: false
  })
}

export async function presetGeneratorInternal(
  host: Tree,
  schema: Schema
) {

  const tasks: GeneratorCallback[] = [];
  const options = await normalizeOptions(host, schema);

  showPossibleWarnings(host, options);

  const initTask = await initGenerator(host, {
    ...options,
    skipFormat: true,
  });
  tasks.push(initTask);

  createApplicationFiles(host, options);

  addProject(host, options);
  // addFeature(host, options);

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

  // const styledTask = addStyleDependencies(host, {
  //   style: options.style,
  //   swc: !host.exists(joinPathFragments(options.appProjectRoot, '.babelrc')),
  // });
  // tasks.push(styledTask);

  if (options.ui === "mui") {
    const muiTask = addMuiDependencies(host, options)
    tasks.push(muiTask)
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
