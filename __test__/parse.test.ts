import {
  getWordProductionsFromLexiconFile,
  initializeWeightChart,
  ckyChartBoolean,
  Production,
  initializeChart,
  getAllNonterminals,
  BooleanChart,
  getBinaryProductionsFromRulesFile,
  WeightChart,
  ckyChartWeight,
  getAllUnaryProductionsFromRulesFile,
  isInWords,
  checkIfInputCanBeParsed,
  initializeBackChart,
  BackChart,
  backTrace,
} from '../src/commands/parse'
import * as path from 'path'

test('basic', () => {
  expect(0).toBe(0)
})

test('getWordProductionsFromLexiconFile should return all terminal productions that yields "book"', () => {
  const filePath = path.join(__dirname, './data/cky_example.lexicon')
  const word = 'book'
  const productions: Production[] = getWordProductionsFromLexiconFile(filePath, word)
  const expectedProductions: Production[] = [
    {lhs: 'N', rhs: 'book', weight: 0.5},
    {lhs: 'V', rhs: 'book', weight: 1},
  ]
  expect(productions).toEqual(expectedProductions)
})

test('getWordProductionsFromLexiconFile should return empty array', () => {
  const filePath = path.join(__dirname, './data/cky_example.lexicon')
  const word = 'homerSimpson'
  const productions: Production[] = getWordProductionsFromLexiconFile(filePath, word)
  const expectedProductions: Production[] = []
  expect(productions).toEqual(expectedProductions)
})

test('initializeChart', () => {
  const sentence = 'book the flight through Houston'
  const filePath = path.join(__dirname, './data/cky_example.lexicon')
  const chart: BooleanChart = initializeChart(sentence, filePath)
  const expectedChart: BooleanChart = [
    [{}, {N: true, V: true}, {}, {}, {}, {}],
    [{}, {}, {Det: true}, {}, {}, {}],
    [{}, {}, {}, {N: true}, {}, {}],
    [{}, {}, {}, {}, {Prep: true}, {}],
    [{}, {}, {}, {}, {}, {N: true}],
  ]
  expect(chart).toEqual(expectedChart)
})

test('getBinaryProductionsFromRulesFile', () => {
  const rulesFilePath = path.join(__dirname, './data/cky_example.rules')
  const lhs = 'VP'
  const binaryProductions: Production[] = getBinaryProductionsFromRulesFile(rulesFilePath, lhs)
  const expectedBinaryProductions: Production[] = [
    {lhs: 'VP', rhs: 'VP PP', weight: 0.3},
    {lhs: 'VP', rhs: 'VP NP', weight: 0.6},
  ]
  expect(binaryProductions).toEqual(expectedBinaryProductions)
})

test('getBinaryProductionsFromRulesFile', () => {
  const rulesFilePath = path.join(__dirname, './data/cky_example.rules')
  const lhs = 'NP'
  const binaryProductions: Production[] = getBinaryProductionsFromRulesFile(rulesFilePath, lhs)
  const expectedBinaryProductions: Production[] = [
    {lhs: 'NP', rhs: 'Det N', weight: 0.4},
    {lhs: 'NP', rhs: 'NP NP', weight: 0.1},
    {lhs: 'NP', rhs: 'NP PP', weight: 0.2},
  ]
  expect(binaryProductions).toEqual(expectedBinaryProductions)
})

test('getBinaryProductionsFromRulesFile', () => {
  const rulesFilePath = path.join(__dirname, './data/only_unary.rules')
  const lhs = 'D'
  const binaryProductions: Production[] = getBinaryProductionsFromRulesFile(rulesFilePath, lhs)
  const expectedBinaryProductions: Production[] = []
  expect(binaryProductions).toEqual(expectedBinaryProductions)
})

test('getAllNonterminals', () => {
  const rulesFilePath = path.join(__dirname, './data/cky_example.rules')
  const nonTerminals: string[] = getAllNonterminals(rulesFilePath)
  const expectedNonTerminals: string[] = ['S', 'NP', 'VP', 'PP']
  expect(nonTerminals).toEqual(expectedNonTerminals)
})

test('getAllNonterminals not expect nonterminal of the RHS', () => {
  const rulesFilePath = path.join(__dirname, './data/cky_example.rules')
  const nonTerminals: string[] = getAllNonterminals(rulesFilePath)
  expect(nonTerminals).toEqual(
    expect.not.arrayContaining(['Det']),
  )
})

test('ckyChartBoolean', () => {
  const rulesFilePath = path.join(__dirname, './data/cnf_grammar.rules')
  const lexiconFilePath = path.join(__dirname, './data/cnf_grammar.lexicon')
  const sentence = 'book the flight through Houston'
  const chart: BooleanChart = ckyChartBoolean(sentence, lexiconFilePath, rulesFilePath)
  const expectedChart: BooleanChart = [
    [{}, {S: true, Nominal: true, Verb: true}, {}, {S: true, VP: true}, {}, {S: true, VP: true}],
    [{}, {}, {Det: true}, {NP: true}, {}, {NP: true}],
    [{}, {}, {}, {Nominal: true}, {}, {Nominal: true}],
    [{}, {}, {}, {}, {Prep: true}, {PP: true}],
    [{}, {}, {}, {}, {}, {NP: true}],
  ]
  expect(chart).toEqual(expectedChart)
})

test('initializeWeightChart without unary rules', () => {
  const sentence = 'the man saw the dog'
  const lexiconFilePath = path.join(__dirname, './data/cnf2_grammar.lexicon')
  const rulesPath = path.join(__dirname, './data/cnf2_grammar.rules')
  const back: BackChart = initializeBackChart(sentence)
  const chart: WeightChart = initializeWeightChart(sentence, lexiconFilePath, rulesPath, back)
  const expectedChart: WeightChart = [
    [{}, {DT: 1}, {}, {}, {}, {}],
    [{}, {}, {NN: 0.1}, {}, {}, {}],
    [{}, {}, {}, {Vt: 1}, {}, {}],
    [{}, {}, {}, {}, {DT: 1}, {}],
    [{}, {}, {}, {}, {}, {NN: 0.5}],
  ]
  expect(chart).toEqual(expectedChart)
})

test('initializeWeightChart with unary rules', () => {
  const sentence = 'book the flight through Houston'
  const filePath = path.join(__dirname, './data/cky_example.lexicon')
  const rulesPath = path.join(__dirname, './data/cky_example.rules')
  const back: BackChart = initializeBackChart(sentence)
  const chart: WeightChart = initializeWeightChart(sentence, filePath, rulesPath, back)
  const expectedChart: WeightChart = [
    [{}, {N: 0.5, V: 1, S: 0.01, VP: 0.1, NP: 0.15}, {}, {}, {}, {}],
    [{}, {}, {Det: 1}, {}, {}, {}],
    [{}, {}, {}, {N: 0.4, NP: 0.12}, {}, {}],
    [{}, {}, {}, {}, {Prep: 1}, {}],
    [{}, {}, {}, {}, {}, {N: 0.1, NP: 0.03}],
  ]
  for (let i = 0; i < chart.length; i++) {
    for (let j = 0; j < chart[i].length; j++) {
      for (const [key] of Object.entries(chart[i][j])) {
        expect(chart[i][j][key]).toBeCloseTo(expectedChart[i][j][key])
      }
    }
  }
})

test('ckyChartWeight', () => {
  const rulesFilePath = path.join(__dirname, './data/cnf_grammar.rules')
  const lexiconFilePath = path.join(__dirname, './data/cnf_grammar.lexicon')
  const sentence = 'book the flight through Houston'
  const [chart] = ckyChartWeight(sentence, lexiconFilePath, rulesFilePath)
  const expectedChart: WeightChart = [
    [{}, {S: 0.01, Nominal: 0.03, Verb: 0.5}, {}, {S: 0.00135, VP: 0.0135}, {}, {S: 0.000021599999999999996, VP: 0.00021599999999999996}],
    [{}, {}, {Det: 0.6}, {NP: 0.054}, {}, {NP: 0.0008639999999999999}],
    [{}, {}, {}, {Nominal: 0.15}, {}, {Nominal: 0.0024}],
    [{}, {}, {}, {}, {Prep: 0.2}, {PP: 0.032}],
    [{}, {}, {}, {}, {}, {NP: 0.16}],
  ]
  expect(chart).toEqual(expectedChart)
})

test('ckyChartWeight returns a chart when a grammar wihout unary rules is passed', () => {
  const rulesFilePath = path.join(__dirname, './data/cnf2_grammar.rules')
  const lexiconFilePath = path.join(__dirname, './data/cnf2_grammar.lexicon')
  const sentence = 'the man saw the dog'
  const [chart] = ckyChartWeight(sentence, lexiconFilePath, rulesFilePath)
  const expectedChart: WeightChart = [
    [{}, {DT: 1}, {NP: 0.08}, {}, {}, {S: 0.0256}],
    [{}, {}, {NN: 0.1}, {}, {}, {}],
    [{}, {}, {}, {Vt: 1}, {}, {VP: 0.32}],
    [{}, {}, {}, {}, {DT: 1}, {NP: 0.4}],
    [{}, {}, {}, {}, {}, {NN: 0.5}],
  ]
  for (let i = 0; i < chart.length; i++) {
    for (let j = 0; j < chart[i].length; j++) {
      for (const [key] of Object.entries(chart[i][j])) {
        expect(chart[i][j][key]).toBeCloseTo(expectedChart[i][j][key])
      }
    }
  }
})

test('ckyChartWeight with unary rules', () => {
  const rulesFilePath = path.join(__dirname, './data/cnf_with_unary.rules')
  const lexiconFilePath = path.join(__dirname, './data/cnf_with_unary.lexicon')
  const sentence = 'lead can poison'
  const [chart] = ckyChartWeight(sentence, lexiconFilePath, rulesFilePath)
  const expectedChart: WeightChart = [
    [{}, {N: 0.3, V: 0.9, NP: 0.3 * 0.7, VP: 0.9 * 0.3}, {NP: 0.6 * 0.3 * 0.14}, {S: 1 * 0.0252 * 0.03, NP: 0.6 * 0.3 * 0.042}],
    [{}, {}, {N: 0.2, M: 0.5, NP: 0.7 * 0.2}, {S: 1 * 0.14 * 0.03, VP: 0.4 * 0.5 * 0.1, NP: 0.6 * 0.2 * 0.35}],
    [{}, {}, {}, {N: 0.5, V: 0.1, NP: 0.7 * 0.5, VP: 0.3 * 0.1}],
  ]
  for (let i = 0; i < chart.length; i++) {
    for (let j = 0; j < chart[i].length; j++) {
      for (const [key] of Object.entries(chart[i][j])) {
        expect(chart[i][j][key]).toBeCloseTo(expectedChart[i][j][key])
      }
    }
  }
})

test('getAllUnaryProductionsFromRulesFile', () => {
  const rulesFilePath = path.join(__dirname, './data/simple_pcfg.rules')
  const unaryRules: Production[] = getAllUnaryProductionsFromRulesFile(rulesFilePath)
  const expectedUnaryRules: Production[] = [
    {lhs: 'NP', rhs: 'Noun', weight: 0.2},
    {lhs: 'VP', rhs: 'Verb', weight: 0.3},
    {lhs: 'Prep', rhs: 'P', weight: 1},
    {lhs: 'Noun', rhs: 'N', weight: 1},
    {lhs: 'Verb', rhs: 'V', weight: 1},
  ]
  expect(unaryRules).toEqual(expectedUnaryRules)
})

test('isInWords should return false if word not in .words file', () => {
  const wordsFilePath = path.join(__dirname, './data/grammar.words')
  const word = 'loliiiis'
  expect(isInWords(wordsFilePath, word)).toBe(false)
})

test('isInWords should return true if word is in .words file', () => {
  const wordsFilePath = path.join(__dirname, './data/grammar.words')
  const word = 'incentive-maximizing'
  expect(isInWords(wordsFilePath, word)).toBe(true)
})

test('checkIfInputCanBeParsed should return true if all words are in the .words file', () => {
  const input = 'my name is John'
  const wordsFilePath = path.join(__dirname, './data/grammar.words')
  const success: boolean = checkIfInputCanBeParsed(wordsFilePath, input)
  expect(success).toBe(true)
})

test('checkIfInputCanBeParsed should return false if some word of the input is not in the .words file', () => {
  const input = 'Meu nome é João'
  const wordsFilePath = path.join(__dirname, './data/grammar.words')
  const success: boolean = checkIfInputCanBeParsed(wordsFilePath, input)
  expect(success).toBe(false)
})

// test('ckyChartWeight should return correct backchart when a grammar wihout unary rules is passed', () => {
//   const rulesFilePath = path.join(__dirname, './data/cnf2_grammar.rules')
//   const lexiconFilePath = path.join(__dirname, './data/cnf2_grammar.lexicon')
//   const sentence = 'the man saw the dog'
//   const [chart, back] = ckyChartWeight(sentence, lexiconFilePath, rulesFilePath)
//   const expectedChart: WeightChart = [
//     [{}, {DT: 1}, {NP: 0.08}, {}, {}, {S: 0.0256}],
//     [{}, {}, {NN: 0.1}, {}, {}, {}],
//     [{}, {}, {}, {Vt: 1}, {}, {VP: 0.32}],
//     [{}, {}, {}, {}, {DT: 1}, {NP: 0.4}],
//     [{}, {}, {}, {}, {}, {NN: 0.5}],
//   ]
//   for (let i = 0; i < back.length; i++) {
//     for (let j = 0; j < back[i].length; j++) {
//       for (const [key] of Object.entries(back[i][j])) {
//         expect(back[i][j][key]).toBeCloseTo(expectedChart[i][j][key])
//       }
//     }
//   }
// })

test('backTrace', () => {
  const sentence = 'the man saw the dog'
  const lexiconFilePath = path.join(__dirname, './data/cnf2_grammar.lexicon')
  const rulesPath = path.join(__dirname, './data/cnf2_grammar.rules')
  const [chart, back] = ckyChartWeight(sentence, lexiconFilePath, rulesPath)
  const start = 0
  const end = chart[0].length - 1
  const backtrace: string = backTrace(chart, back, 'S', start, end, sentence)
  const expectedBacktrace = '(S (NP (NP (DT the)(NN man)))(VP (VP (Vt saw)(NP (NP (DT the)(NN dog))))))'
  expect(backtrace).toEqual(expectedBacktrace)
})
