pcfg_tool
=========

<!-- toc -->
* [Requirements](#requirements)
* [Installation](#installation)
* [Commands](#commands)
* [Regex](#regex)
* [Observations](#obs)
<!-- tocstop -->

<!-- requirements -->
# Requirements
- yarn
- make
<!-- requirementsstop -->
# Installation
Just run the make file inside the project's main directory. This installs the dependencies using yarn, then creates a softlink in the current directory, allowing the user to run
`$ pcfg_tool [COMMAND]`
<!-- installation -->
```sh-session
$ make -f Makefile
```
<!-- usagestop -->
# Commands
<!-- commands -->
* `pcfg_tool [COMMAND]` - Tool parse natural language based on PCFG
* [`pcfg_tool induce [FILE]`](#pcfg_tool-induce)
* [`pcfg_tool parse [COMMAND]`](#pcfg_tool-parse)

## `pcfg_tool induce [GRAMMAR]`

Reads a sequence of constituent trees from stdin and outputs a PCFG induced from these trees on the stdout.
If the optional argument GRAMMAR is given, then the grammar
is stored in 3 files (GRAMMAR.words, GRAMMAR.lexicon and GRAMMAR.rules), instead of being displayed on stdout.

```
USAGE
  $ pcfg_tool induce [GRAMMAR]

EXAMPLE
  $ pcfg_tool induce (A (B b))
  A -> B 1
  B b 1
```

_See code: [src/commands/induce.ts](https://github.com/g-lopes/pcfg_tool_2/blob/master/src/commands/induce.ts)_

## `pcfg_tool parse [OPTIONS] RULES LEXICON`

Reads a sequence of natural language sentences from stin and outputs the best parsing tree to the input sentences in PTB format. If no parsing tree is found, then outputs NOPARSE <sentence> in the stdout. RULES and LEXICON are the names of the PCFG.

```
USAGE
  $ pcfg_tool parse [OPTIONS] RULES LEXICON

ARGUMENTS
  RULES  Path of .rules file
  LEXICON  Path of .lexicon file

OPTIONS
    -h --help: help documentation,
    -p --paradigma=PARADIGMA Paradigma used to parse (cyk or deductive)
    -i --initial-nonterminal=N Set N as start symbol. If not set, then the default value is ROOT
    -u --unlink Replaces unknown words with UNK'
    -s --smoothing Replaces unknown words according to the smoothing implementation
    -t --threshold-beam=THRESHOLD Runs Beam-Search with THRESHOLD
    -r --rank-beam=RANK Runs Beam-Search with Beam of constant size
    -k --kbest=K Outputs K best parsing trees instead of only the best
    -a --astar=PATH Runs A*-Search. Load outside weights from the file PATH
```

_See code: [src/commands/parse.ts](https://github.com/g-lopes/pcfg_tool_2/blob/master/src/commands/parse.ts)_
<!-- commandsstop -->

<!-- regex -->
# Regex:
 - `/(?<lhs>.*) -> (?<rhs>[^ ]*) (?<weight>[0-9].[0-9]*)/` recognizes unary rules inside .rules files
- `/(?<lhs>.*) -> (?<rhs>.* .*) (?<weight>[0-9].*]*)/` - recognizes binary rules inside .rules files
- `/(?<nt>.*) -> .*/` - matches the lhs of a rule
- `/(?<lhs>.*) -> (?<rhs>[^ ]*) (?<weight>\d.*]*)/` - matches unary productions A -> B w
<!-- regexstop -->

<!-- obs -->
# Observations:
If a command is not implemented (yet) it exits with an error code 22.
<!-- obsstop -->
