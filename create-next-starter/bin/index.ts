#!/usr/bin/env node

import { createWorkspace } from 'create-nx-workspace';
import { getCreateWorkspaceOptions } from "./workspace-options";

async function main() {
  const options = await getCreateWorkspaceOptions(process.argv.slice(2))

  console.log(`Creating the workspace: ${options.name}`);

  // This assumes "@dcat23/next-starter" and "create-next-starter" are at the same version
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const presetVersion = require('../package.json').version;

  const { directory } = await createWorkspace(
    `@dcat23/next-starter@${presetVersion}`,
    {
      database: "postgres",
      ui: "mui",
      style: "tailwind",
      auth: "github",
      packageManager: "pnpm",
      ...options,
    }
  );

  console.log(`Successfully created the workspace: ${directory}.`);
}

main();
