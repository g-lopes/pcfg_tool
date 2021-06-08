import {getWordProductionsFromLexiconFile, Production} from '../src/commands/parse'
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

// TODO: if not used, then remove comment below
// const expectedProductions: Production[] = [
//   {lhs: 'N', rhs: 'book', weight: 0.5},
//   {lhs: 'N', rhs: 'flight', weight: 0.4},
//   {lhs: 'N', rhs: 'Houston', weight: 0.1},
//   {lhs: 'V', rhs: 'book', weight: 1},
//   {lhs: 'Det', rhs: 'the', weight: 1},
//   {lhs: 'Prep', rhs: 'through', weight: 1},
// ]
