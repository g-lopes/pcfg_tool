// ./pcfg_tool parse grammar.rules grammar.lexicon < sentences
import {Command} from '@oclif/command'
import {Grammar} from '../grammar'
import * as fs from 'fs'
import LineByLine = require('n-readlines')

function printMatrix(matrix: Array<Array<Set<string>>>): void {
  for (let i = 0; i < matrix.length; i++) {
    let str = ''
    for (let j = 0; j < matrix[i].length; j++) {
      str += '['
      if (matrix[i][j]) {
        matrix[i][j].forEach(e => {
          const [nonTerminal, terminal, weight]: string = e
          str = str + nonTerminal + ' '
        })
      }
      str += ']'
    }
    console.log(`${str}`)
  }
}

function getWordProductionsFromLexiconFile(filePath: string, word: string): string[] {
  const wordProductions: string[] = []
  const liner = new LineByLine(filePath)

  let line

  while (line = liner.next()) {
    const str = line.toString('ascii')
    const [lhs, rhs, weight] = str.split(' ')
    if (rhs === word) {
      wordProductions.push(str)
    }
  }

  return wordProductions
}

function getAllCombinations(bs: Set<string>, cs: Set<string>): string[] {
  const allCombinations: string[] = []
  const bIterator = bs.entries()
  const cIterator = cs.entries()
  for (const b of bIterator) {
    for (const c of cIterator) {
      const newRHS = `${b}${c}`
      allCombinations.push(newRHS)
    }
  }
  return allCombinations
}

function cky(grammar: any, sentence: string, lexiconFilePath: string): Set<string>[][] {
  const matrix: Set<string>[][] = []
  const words = sentence.split(' ')
  // Loop to get word production rules
  for (let i = 1; i < words.length; i++) {
    matrix[i - 1] = []
    matrix[i - 1][i] = new Set<string>()
    const rules = getWordProductionsFromLexiconFile(lexiconFilePath, words[i])
    if (rules) {
      rules.forEach(r => matrix[i - 1][i].add(r))
    }
    for (let j = i - 2; j === 0; j++) {
      for (let k = j + 1; k < i - 1; k++) {
        const bs: Set<string> = matrix[j][k]
        const cs: Set<string> = matrix[k][i]
        const allBCCombinations: string[] = getAllCombinations(bs, cs)
        // matrix[j][i]
      }
    }
  }

  printMatrix(matrix)
  return matrix
}

export default class Parse extends Command {
  // static description = 'describe the command here'

  //   static examples = [
  //     `$ pcfg_tool hello
  // hello world from ./src/hello.ts!
  // `,
  //   ]

  // static flags = {
  //   help: flags.help({char: 'h'}),
  //   // flag with a value (-n, --name=VALUE)
  //   name: flags.string({char: 'n', description: 'name to print'}),
  //   // flag with no value (-f, --force)
  //   force: flags.boolean({char: 'f'}),
  // }

  static args = [
    {
      name: 'rulesFilePath',
      required: false,
      description: 'Path of rules file',
    },
    {
      name: 'lexiconFilePath',
      required: false,
      description: 'Path of lexicon file',
    },
    {
      name: 'sentence',
      required: false,
      description: 'Sentence to be parsed',
    },
  ];

  async run() {
    console.log('📝 Parsing...')
    const {args} = this.parse(Parse)
    const {rulesFilePath, lexiconFilePath, sentence} = args
    // console.log(`args = ${JSON.stringify(args)}`)
    // console.log(`flags = ${JSON.stringify(flags)}`)
    const g = Grammar.getInstance()

    cky(g, sentence, lexiconFilePath)
  }
}
