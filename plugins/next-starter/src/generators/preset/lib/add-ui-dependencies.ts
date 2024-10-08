import { addDependenciesToPackageJson, GeneratorCallback, Tree } from '@nx/devkit';
import { NormalizedSchema, UiLibrary } from '../schema';
import { latestVersion } from "../../../utils/verions";

export const uiDependencies: Record<
  UiLibrary,
  {dependencies: Record<string,string>, devDependencies: Record<string,string>}
> = {
  'mui': {
    dependencies: {
      '@mui/material': latestVersion,
      '@mui/material-nextjs': latestVersion,
      '@mui/icons-material': latestVersion,
      '@emotion/react': latestVersion,
      '@emotion/styled': latestVersion,
    },
    devDependencies: {}
  },
  'radix': {
    dependencies: {
      '@radix-ui/themes': latestVersion,
      '@radix-ui/colors': latestVersion,
    },
    devDependencies: {}
  },
  'none': {
    dependencies: {},
    devDependencies: {}
  }
}

export function addUiDependencies(host: Tree, options: NormalizedSchema): GeneratorCallback {
  const dependencies = {
    "react-icons": latestVersion,
    ...uiDependencies[options.ui].dependencies,
  }
  const devDependencies = {
    ...uiDependencies[options.ui].devDependencies
  }
  return addDependenciesToPackageJson(
    host,
    dependencies,
    devDependencies,
  )
}
