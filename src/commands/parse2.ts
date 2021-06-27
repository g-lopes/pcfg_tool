// TODO: Review data structure
// type 'Charts' seems not to make too much sense
// if it does, then properties (chart and back) need better naming
import {Command, flags} from '@oclif/command'
// import * as readline from 'readline'
import LineByLine = require('n-readlines')
import {SExpression} from '../grammar-inducer'
// import * as fs from 'fs'

// Data Structures
export interface Production {
    lhs: string;
    rhs: string;
    weight: number;
  }

export type Chart = {[i: string]: {[j: string]: {[lhs: string]: number}}}
export type BackpointerChart = {[i: string]: {[j: string]: {[lhs: string]: Pointer}}}
export type Pointer = PreterminalPointer | BinaryPointer | UnaryPointer
export type PreterminalPointer = {A: string; w: string; weight: number}
export type BinaryPointer = {A: string; B: string; C: string; weight: number; i: number; m: number; j: number}
export type UnaryPointer = {A: string; B: string; weight: number; i: number; j: number}

// Global Variables
let rulesFile: string
let lexiconFile: string
let chart: Chart
let backpointerChart: BackpointerChart

function isPreterminalPointer(pointer: PreterminalPointer | BinaryPointer | UnaryPointer): pointer is PreterminalPointer {
  return (pointer as PreterminalPointer).w !== undefined
}

function isBinaryPointer(pointer: PreterminalPointer | BinaryPointer | UnaryPointer): pointer is BinaryPointer {
  return (pointer as BinaryPointer).m !== undefined
}

// Methods
export function getChart(): Chart {
  return chart
}

export function getBackpointerChart(): BackpointerChart {
  return backpointerChart
}

export function setBackpointerChart(bpChart: BackpointerChart): void {
  backpointerChart = bpChart
}

export function setRulesFile(path: string): void {
  rulesFile = path
}

export function setLexiconFile(path: string): void {
  lexiconFile = path
}

export function getUnaryProductions(): Production[] {
  const unaryProductions: Production[] = []
  const liner = new LineByLine(rulesFile)

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

export function addUnary(begin: number, end: number) {
  let newRule = true
  const unaryProductions: Production[] = getUnaryProductions()
  while (newRule) {
    newRule = false
    unaryProductions.forEach(prod => {
      const {lhs, rhs, weight} = prod
      const prob = chart[begin][end][rhs] ? chart[begin][end][rhs] * weight : 0
      const _weight = chart[begin][end][lhs] ? chart[begin][end][lhs] : 0
      if (prob > _weight) {
        const pointer: UnaryPointer = {A: lhs, B: rhs, weight: -1, i: begin, j: end}
        backpointerChart[begin][end][lhs] = pointer
        newRule = true
      }
    })
  }
}

export function getAllNonterminals(): string[] {
  const set = new Set<string>()
  const liner = new LineByLine(rulesFile)

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

export function getProductionsOf(word: string): Production[] {
  const productions: Production[] = []
  const liner = new LineByLine(lexiconFile)

  let line = liner.next()

  while (line) {
    const str = line.toString('ascii')
    const [lhs, rhs, weight] = str.split(' ')
    if (rhs === word) {
      productions.push({lhs, rhs, weight: parseFloat(weight)})
    }
    line = liner.next()
  }
  return productions
}

export function initializeEmptyChart(words: string[]): void {
  chart = {}
  for (let i = 0; i < words.length; i++) {
    chart[i] = {}
    for (let j = i + 1; j <= words.length; j++) {
      chart[i][j] = {}
    }
  }
}

/* very similar to initializeEmptyChart. Could use refactoring **/
export function initializeEmptyBackpointerChart(words: string[]): void {
  backpointerChart = {}
  for (let i = 0; i < words.length; i++) {
    backpointerChart[i] = {}
    for (let j = i + 1; j <= words.length; j++) {
      backpointerChart[i][j] = {}
    }
  }
}

export function fillChartDiagonal(words: string[]): void {
  for (let j = 1; j <= words.length; j++) {
    const productions: Production[] = getProductionsOf(words[j - 1])
    productions.forEach(prod => {
      chart[j - 1][j][prod.lhs] = prod.weight
      const pointer: PreterminalPointer = {A: prod.lhs, w: prod.rhs, weight: -1}
      backpointerChart[j - 1][j][prod.lhs] = pointer
    })
    addUnary(j - 1, j)
  }
}

export function getBinaryProductions(nonTerminal: string): Production[] {
  const binaryProductions: Production[] = []
  const liner = new LineByLine(rulesFile)

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

export function getPointer(i: number, j: number, symbol: string): Pointer {
  return backpointerChart[i][j][symbol]
}

export function buildTree(pointer: Pointer): SExpression {
  if (isPreterminalPointer(pointer)) {
    const {A, w} = pointer
    return [A, w]
  }
  if (isBinaryPointer(pointer)) {
    const {A, B, C, i, m, j} = pointer
    const leftSubTree: Pointer = getPointer(i, m, B)
    const rightSubTree: Pointer = getPointer(m, j, C)
    return [A, buildTree(leftSubTree), buildTree(rightSubTree)]
  }
  // It it is not preterminal nor binary, then it is a UnaryPointer
  const {A, B, i, j} = pointer
  const subTree: Pointer = getPointer(i, j, B)
  return [A, buildTree(subTree)]
}

export function cyk(words: string[]): SExpression {
  initializeEmptyChart(words)
  initializeEmptyBackpointerChart(words)
  fillChartDiagonal(words)

  for (let r = 2; r <= words.length; r++) {
    for (let i = 0; i <= words.length - r; i++) {
      const j = i + r

      const allNonTerminals = getAllNonterminals()
      allNonTerminals.forEach(nt => {
        for (let m = i + 1; m <= j - 1; m++) {
          const allBinaryRules = getBinaryProductions(nt)
          allBinaryRules.forEach(r => {
            const {lhs, rhs, weight} = r
            const [B, C] = rhs.split(' ')
            const A = lhs
            if (chart[i][m]![B] && chart[m][j]![C]) {
              const ruleWeight: number = chart[i][m]![B] * chart[m][j]![C] * weight
              if (!chart[i][j][A]) {
                chart[i][j][A] = 0
                // atualizar backpointers?
              }
              if (ruleWeight > chart[i][j]![A]) {
                chart[i][j]![A] = ruleWeight
                const pointer: BinaryPointer = {A, B, C, weight, i, m, j}
                backpointerChart[i][j]![A] = pointer
              }
            }
          })
          addUnary(i, j)
        }
      })
    }
  }
  return []
  // return buildTree()
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
    // const {flags} = this.parse(Parse)
    const {rulesFilePath, lexiconFilePath} = args
    // Set global variables
    rulesFile = rulesFilePath
    lexiconFile = lexiconFilePath
  }
}
