import yargs = require("yargs");
import { names } from "@nx/devkit";
import type { NxCloud } from "create-nx-workspace/src/utils/nx/nx-cloud";

export async function getCreateWorkspaceOptions(args: string[]) {
  const parser = yargs(args)
    .command('<name>', 'Create a Next.js Application for Nx', (yargs) => {
      yargs.positional('name', {
        describe: 'The name of the application',
        type: 'string',
        demandOption: true,
      })
    }, (argv) => {
      if (!/^[a-zA-Z][^:]*$/.test(argv.name as string)) {
        throw new Error('Invalid name pattern');
      }
    })
    .option("nxCloud", {
      alias: "ci",
      type: "string",
      default: "github"
    })

  const argv = await parser.parse();
  const name = names(argv._[0] as string).name;
  const nxCloud = argv.nxCloud as NxCloud;

  return {
    ...argv,
    nxCloud,
    name
  }
}
