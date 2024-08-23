# DCat23 Workspace

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

Run `npx nx graph` to visually explore what got created. Now, let's get you up to speed!


## Usage

1. Start local registry in root

    ```bash
    nx local-registry
    ```

2. Build and publish to local registry

    ```bash
    nx run-many --targets build
    nx run-many --targets nx-release-publish
    ```

3. Create temporary project

    ```bash
    cd tmp
    rm -rf ./frontend*
    npx nx g @dcat23/next-starter:preset macc-test-preset --directory tmp/frontend  
   ```

## Creating a Preset Generator

   ```sh
   npx nx generate @nx/plugin:generator --name preset --directory plugins/next-starter
   ```

## Run tasks

Build task
   ```sh
   npx nx build next-starter
   ```

Publish to NPM
   ```sh
   npx nx nx-release-publish next-starter
   ```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

To install a new plugin you can use the `nx add` command. Here's an example of adding the React plugin:
```sh
npx nx add @nx/react
```

Use the plugin's generator to create new projects. For example, to create a new React app or library:

```sh
# Genenerate an app
npx nx g @nx/react:app demo

# Generate a library
npx nx g @nx/react:lib some-lib
```

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/xGeP1adQJY)

You can use `npx nx list` to get a list of installed plugins. 

Then, run `npx nx list <plugin-name>` to learn about more specific 
capabilities of a particular plugin. 

Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and 
generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

