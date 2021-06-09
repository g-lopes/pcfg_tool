import {getWordProductionsFromLexiconFile, Production, initializeChart, BooleanChart, getBinaryProductionsFromRulesFile} from '../src/commands/parse'
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
    [undefined, {N: true, V: true}, undefined, undefined, undefined, undefined],
    [undefined, undefined, {Det: true}, undefined, undefined, undefined],
    [undefined, undefined, undefined, {N: true}, undefined, undefined],
    [undefined, undefined, undefined, undefined, {Prep: true}, undefined],
    [undefined, undefined, undefined, undefined, undefined, {N: true}],
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
  const rulesFilePath = path.join(__dirname, './data/cky_example.rules')
  const lhs = 'OnlyUnary'
  const binaryProductions: Production[] = getBinaryProductionsFromRulesFile(rulesFilePath, lhs)
  const expectedBinaryProductions: Production[] = []
  expect(binaryProductions).toEqual(expectedBinaryProductions)
})

// TODO: if not used, then remove comment below
// const expectedProductions: Production[] = [
//   {lhs: 'N', rhs: 'book', weight: 0.5},
//   {lhs: 'N', rhs: 'flight', weight: 0.4},
//   {lhs: 'N', rhs: 'Houston', weight: 0.1},
//   {lhs: 'V', rhs: 'book', weight: 1},
//   {lhs: 'Det', rhs: 'the', weight: 1},
//   {lhs: 'Prep', rhs: 'through', weight: 1},
// ]
