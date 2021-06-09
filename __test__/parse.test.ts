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

test('initializeWeightChart', () => {
  const sentence = 'book the flight through Houston'
  const filePath = path.join(__dirname, './data/cky_example.lexicon')
  const chart: WeightChart = initializeWeightChart(sentence, filePath)
  const expectedChart: WeightChart = [
    [{}, {N: 0.5, V: 1}, {}, {}, {}, {}],
    [{}, {}, {Det: 1}, {}, {}, {}],
    [{}, {}, {}, {N: 0.4}, {}, {}],
    [{}, {}, {}, {}, {Prep: 1}, {}],
    [{}, {}, {}, {}, {}, {N: 0.1}],
  ]
  expect(chart).toEqual(expectedChart)
})

//
test('ckyChartBoolean', () => {
  const rulesFilePath = path.join(__dirname, './data/cnf_grammar.rules')
  const lexiconFilePath = path.join(__dirname, './data/cnf_grammar.lexicon')
  const sentence = 'book the flight through Houston'
  const chart: WeightChart = ckyChartWeight(sentence, lexiconFilePath, rulesFilePath)
  const expectedChart: WeightChart = [
    [{}, {S: 0.01, Nominal: 0.03, Verb: 0.5}, {}, {S: 0.00135, VP: 0.0135}, {}, {S: 0.000021599999999999996, VP: 0.00021599999999999996}],
    [{}, {}, {Det: 0.6}, {NP: 0.054}, {}, {NP: 0.0008639999999999999}],
    [{}, {}, {}, {Nominal: 0.15}, {}, {Nominal: 0.0024}],
    [{}, {}, {}, {}, {Prep: 0.2}, {PP: 0.032}],
    [{}, {}, {}, {}, {}, {NP: 0.16}],
  ]
  expect(chart).toEqual(expectedChart)
})

test('ckyChartWeight', () => {
  const rulesFilePath = path.join(__dirname, './data/cnf2_grammar.rules')
  const lexiconFilePath = path.join(__dirname, './data/cnf2_grammar.lexicon')
  const sentence = 'the man saw the dog'
  const chart: WeightChart = ckyChartWeight(sentence, lexiconFilePath, rulesFilePath)
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
  const rulesFilePath = path.join(__dirname, './data/simple_pcfg.rules')
  const lexiconFilePath = path.join(__dirname, './data/simple_pcfg.lexicon')
  const sentence = 'the man saw the dog'
  const chart: WeightChart = ckyChartWeight(sentence, lexiconFilePath, rulesFilePath)
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
        console.log(key)
        // expect(chart[i][j][key]).toBeCloseTo(expectedChart[i][j][key])
      }
    }
  }
  expect(1).toBe(0)
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
