import { names } from '@nx/devkit';

export function prefixName(name: string) {
  const prefix = /^use/.test(name) ? "" : "use";
  return names(prefix + "-" + name);
}
