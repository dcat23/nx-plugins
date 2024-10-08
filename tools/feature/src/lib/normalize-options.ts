import { join } from "path";
import { FeatureSchema, Normalized } from "./feature";
import { joinPathFragments, names, readProjectConfiguration, Tree } from "@nx/devkit";
import { noPrefixName, NoPrefixNameType } from "./helper";
import { determineArtifactNameAndDirectoryOptions } from "@nx/devkit/src/generators/artifact-name-and-directory-utils";


export function deriveDirectory(options: FeatureSchema): string {
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
  nameMutator = names,
): Promise<Normalized<Schema & NoPrefixNameType>> {

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

  const useSrc = !options.directory
  const { sourceRoot } = readProjectConfiguration(tree, projectName);

  const { name: artifactName, fileName, propertyName, className, constantName } = nameMutator(name)
  const filePath = joinPathFragments(packageName, fileName);
  const indexPath = joinPathFragments(`${useSrc && sourceRoot}`, directory);
  const relativePath = joinPathFragments(indexPath, packageName);

  const constant = options.constant || options.misc?.includes("constant") || options.allMisc
  const helper = options.helper || options.misc?.includes("helper") || options.allMisc
  const mapper = options.mapper || options.misc?.includes("mapper") || options.allMisc
  const types = options.types || options.misc?.includes("types") || options.allMisc


  return {
    artifactName,
    className,
    constantName,
    fileName,
    propertyName,
    filePath,
    indexPath,
    relativePath,
    ...options,
    name,
    directory,
    projectName,
    helper,
    mapper,
    constant,
    types,
    ...noPrefixName(artifactName),
  };

}
