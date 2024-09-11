import { PromiseExecutor, readJsonFile, writeJsonFile } from '@nx/devkit';
import { PublishExecutorSchema } from './schema';
import { join } from "path";
import { existsSync } from "fs";
import { execSync } from "child_process";

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

  const originalVersion = packageJson.version;
  if (options.tag) {
    packageJson.version = originalVersion + "-" + options.tag;
    console.log("Using tagged version", packageJson.version);
    writeJsonFile(packageJsonPath, packageJson);
  }


  try {
    console.log(`Publishing ${projectRoot}@${packageJson.version} ...`);
    execSync(`npm publish ${options.distPath} --access public`, { stdio: 'inherit' });
    if (packageJson.version != originalVersion) {
      const tagged = readJsonFile(packageJsonPath);
      tagged.version = originalVersion;
      console.log("Resetting version to", tagged.version);
      writeJsonFile(packageJsonPath, tagged);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to publish:', error);
    return { success: false };
  }
};

export default runExecutor;
