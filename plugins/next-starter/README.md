# next-starter

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build next-starter` to build the library.

## Running unit tests

Run `nx test next-starter` to execute the unit tests via [Jest](https://jestjs.io).

## Running

```sh
rm -rf macchiato*
npx nx g @dcat23/next-starter:preset macchiato \
--pm pnpm --ci github --auth github --db postgres \
--e2eTestRunner none --ui mui --style css --dry-run --verbose 
```
