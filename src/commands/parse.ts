// ./pcfg_tool parse grammar.rules grammar.lexicon < sentences
import {Command} from '@oclif/command'
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

export function unaryClosure(rulesFilePath: string, chart: WeightChart, i: number, j: number) {
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
        // TODO: clean: cells[begin][end].setBackPointer(A, new Triple(-1,B,null))  // special unary rule, no split!
        // unaryProductions.forEach(unaryRule => {
        //   const {lhs, rhs, weight} = unaryRule
        //   if (chart[i][j][rhs]) {
        //     // update function
        //     chart[i][j][lhs] = weight
        //   }
        // })
      }
    })
  }
}

/**
 * Given a sentence, returns a WeightChart initialized with the words of the sentence
 * @param {string} sentence - Word (terminal) that we want to find production rules for
 * @param {string} lexiconFilePath - Path of the .lexicon file
 * @param {string} rulesFilePath - Path of the .rules file
 * @returns {WeightChart} All production rules that yield the given word
 */
export function initializeWeightChart(sentence: string, lexiconFilePath: string, rulesFilePath: string): WeightChart {
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
    unaryClosure(rulesFilePath, chart, i - 1, i)
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
 * //TODO: write something here
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

/**
 * //TODO: write something here
 * //TODO: functions are really similar, do not repeat yourself
 * @param {string} sentence - Sentence to be parsed using CYK
 * @param {string} lexiconFilePath - Path of the .lexicon file
 * @param {string} rulesFilePath - Path of the .rules file
 * @returns {WeightChart} WeightChart
 */
export function ckyChartWeight(sentence: string, lexiconFilePath: string, rulesFilePath: string): WeightChart {
  const chart: WeightChart = initializeWeightChart(sentence, lexiconFilePath, rulesFilePath)
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
              chart[i][j]![A] = Math.max(chart[i][j]![A], ruleWeight)
            }
          })
        }
        // unary logic
      })
      unaryClosure(rulesFilePath, chart, i, j)
    }
  }

  return chart
}

/**
 *
 * @param {string} wordsFilePath - Path of the .words file
 * @param {string} word - given word
 * @returns {boolean} true if word is in .words file, false otherwise
 */
export function isInWords(wordsFilePath: string, word: string): boolean {
  const liner = new LineByLine(wordsFilePath)

  let line = liner.next()

  while (line) {
    const w = line.toString('ascii')
    if (w === word) {
      return true
    }
    line = liner.next()
  }

  return false
}

/**
 * splits the input strings into an array of words and check
 * if all words of the input string are in the .words file
 * @param {string} wordsFilePath - Path of the .words file
 * @param {string} input - given word
 * @returns {boolean} true if all words in the file, false otherwise
 */
export function checkIfInputCanBeParsed(wordsFilePath: string, input: string): boolean {
  const words: string[] = input.split(' ')
  let canBeParsed = true
  words.forEach(w => {
    if (!isInWords(wordsFilePath, w)) {
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

