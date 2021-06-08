// ./pcfg_tool parse grammar.rules grammar.lexicon < sentences
import {Command} from '@oclif/command'
import {Grammar} from '../grammar'
import LineByLine = require('n-readlines')

function initializeMatrix(m: number, n: number): Set<string>[][] {
  const matrix: Set<string>[][] = []
  for (let i = 0; i < m; i++) {
    matrix[i] = []
    for (let j = 0; j < n + 1; j++) {
      matrix[i][j] = new Set()
    }
  }
  return matrix
}

function printMatrix(matrix: Array<Array<Set<string>>>): void {
  let header = ''
  for (let i = 0; i < matrix.length + 1; i++) {
    header = header + '        ' + i + '     '
  }
  console.log(header)
  for (let i = 0; i < matrix.length; i++) {
    // new row
    let row = i + ' '
    for (let j = 0; j < matrix[i].length; j++) {
      // new element
      let element = '['
      if (matrix[i][j].size > 0) {
        matrix[i][j].forEach(e => {
          element = element + e + ' , '
        })
      }
      if (element.endsWith(', ')) {
        element = element.substr(0, element.length - 2)
      }
      while (element.length < 12) {
        element += ' '
      }
      element += ']'
      row = row + ' ' + element
    }
    console.log(row)
  }
  console.log('\n')
}

function getWordProductionsFromLexiconFile(filePath: string, word: string): string[] {
  const wordProductions: string[] = []
  const liner = new LineByLine(filePath)

  let line = liner.next()

  while (line) {
    const str = line.toString('ascii')
    const [, rhs] = str.split(' ')
    if (rhs === word) {
      wordProductions.push(str)
    }
    line = liner.next()
  }

  return wordProductions
}

function getBinaryProductionsFromRulesFile(filePath: string, binaryProduction: string): string[] {
  const binaryProductions: string[] = []
  const liner = new LineByLine(filePath)

  let line = liner.next()

  while (line) {
    const str = line.toString('ascii')
    const regex = /(?<lhs>.*) -> (?<rhs>.*) (\d*).(\d*)/
    const matches = str.match(regex)
    const rhs = (matches as RegExpMatchArray).groups!.rhs
    const lhs: string = (matches as RegExpMatchArray).groups!.lhs

    if (binaryProduction === rhs) {
      binaryProductions.push(lhs)
    }
    line = liner.next()
  }

  return binaryProductions
}

function getAllCombinations(bs: Set<string>, cs: Set<string>): string[] {
  const allCombinations: string[] = []
  bs.forEach(b => {
    cs.forEach(c => {
      allCombinations.push(b + ' ' + c)
    })
  })
  return allCombinations
}

function cky(grammar: any, sentence: string, lexiconFilePath: string, rulesFilePath: string): Set<string>[][] {
  const words = sentence.split(' ')
  const matrix: Set<string>[][] = initializeMatrix(words.length, words.length)
  // Loop to get word production rules
  for (let i = 1; i <= words.length; i++) {
    // Loop to build the diagonal of the matrix
    words.forEach(w => {
      const rules = getWordProductionsFromLexiconFile(lexiconFilePath, words[i - 1]) // TODO: check use of words[i-1] instead of w
      if (rules) {
        rules.forEach(r => {
          const [nonTerminal] = r.split(' ')
          matrix[i - 1][i].add(nonTerminal)
        })
      }
    })
  }
  // Loop to .... TODO: fix loops
  for (let k = 2; k <= words.length; k++) {
    for (let i = k - 2; i >= 0; i--) {
      for (let j = i + 1; j <= k - 1; j++) {
        const bs: Set<string> = matrix[i][j]
        const cs: Set<string> = matrix[j][k]
        const allBCCombinations: string[] = getAllCombinations(bs, cs)
        allBCCombinations.forEach(rhs => {
          const binaryProductions = getBinaryProductionsFromRulesFile(rulesFilePath, rhs)
          binaryProductions.forEach(production => matrix[i][k].add(production))
        })
      }
    }
  }
  console.log('Final Matrix: ')
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
    const {args} = this.parse(Parse)
    const {rulesFilePath, lexiconFilePath, sentence} = args
    console.log(`📝 Parsing ${sentence}`)
    // console.log(`args = ${JSON.stringify(args)}`)
    // console.log(`flags = ${JSON.stringify(flags)}`)
    const g = Grammar.getInstance()

    cky(g, sentence, lexiconFilePath, rulesFilePath)
  }
}
