
import {cyk, fillChartDiagonal, getChart, initializeEmptyChart, setLexiconFile, setRulesFile, Chart} from '../src/commands/parse2'
import * as path from 'path'

test('initializeEmptyChart', () => {
  const sentence = 'the man saw the dog'
  const words = sentence.split(' ')
  initializeEmptyChart(words)
  const expectedChart: Chart =     {
    0: {1: {}, 2: {}, 3: {}, 4: {}, 5: {}},
    1: {2: {}, 3: {}, 4: {}, 5: {}},
    2: {3: {}, 4: {}, 5: {}},
    3: {4: {}, 5: {}},
    4: {5: {}},
  }
  expect(getChart()).toEqual(expectedChart)
})

test('fillChartDiagonal', () => {
  const sentence = 'the man saw the dog'
  const words = sentence.split(' ')
  setRulesFile(path.join(__dirname, './data/cnf2_grammar.rules'))
  setLexiconFile(path.join(__dirname, './data/cnf2_grammar.lexicon'))
  initializeEmptyChart(words)
  fillChartDiagonal(words)
  const expectedChart: Chart =     {
    0: {1: {DT: 1}, 2: {}, 3: {}, 4: {}, 5: {}},
    1: {2: {NN: 0.1}, 3: {}, 4: {}, 5: {}},
    2: {3: {Vt: 1}, 4: {}, 5: {}},
    3: {4: {DT: 1}, 5: {}},
    4: {5: {NN: 0.5}},
  }
  expect(getChart()).toEqual(expectedChart)
})

test('fillChartDiagonal using grammar with unary rules', () => {
  const sentence = 'book the flight through Houston'
  const words = sentence.split(' ')
  setLexiconFile(path.join(__dirname, './data/cky_example.lexicon'))
  setRulesFile(path.join(__dirname, './data/cky_example.rules'))
  initializeEmptyChart(words)
  fillChartDiagonal(words)
  const expectedChart: Chart = {
    0: {1: {N: 0.5, V: 1, S: 0.01, VP: 0.1, NP: 0.15}, 2: {}, 3: {}, 4: {}, 5: {}},
    1: {2: {Det: 1}, 3: {}, 4: {}, 5: {}},
    2: {3: {N: 0.4, NP: 0.12}, 4: {}, 5: {}},
    3: {4: {Prep: 1}, 5: {}},
    4: {5: {N: 0.1, NP: 0.03}},
  }
  const chart = getChart()
  Object.keys(chart).forEach(i => {
    Object.keys(chart[i]).forEach(j => {
      Object.keys(chart[i][j]).forEach(k => {
        console.log(`${chart[i][j][k]}  ||||  ${expectedChart[i][j][k]}   ||| ${i} ${j} ${k}`)
        expect(chart[i][j][k]).toBeCloseTo(expectedChart[i][j][k])
      })
    })
  })
})

test('cyk using grammar with unary rules', () => {
  const sentence = 'book the flight through Houston'
  const words = sentence.split(' ')
  setLexiconFile(path.join(__dirname, './data/cky_example.lexicon'))
  setRulesFile(path.join(__dirname, './data/cky_example.rules'))
  const expectedChart: Chart = {
    0: {1: {N: 0.5, V: 1, S: 0.01, VP: 0.1, NP: 0.15}, 2: {}, 3: {VP: 0.0096, NP: 0.0024, S: 0.00096}, 4: {}, 5: {VP: 0.0000864, NP: 0.0000144, S: 0.000008640}},
    1: {2: {Det: 1}, 3: {NP: 0.16}, 4: {}, 5: {NP: 0.00096}},
    2: {3: {N: 0.4, NP: 0.12}, 4: {}, 5: {NP: 0.00072}},
    3: {4: {Prep: 1}, 5: {PP: 0.03}},
    4: {5: {N: 0.1, NP: 0.03}},
  }
  cyk(words)
  const chart = getChart()
  Object.keys(chart).forEach(i => {
    Object.keys(chart[i]).forEach(j => {
      Object.keys(chart[i][j]).forEach(k => {
        console.log(`${chart[i][j][k]}  ||||  ${expectedChart[i][j][k]}   ||| ${i} ${j} ${k}`)
        expect(chart[i][j][k]).toBeCloseTo(expectedChart[i][j][k])
      })
    })
  })
})

test('cyk using grammar with unary rules', () => {
  const sentence = 'lead can poison'
  const words = sentence.split(' ')
  setLexiconFile(path.join(__dirname, './data/cnf_with_unary.lexicon'))
  setRulesFile(path.join(__dirname, './data/cnf_with_unary.rules'))
  const expectedChart: Chart = {
    0: {1: {N: 0.3, V: 0.9, NP: 0.3 * 0.7, VP: 0.9 * 0.3}, 2: {NP: 0.6 * 0.3 * 0.14}, 3: {S: 1 * 0.0252 * 0.03, NP: 0.6 * 0.3 * 0.042}},
    1: {2: {N: 0.2, M: 0.5, NP: 0.7 * 0.2}, 3: {S: 1 * 0.14 * 0.03, VP: 0.4 * 0.5 * 0.1, NP: 0.6 * 0.2 * 0.35}},
    2: {3: {N: 0.5, V: 0.1, NP: 0.7 * 0.5, VP: 0.3 * 0.1}},
  }
  cyk(words)
  const chart = getChart()
  Object.keys(chart).forEach(i => {
    Object.keys(chart[i]).forEach(j => {
      Object.keys(chart[i][j]).forEach(k => {
        console.log(`${chart[i][j][k]}  ||||  ${expectedChart[i][j][k]}   ||| ${i} ${j} ${k}`)
        expect(chart[i][j][k]).toBeCloseTo(expectedChart[i][j][k])
      })
    })
  })
})

