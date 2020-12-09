# Yarn Plugin Outdated

Yarn 2 plugin to show outdated dependencies.

## Installation

```sh
yarn plugin import https://github.com/mskelton/yarn-plugin-outdated/raw/main/bundles/@yarnpkg/plugin-outdated.js
```

## Usage

```sh
yarn outdated
```

### Options

| Definition       | Description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| `-A`, `--all`    | Include outdated dependencies from all workspaces.                      |
| `-W`, `--wanted` | Show the newest version within the semver range of the current version. |
| `--json`         | Output in JSON format instead of in the formatted table.                |
