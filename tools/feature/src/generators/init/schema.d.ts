export interface InitGeneratorSchema {
  projectRoot: string;
  name: string;
  skipPackageJson?: boolean;
  keepExistingVersions?: boolean;
}
