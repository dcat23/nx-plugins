# Feature

Nx generators to create components, hooks and apis in a NextJs
application

## Installation

```shell
npx nx add @dcat23/nx-feature
```

## Usage

### Components

Create a react component

```
npx nx generate @dcat23/nx-feature:component [name] [options,...]
```
*or* 
```
npx nx g component [name] [options,...]
```

Options
```
--name          The name of the component                       [ string  ]
--directory     Where to create the component.                  [ string  ]
--feature       The package name to store the component to.     [ string  ]
--skipExport    Will skip adding file to the relative index.ts  [ boolean ]

```
### API

Create a react API

```
npx nx generate @dcat23/nx-feature:api [name] [options,...]
```
*or* 
```
npx nx g api [name] [options,...]
```

Options
```
--name          The name of the component                             [ string  ]
--directory     Where to create the component.                        [ string  ]
--feature       The package name to store the component to.           [ string  ]
--skipExport    Will skip adding file to the relative index.ts        [ boolean ]
--hook          Will create the associated hook in the same directory [ boolean ]
```
### Hooks

Create a react hook component

```
npx nx generate @dcat23/nx-feature:hook [name] [options,...]
```
*or* 
```
npx nx g hook [name] [options,...]
```

Options
```
--name          The name of the component                       [ string  ]
--directory     Where to create the component.                  [ string  ]
--feature       The package name to store the component to.     [ string  ]
--skipExport    Will skip adding file to the relative index.ts  [ boolean ]
--mutation      Will create the hook with a Mutation method     [ boolean ]
--query         Will create the hook with a Query method        [ boolean ]
```

## Building

Run `nx build feature` to build the library.

## Running unit tests

Run `nx test feature` to execute the unit tests via [Jest](https://jestjs.io).
