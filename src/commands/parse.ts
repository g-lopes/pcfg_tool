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

// function initializeMatrix(m: number, n: number): Set<string>[][] {
//   const matrix: Set<string>[][] = []
//   for (let i = 0; i < m; i++) {
//     matrix[i] = []
//     for (let j = 0; j < n + 1; j++) {
//       matrix[i][j] = new Set()
//     }
//   }
//   return matrix
// }

// function printMatrix(matrix: Array<Array<Set<string>>>): void {
//   let header = ''
//   for (let i = 0; i < matrix.length + 1; i++) {
//     header = header + '        ' + i + '     '
//   }
//   console.log(header)
//   for (let i = 0; i < matrix.length; i++) {
//     // new row
//     let row = i + ' '
//     for (let j = 0; j < matrix[i].length; j++) {
//       // new element
//       let element = '['
//       if (matrix[i][j].size > 0) {
//         matrix[i][j].forEach(e => {
//           element = element + e + ' , '
//         })
//       }
//       if (element.endsWith(', ')) {
//         element = element.substr(0, element.length - 2)
//       }
//       while (element.length < 12) {
//         element += ' '
//       }
//       element += ']'
//       row = row + ' ' + element
//     }
//     console.log(row)
//   }
//   console.log('\n')
// }

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

// function getAllCombinations(bs: Set<string>, cs: Set<string>): string[] {
//   const allCombinations: string[] = []
//   bs.forEach(b => {
//     cs.forEach(c => {
//       allCombinations.push(b + ' ' + c)
//     })
//   })
//   return allCombinations
// }

// function cky(grammar: any, sentence: string, lexiconFilePath: string, rulesFilePath: string): Set<string>[][] {
//   const words = sentence.split(' ')
//   const matrix: Set<string>[][] = initializeMatrix(words.length, words.length)
//   // Loop to get word production rules
//   for (let i = 1; i <= words.length; i++) {
//     // Loop to build the diagonal of the matrix
//     words.forEach(() => {
//       const rules = getWordProductionsFromLexiconFile(lexiconFilePath, words[i - 1])
//       if (rules) {
//         rules.forEach(r => {
//           const [nonTerminal] = r.split(' ')
//           matrix[i - 1][i].add(nonTerminal)
//         })
//       }
//     })
//   }

//   for (let k = 2; k <= words.length; k++) {
//     for (let i = k - 2; i >= 0; i--) {
//       for (let j = i + 1; j <= k - 1; j++) {
//         const bs: Set<string> = matrix[i][j]
//         const cs: Set<string> = matrix[j][k]
//         const allBCCombinations: string[] = getAllCombinations(bs, cs)
//         allBCCombinations.forEach(rhs => {
//           const binaryProductions = getBinaryProductionsFromRulesFile(rulesFilePath, rhs)
//           binaryProductions.forEach(production => matrix[i][k].add(production))
//         })
//       }
//     }
//   }
//   console.log('Final Matrix: ')
//   printMatrix(matrix)
//   return matrix
// }

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
      chart[i][j] = undefined
    }
  }
  // Loop to get word production rules
  for (let i = 1; i <= words.length; i++) {
    // Loop to build the diagonal of the matrix
    const rules = getWordProductionsFromLexiconFile(lexiconFilePath, words[i - 1])
    if (rules.length > 0) {
      chart[i - 1][i] = {}
    }
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

function ckyChart(sentence: string, lexiconFilePath: string, rulesFilePath: string): BooleanChart {
  const chart: BooleanChart = initializeChart(sentence, lexiconFilePath)
  const words = sentence.split(' ')

  for (let r = 2; r <= words.length; r++) { // length of the span
    for (let i = 0; i <= words.length - r; i++) {
      const j = i + r

      const allNonTerminals = [] // TODO: implement method to get all nt
      // allNonTerminals.forEach(nt => {
      //   for (let m = i + 1; m <= j - 1; m++) {
      //     const allBinaryRules = getBinaryProductionsFromRulesFile(rulesFilePath, nt)
      //     allBinaryRules.forEach(r => {
      //       const {lhs, rhs, weight} = r
      //       const [B, C] = rhs.split(' ')
      //       const A = lhs
      //       if (chart[i][j][B] && chart[m][j][C]) chart[i][j][A] = true
      //     })
      //   }
      // })

      // const bs: Set<string> = matrix[i][j]
      // const cs: Set<string> = matrix[j][k]
      // const allBCCombinations: string[] = getAllCombinations(bs, cs)
      // allBCCombinations.forEach(rhs => {
      //   const binaryProductions = getBinaryProductionsFromRulesFile(rulesFilePath, rhs)
      //   binaryProductions.forEach(production => matrix[i][k].add(production))
      // })
    }
  }

  return chart
}

