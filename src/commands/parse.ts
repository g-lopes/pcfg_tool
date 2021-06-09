// ./pcfg_tool parse grammar.rules grammar.lexicon < sentences
import {Command} from '@oclif/command'
import LineByLine = require('n-readlines')

/**
 * @type {BooleanChart} 2D matrix of objects
 */
export type BooleanChart = ({[lhs: string]: boolean} | undefined)[][];

/**
 * @interface {string} filePath - Path of the .lexicon file
 */
export interface Production {
  lhs: string;
  rhs: string;
  weight: number;
}

/**
 * @param {string} filePath - Path of the .lexicon file
 * @param {string} word - Word (terminal) that we want to find production rules for
 * @returns {Production[]} All production rules that yield the given word
 */
export function getWordProductionsFromLexiconFile(filePath: string, word: string): Production[] {
  const wordProductions: Production[] = []
  const liner = new LineByLine(filePath)

  let line = liner.next()

  while (line) {
    const str = line.toString('ascii')
    const [lhs, rhs, weight] = str.split(' ')
    if (rhs === word) {
      wordProductions.push({lhs, rhs, weight: parseFloat(weight)})
    }
    line = liner.next()
  }
  return wordProductions
}

/**
 * @param {string} rulesFilePath - Path of the .lexicon file
 * @param {string} nonTerminal - Nonterminal which is on the lhs
 * @returns {Production[]} All production rules yielded by lhs with two nonterminals on the rhs
 */
export function getBinaryProductionsFromRulesFile(rulesFilePath: string, nonTerminal: string): Production[] {
  const binaryProductions: Production[] = []
  const liner = new LineByLine(rulesFilePath)

  let line = liner.next()

  while (line) {
    const str = line.toString('ascii')
    const regex = /(?<lhs>.*) -> (?<rhs>.* .*) (?<weight>\d.*]*)/
    const matches = str.match(regex)
    if (matches && matches.groups) {
      const {lhs, rhs, weight} = matches.groups

      if (lhs === nonTerminal) {
        binaryProductions.push({lhs, rhs, weight: parseFloat(weight)})
      }
    }
    line = liner.next()
  }

  return binaryProductions
}

/**
 * Given a sentence, returns a BooleanChart initialized with the words of the sentence
 * @param {string} sentence - Word (terminal) that we want to find production rules for
 * @param {string} lexiconFilePath - Path of the .lexicon file
 * @returns {BooleanChartWithKeyValue[]} All production rules that yield the given word
 */
export function initializeChart(sentence: string, lexiconFilePath: string): BooleanChart {
  const chart: BooleanChart = []
  const words = sentence.split(' ')
  for (let i = 0; i < words.length; i++) {
    chart[i] = []
    for (let j = 0; j <= words.length; j++) {
      chart[i][j] = {}
    }
  }
  // Loop to get word production rules
  for (let i = 1; i <= words.length; i++) {
    // Loop to build the diagonal of the matrix
    const rules = getWordProductionsFromLexiconFile(lexiconFilePath, words[i - 1])
    rules.forEach(r => {
      const {lhs} = r
      chart[i - 1][i]![lhs] = true
    })
  }
  return chart
}

/**
 * Reads each line of a .rules file and returns all nonterminals that appear on the LHS
 * @param {string} rulesFilePath - Path of the .rules file
 * @returns {string[]} All nonterminals on that appear on the LHS
 */
export function getAllNonterminals(rulesFilePath: string): string[] {
  const set = new Set<string>()
  const liner = new LineByLine(rulesFilePath)

  let line = liner.next()

  while (line) {
    const str = line.toString('ascii')
    const regex = /(?<nt>.*) -> .*/
    const matches = str.match(regex)
    if (matches && matches.groups) {
      const {nt} = matches.groups
      set.add(nt)
    }
    line = liner.next()
  }

  return [...set] // transforms set into array
}

/**
 * Reads each line of a .rules file and returns all nonterminals that appear on the LHS
 * @param {string} sentence - Sentence to be parsed using CYK
 * @param {string} lexiconFilePath - Path of the .lexicon file
 * @param {string} rulesFilePath - Path of the .rules file
 * @returns {BooleanChart} BooleanChart
 */
export function ckyChartBoolean(sentence: string, lexiconFilePath: string, rulesFilePath: string): BooleanChart {
  const chart: BooleanChart = initializeChart(sentence, lexiconFilePath)
  const words = sentence.split(' ')

  for (let r = 2; r <= words.length; r++) { // length of the span
    for (let i = 0; i <= words.length - r; i++) {
      const j = i + r

      const allNonTerminals = getAllNonterminals(rulesFilePath)
      allNonTerminals.forEach(nt => {
        for (let m = i + 1; m <= j - 1; m++) {
          const allBinaryRules = getBinaryProductionsFromRulesFile(rulesFilePath, nt)
          allBinaryRules.forEach(r => {
            const {lhs, rhs} = r /** weight is available as 3rd property if needed */
            const [B, C] = rhs.split(' ')
            const A = lhs
            if (chart[i][m]![B] && chart[m][j]![C]) chart[i][j]![A] = true
          })
        }
      })
    }
  }

  return chart
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
    // const g = Grammar.getInstance()

    ckyChartBoolean(sentence, lexiconFilePath, rulesFilePath)
  }
}

