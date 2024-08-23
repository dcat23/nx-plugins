import { addDependenciesToPackageJson, GeneratorCallback, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function addMuiDependencies(host: Tree, options: NormalizedSchema): GeneratorCallback {
  const dependencies = {
    '@mui/material': 'latest',
    '@mui/icons-material': 'latest',
  }
  const devDependencies = {}

  if (options.style === "styled-components") {
    dependencies['@mui/styled-engine-sc'] = 'latest'
    dependencies['styled-components'] = 'latest'
  } else {
    dependencies['@emotion/react'] = 'latest'
    dependencies['@emotion/styled'] = 'latest'
  }
  return addDependenciesToPackageJson(
    host,
    dependencies,
    devDependencies,
  )
}
