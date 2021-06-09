pcfg_tool
=========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/pcfg_tool.svg)](https://npmjs.org/package/pcfg_tool)
[![Downloads/week](https://img.shields.io/npm/dw/pcfg_tool.svg)](https://npmjs.org/package/pcfg_tool)
[![License](https://img.shields.io/npm/l/pcfg_tool.svg)](https://github.com/playground/pcfg_tool/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g pcfg_tool
$ pcfg_tool COMMAND
running command...
$ pcfg_tool (-v|--version|version)
pcfg_tool/0.0.0 darwin-x64 node-v16.2.0
$ pcfg_tool --help [COMMAND]
USAGE
  $ pcfg_tool COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`pcfg_tool hello [FILE]`](#pcfg_tool-hello-file)
* [`pcfg_tool help [COMMAND]`](#pcfg_tool-help-command)

## `pcfg_tool hello [FILE]`

describe the command here

```
USAGE
  $ pcfg_tool hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ pcfg_tool hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/playground/pcfg_tool/blob/v0.0.0/src/commands/hello.ts)_

## `pcfg_tool help [COMMAND]`

display help for pcfg_tool

```
USAGE
  $ pcfg_tool help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->

# Regex:
/(?<lhs>.*) -> (?<rhs>[^ ]*) (?<weight>[0-9].[0-9]*)/ - recognizes unary rules inside .rules files
/(?<lhs>.*) -> (?<rhs>.* .*) (?<weight>[0-9].*]*)/ - recognizes binary rules inside .rules files
/(?<nt>.*) -> .*/ - matches the lhs of a rule
