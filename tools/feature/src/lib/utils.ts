import { join } from 'path';
import { joinPathFragments, names, Tree } from '@nx/devkit';
import { FeatureSchema, Normalized } from './feature';
import { determineArtifactNameAndDirectoryOptions } from '@nx/devkit/src/generators/artifact-name-and-directory-utils';

interface DirectoryOptions {
  directory?: string;
  feature?: string;
}

export function deriveDirectory(options: DirectoryOptions): string {
  if (options.directory) return options.directory;
  const feature = options.feature || "";
  return join(feature && "features", feature)
}

export async function normalizeOptions<
  Schema extends FeatureSchema,
>(
  tree: Tree,
  packageName: string,
  generator: string,
  options: Schema,
  nameMutator = names
): Promise<Normalized<Schema>> {

  const {
    artifactName: name,
    directory,
    project: projectName,
  } = await determineArtifactNameAndDirectoryOptions(
    tree,
    {
      name: options.name,
      project: options.project,
      directory: deriveDirectory(options),
      artifactType: 'component',
      fileExtension: "tsx",
      callingGenerator: generator,
      nameAndDirectoryFormat: "as-provided",
    });

  const { name: artifactName, fileName, propertyName, className, constantName } = nameMutator(name)
  const filePath = join(packageName, fileName);
  const relativePath = join(directory, packageName);
  return {
    ...options,
    name,
    artifactName,
    className,
    constantName,
    fileName,
    propertyName,
    directory,
    filePath,
    relativePath,
    projectName,
  };

}

export function addToIndex(host: Tree, opts: Normalized<FeatureSchema>) {

  if (opts.skipExport) return;

  const indexFile = joinPathFragments(
    opts.directory,
    "index.ts"
  )

  const exportText = `export * from "./${opts.filePath}";`

  if (!host.exists(indexFile)) {
    host.write(indexFile, exportText)
    return;
  }

  let indexSource = host.read(indexFile, "utf-8");
  const lines = indexSource.split("\n");

  if (!lines.includes(exportText)) {
    lines.push(exportText)
    indexSource = lines.filter(l => !!l).sort().join("\n");
    host.write(indexFile, indexSource);
  }

}

