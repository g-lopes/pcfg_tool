import {Command, flags} from '@oclif/command'
import * as readline from 'readline'
import LineByLine = require('n-readlines')
import * as fs from 'fs'

/**
 * @type {BooleanChart} 2D matrix of objects
 */
export type BooleanChart = ({[lhs: string]: boolean})[][];
/**
 * @type {WeightChart} 2D matrix of objects
 */
export type WeightChart = ({[lhs: string]: number})[][];
/**
 * @type {BackChart} 2D matrix of objects
 */
export type BackChart = ({[lhs: string]: any[]})[][];

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
 * @param {string} rulesFilePath - Path of the .lexicon file
 * @param {string} nonTerminal - Nonterminal which is on the lhs
 * @returns {Production[]} All production rules yielded by lhs with two nonterminals on the rhs
 */
export function getAllUnaryProductionsFromRulesFile(rulesFilePath: string): Production[] {
  const unaryProductions: Production[] = []
  const liner = new LineByLine(rulesFilePath)

  let line = liner.next()

  while (line) {
    const str = line.toString('ascii')
    const regex = /(?<lhs>.*) -> (?<rhs>[^ ]*) (?<weight>\d.*]*)/
    const matches = str.match(regex)
    if (matches && matches.groups) {
      const {lhs, rhs, weight} = matches.groups
      unaryProductions.push({lhs, rhs, weight: parseFloat(weight)})
    }
    line = liner.next()
  }

  return unaryProductions
}

/**
 * Given a sentence, returns a BooleanChart initialized with the words of the sentence
 * @param {string} sentence - Word (terminal) that we want to find production rules for
 * @param {string} lexiconFilePath - Path of the .lexicon file
 * @returns {BooleanChart} All production rules that yield the given word
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

export function unaryClosure(rulesFilePath: string, chart: WeightChart, i: number, j: number, back: BackChart) {
  const unaryProductions: Production[] = getAllUnaryProductionsFromRulesFile(rulesFilePath)
  let newRule = true
  let _weight: number
  let _currentValue: number

  while (newRule) {
    newRule = false
    unaryProductions.forEach(unaryProd => {
      const {lhs, rhs, weight} = unaryProd
      if (chart[i][j][lhs]) {
        _currentValue = chart[i][j][lhs]
      } else {
        _currentValue = 0
      }

      if (chart[i][j][rhs]) {
        _weight = weight * chart[i][j][rhs]
      } else {
        _weight = 0
      }

      if (_weight > _currentValue) {
        newRule = true
        chart[i][j][lhs] = _weight
        back[i][j][lhs] = [-1, rhs, null]
      }
    })
  }
}

/**
 * Given a sentence, returns a WeightChart initialized with the words of the sentence
 * @param {string} sentence - Word (terminal) that we want to find production rules for
 * @param {string} lexiconFilePath - Path of the .lexicon file
 * @param {string} rulesFilePath - Path of the .rules file
 * @param {Ba} back - BackChart
 * @returns {WeightChart} All production rules that yield the given word
 */
export function initializeWeightChart(sentence: string, lexiconFilePath: string, rulesFilePath: string, back: BackChart): WeightChart {
  const chart: WeightChart = []
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
      const {lhs, weight} = r
      chart[i - 1][i]![lhs] = weight
    })
    unaryClosure(rulesFilePath, chart, i - 1, i, back)
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
 * Simple version of cyk algorithm. Doesn't use weights but booleans
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

export function initializeBackChart(sentence: string): BackChart {
  const back: BackChart = []

  const words = sentence.split(' ')
  for (let i = 0; i < words.length; i++) {
    back[i] = []
    for (let j = 0; j <= words.length; j++) {
      back[i][j] = {}
    }
  }
  return back
}

/**
 * More complex version of cyk algorithm. Uses weights to make decisions.
 * @param {string} sentence - Sentence to be parsed using CYK
 * @param {string} lexiconFilePath - Path of the .lexicon file
 * @param {string} rulesFilePath - Path of the .rules file
 * @returns {WeightChart} WeightChart
 */
export function ckyChartWeight(sentence: string, lexiconFilePath: string, rulesFilePath: string): [WeightChart, BackChart] {
  const back: BackChart = initializeBackChart(sentence)
  const chart: WeightChart = initializeWeightChart(sentence, lexiconFilePath, rulesFilePath, back)
  const words = sentence.split(' ')

  for (let r = 2; r <= words.length; r++) { // length of the span
    for (let i = 0; i <= words.length - r; i++) {
      const j = i + r

      const allNonTerminals = getAllNonterminals(rulesFilePath)
      allNonTerminals.forEach(nt => {
        for (let m = i + 1; m <= j - 1; m++) {
          const allBinaryRules = getBinaryProductionsFromRulesFile(rulesFilePath, nt)
          allBinaryRules.forEach(r => {
            const {lhs, rhs, weight} = r /** weight is available as 3rd property if needed */
            const [B, C] = rhs.split(' ')
            const A = lhs
            if (chart[i][m]![B] && chart[m][j]![C]) {
              // updateFunction
              const ruleWeight: number = chart[i][m]![B] * chart[m][j]![C] * weight
              if (!chart[i][j][A]) {
                chart[i][j][A] = 0
              }
              if (ruleWeight > chart[i][j]![A]) {
                chart[i][j]![A] = ruleWeight
                back[i][j]![A] = [m, B, C]
              }
            }
          })
        }
        // unary logic
      })
      unaryClosure(rulesFilePath, chart, i, j, back)
    }
  }

  return [chart, back]
}

/**
 *
 * @param {string} lexiconFile - Path of the .lexicon file
 * @param {string} sentence - sentence
 * @returns {boolean} true if all words of sentence is in .words file, false otherwise
 */
export function isInLexicon(lexiconFile: string, sentence: string): boolean {
  const liner = new LineByLine(lexiconFile)
  const words = new Set(sentence.split(' '))

  let line = liner.next()

  while (line) {
    const str = line.toString('ascii')
    const [,rhs] = str.split(' ')
    if(words.has(rhs)) {
      words.delete(rhs)
    }

    line = liner.next()
  }

  return words.size === 0
}

/**
 * splits the input strings into an array of words and check
 * if all words of the input string are in the .words file
 * @param {string} lexiconFilePath - Path of the .words file
 * @param {string} input - given word
 * @returns {boolean} true if all words in the file, false otherwise
 */
export function canBeParsed(lexiconFilePath: string, input: string): boolean {
  const words: string[] = input.split(' ')
  let canBeParsed = true
  words.forEach(w => {
    if (!isInLexicon(lexiconFilePath, w)) {
      canBeParsed = false
    }
  })
  return canBeParsed
}

/**
 * Reads all lines of .lexiconFile and create a new .words file with
 * all (unique) words read
 * @param {string} lexiconFilePath - Path of the .lexicon file
 * @returns {boolean} true if file is created, false otherwise
 */
export function createWordsFile(lexiconFilePath: string): boolean {
  const fileName = 'myfile.words'
  let successfullyCreated = false

  const liner = new LineByLine(lexiconFilePath)
  const allWords = new Set<string>()

  let line = liner.next()

  while (line) {
    const str = line.toString('ascii')
    const [, word] = str.split(' ')
    if (!allWords.has(word)) {
      allWords.add(word)
      fs.appendFile(fileName, word, err => {
        if (err) throw err
        successfullyCreated = true
      })
    }
    line = liner.next()
  }

  return successfullyCreated
}

/**
 * Reads all lines of .lexiconFile and create a new .words file with
 * all (unique) words read
 * @param {WeightChart} chart - Chart with weights
 * @param {BackChart} back - Chart with backtrace
 * @param {string} startSymbol - Startsymbol
 * @param {number} start - start index of span
 * @param {number} end - end index of span
 * @returns {string[]} arra of strings of rules
 */
export function backTrace(chart: WeightChart, back: BackChart, startSymbol: string, start: number, end: number, sentence: string): string {
  const rulesUsed: string[] = []
  if(start >= 0 && end >= 0 && back[start][end][startSymbol]) {
    const a: string = startSymbol
    let m: number = back[start][end][a][0]
    const b: string = back[start][end][a][1]
    const c: string = back[start][end][a][2]
    if(m < 0) {
      m = end

      if(back[start][m][b]) {
        return `(${a} ${backTrace(chart, back, b, start, m, sentence)})`

      } else {
        return `(${a} (${b} ${backTrace(chart, back, b, start, m, sentence)}))`
      }

    } else {
      return `(${a} (${b} ${backTrace(chart, back, b, start, m, sentence)})(${c} ${backTrace(chart,back,c,m,end, sentence)}))`
    }
    
  } else {
    return sentence.split(' ')[start]
  }

}
/**
 * Reads input sentence and returns best tree in PTB format
 * @param {string} sentence - Sentence of which we want the bes tree
 * @param {string} lexiconFilePath - Path to .lexicon file
 * @param {string} rulesFilePath - Path to .rules file
 * @returns {string} Best Tree in PTB format
 */
export function createPTB(sentence: string, lexiconFilePath: string, rulesFilePath: string, startSymbol:string = 'ROOT'): string {
  const [chart, back] = ckyChartWeight(sentence, lexiconFilePath, rulesFilePath)
  const j = chart[0].length - 1
  const i = 0
  return backTrace(chart, back, startSymbol, i, j, sentence)
}

// Main
export default class Parse extends Command {
  static description = `Reads a sequence of natural language
  sentences from stin and outputs the best parsing tree to the
  input sentences in PTB format. If no parsing tree is found,
  then outputs NOPARSE <sentence> in the stdout. RULES and LEXICON
  are the names of the PCFG.`

  static examples = [
    '$ pcfg_tool parse -u grammar.rules grammar.lexicon',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    paradigma: flags.string({char: 'p', description: '-p --paradigma=PARADIGMA\n Paradigma used to parse (cyk or deductive)'}),
    'initial-nonterminal': flags.string({char: 'i', description: '-i --initial-nonterminal=N\n Set N as start symbol. If not set, then the default value is ROOT'}),
    unlink: flags.string({char: 'u', description: '-u --unlink\n Replaces unknown words with UNK'}),
    smoothing: flags.string({char: 's', description: '-s --smoothing\n Replaces unknown words according to the smoothing implementation'}),
    'threshold-beam': flags.string({char: 't', description: '-t --threshold-beam=THRESHOLD\n Runs Beam-Search with THRESHOLD'}),
    'rank-beam': flags.string({char: 'r', description: '-r --rank-beam=RANK Runs Beam-Search with Beam of constant size'}),
    kbest: flags.string({char: 'k', description: '-k --kbest=K\n Outputs K best parsing trees instead of only the best'}),
    astar: flags.string({char: 'a', description: '-a --astar=PATH\n Runs A*-Search. Load outside weights from the file PATH'}),
    // flag with no value (-f, --force)
    // force: flags.boolean({char: 'f'}),
    // file: flags.string(),
  }

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
    const {flags} = this.parse(Parse)
    const {rulesFilePath, lexiconFilePath} = args
    console.log('📝 Parser started')
    console.log('What sentence would you like to parse?')

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    })

    rl.on('line', function (line) {
      if(!canBeParsed(lexiconFilePath, line)) {
        console.log(`NOPARSE ${line}`)
      } else {
        console.log('😃 It seems that your sentence can be parsed')
        if(flags['initial-nonterminal']) {
          console.log(createPTB(line, lexiconFilePath, rulesFilePath, flags['initial-nonterminal']))
        } else {
          console.log(createPTB(line, lexiconFilePath, rulesFilePath))
        }
      }
      rl.close();
      process.stdin.destroy();
    })

    // If user passed custom initial-nonterminal as flag, then use it.

  }
}
