import { PromiseExecutor, readJsonFile, writeJsonFile } from '@nx/devkit';
import { PublishExecutorSchema } from './schema';
import { join } from "path";
import { existsSync } from "fs";
import { execSync } from "child_process";

function resetVersion(packageJsonPath: string, packageJson: any, originalVersion: string) {

}

const runExecutor: PromiseExecutor<PublishExecutorSchema> = async (
  options,
  context
) => {

  const projectRoot = context.projectGraph.nodes[context.projectName].data.root;
  const distPath = options.distPath ?? join("dist", projectRoot);
  const packageJsonPath = join(distPath, 'package.json');
  const packageJson = existsSync(packageJsonPath)
    ? readJsonFile(packageJsonPath)
    : undefined;

  if (options.tag) {
    packageJson.version += "-" + options.tag;
    writeJsonFile(packageJsonPath, packageJson);
  }


  try {
    console.log(`Publishing ${projectRoot}@${packageJson.version} ...`);
    execSync(`npm publish ${options.distPath} --access public`, { stdio: 'inherit' });

    return { success: true };
  } catch (error) {
    console.error('Failed to publish:', error);
    return { success: false };
  }
};

export default runExecutor;
