# Create Next Starter

Creates an NX workspace with the [@dcat23/next-starter](https://github.com/dcat23/dcat23-nx/tree/main/create-next-starter#) 
preset.


## Usage

```
npx @dcat23/create-next-starter my-app 

  Create a Next.js Application within a NX workspace.

Commands:
    @dcat23/create-next-starter <name> 


Options:
    
    --name                        The name of the application                                              [string ]
    
    --directory, --dir            The directory of the new application                                     [string ]
    
    --authType, --auth            The authentication provider to use with next-auth                        [string ] [choices: "github", "google"] [default: "github"]
    
    --customServer                Use a custom Express server for the Next.js application                  [boolean]
    
    --database, --db              The database to use.                                                     [string ] [choices: "postgres", "mysql"] [default: "postgres"]
    
    --e2eTestRunner               Test runner to use for end to end (E2E) tests.                           [string ] [choices: "playwright", "none"] [default: "none"]
    
    --linter                      The tool to use for running lint checks.                                 [string ] [choices: "eslint"] [default: "eslint"]
    
    --package-manager, --pm       The package manager to use in the workspace.                             [string ] [choices: "npm", "pnpm", "yarn"] [default: "npm"]
    
    --projectNameAndRootFormat    Whether to generate the project name and root directory as               [string ] [choices: "as-provided", "derived"]
                                  provided (`as-provided`) or generate them composing their values
                                  and taking the configured layout into account (`derived`).
                                  
    --rootProject                 Create an application at the root of the workspace.                      [boolean] [default: true]
    
    --setParserOptionsProject     Whether or not to configure the ESLint `parserOptions.project`           [boolean]
                                  option. We do not do this by default for lint performance reasons.
    
    --style, -s                   The file extension to be used for style files.                           [string ] [default: "css"]
    
    --swc                         Enable the Rust-based compiler SWC to compile JS/TS files.               [boolean] [default: true]
    
    --tags, -t                    Add tags to the application (used for linting).                          [string ]
    
    --ui                          The UI component library to use                                          [string ] [choices: "radix", "mui", "none"] [default: "mui"]
    
    --unitTestRunner              Test runner to use for unit tests.                                       [string ] [choices: "jest", "none"] [default: "jest"]
    
    --skipFormat                  Skip formatting files.                                                   [boolean]
    
    --skipPackageJson             Do not add dependencies to `package.json`.                               [boolean]


```

## Building

Run `nx build create-next-starter` to build the library.

## Running unit tests

Run `nx test create-next-starter` to execute the unit tests via [Jest](https://jestjs.io).
