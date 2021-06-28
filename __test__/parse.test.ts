
import {setBackpointerChart, initializeEmptyBackpointerChart, cyk, fillChartDiagonal, getChart, initializeEmptyChart, setLexiconFile, setRulesFile, Chart, BackpointerChart, getPointer, buildTree, sExpression2Lisp, getBackpointerChart} from '../src/commands/parse'
import * as path from 'path'
import {SExpression} from '../src/utils'

// test('initializeEmptyChart', () => {
//   const sentence = 'the man saw the dog'
//   const words = sentence.split(' ')
//   initializeEmptyChart(words)
//   const expectedChart: Chart =     {
//     0: {1: {}, 2: {}, 3: {}, 4: {}, 5: {}},
//     1: {2: {}, 3: {}, 4: {}, 5: {}},
//     2: {3: {}, 4: {}, 5: {}},
//     3: {4: {}, 5: {}},
//     4: {5: {}},
//   }
//   expect(getChart()).toEqual(expectedChart)
// })

// test('fillChartDiagonal', () => {
//   const sentence = 'the man saw the dog'
//   const words = sentence.split(' ')
//   setRulesFile(path.join(__dirname, './data/cnf2_grammar.rules'))
//   setLexiconFile(path.join(__dirname, './data/cnf2_grammar.lexicon'))
//   initializeEmptyChart(words)
//   initializeEmptyBackpointerChart(words)
//   fillChartDiagonal(words)
//   const expectedChart: Chart =     {
//     0: {1: {DT: 1}, 2: {}, 3: {}, 4: {}, 5: {}},
//     1: {2: {NN: 0.1}, 3: {}, 4: {}, 5: {}},
//     2: {3: {Vt: 1}, 4: {}, 5: {}},
//     3: {4: {DT: 1}, 5: {}},
//     4: {5: {NN: 0.5}},
//   }
//   expect(getChart()).toEqual(expectedChart)
// })

// test('fillChartDiagonal using grammar with unary rules', () => {
//   const sentence = 'book the flight through Houston'
//   const words = sentence.split(' ')
//   setLexiconFile(path.join(__dirname, './data/cky_example.lexicon'))
//   setRulesFile(path.join(__dirname, './data/cky_example.rules'))
//   initializeEmptyChart(words)
//   initializeEmptyBackpointerChart(words)
//   fillChartDiagonal(words)
//   const expectedChart: Chart = {
//     0: {1: {N: 0.5, V: 1, S: 0.01, VP: 0.1, NP: 0.15}, 2: {}, 3: {}, 4: {}, 5: {}},
//     1: {2: {Det: 1}, 3: {}, 4: {}, 5: {}},
//     2: {3: {N: 0.4, NP: 0.12}, 4: {}, 5: {}},
//     3: {4: {Prep: 1}, 5: {}},
//     4: {5: {N: 0.1, NP: 0.03}},
//   }
//   const chart = getChart()
//   Object.keys(chart).forEach(i => {
//     Object.keys(chart[i]).forEach(j => {
//       Object.keys(chart[i][j]).forEach(k => {
//         expect(chart[i][j][k]).toBeCloseTo(expectedChart[i][j][k])
//       })
//     })
//   })
// })

// test('cyk builds score chart correctly using grammar with unary rules', () => {
//   const sentence = 'book the flight through Houston'
//   const words = sentence.split(' ')
//   setLexiconFile(path.join(__dirname, './data/cky_example.lexicon'))
//   setRulesFile(path.join(__dirname, './data/cky_example.rules'))
//   const expectedChart: Chart = {
//     0: {1: {N: 0.5, V: 1, S: 0.01, VP: 0.1, NP: 0.15}, 2: {}, 3: {VP: 0.0096, NP: 0.0024, S: 0.00096}, 4: {}, 5: {VP: 0.0000864, NP: 0.0000144, S: 0.000008640}},
//     1: {2: {Det: 1}, 3: {NP: 0.16}, 4: {}, 5: {NP: 0.00096}},
//     2: {3: {N: 0.4, NP: 0.12}, 4: {}, 5: {NP: 0.00072}},
//     3: {4: {Prep: 1}, 5: {PP: 0.03}},
//     4: {5: {N: 0.1, NP: 0.03}},
//   }
//   cyk(words, 'S')
//   const chart = getChart()
//   Object.keys(chart).forEach(i => {
//     Object.keys(chart[i]).forEach(j => {
//       Object.keys(chart[i][j]).forEach(k => {
//         expect(chart[i][j][k]).toBeCloseTo(expectedChart[i][j][k])
//       })
//     })
//   })
// })

// test('cyk builds score chart correctly using grammar with unary rules', () => {
//   const sentence = 'lead can poison'
//   const words = sentence.split(' ')
//   setLexiconFile(path.join(__dirname, './data/cnf_with_unary.lexicon'))
//   setRulesFile(path.join(__dirname, './data/cnf_with_unary.rules'))
//   const expectedChart: Chart = {
//     0: {1: {N: 0.3, V: 0.9, NP: 0.3 * 0.7, VP: 0.9 * 0.3}, 2: {NP: 0.6 * 0.3 * 0.14}, 3: {S: 1 * 0.0252 * 0.03, NP: 0.6 * 0.3 * 0.042}},
//     1: {2: {N: 0.2, M: 0.5, NP: 0.7 * 0.2}, 3: {S: 1 * 0.14 * 0.03, VP: 0.4 * 0.5 * 0.1, NP: 0.6 * 0.2 * 0.35}},
//     2: {3: {N: 0.5, V: 0.1, NP: 0.7 * 0.5, VP: 0.3 * 0.1}},
//   }
//   cyk(words, 'S')
//   const chart = getChart()
//   Object.keys(chart).forEach(i => {
//     Object.keys(chart[i]).forEach(j => {
//       Object.keys(chart[i][j]).forEach(k => {
//         expect(chart[i][j][k]).toBeCloseTo(expectedChart[i][j][k])
//       })
//     })
//   })
// })

// test('getPointer', () => {
//   const back: BackpointerChart = {
//     0: {
//       1: {
//         N: {A: 'N', w: 'book', weight: -1},
//         V: {A: 'V', w: 'book', weight: -1},
//         NP: {A: 'NP', B: 'N', weight: -1, i: 0, j: 1},
//         VP: {A: 'VP', B: 'V', weight: -1, i: 0, j: 1},
//         S: {A: 'S', B: 'VP', weight: -1, i: 0, j: 1},
//       },
//       2: {},
//       3: {
//         VP: {A: 'VP', B: 'VP', C: 'NP', weight: -1, i: 0, m: 1, j: 3},
//         NP: {A: 'NP', B: 'NP', C: 'NP', weight: -1, i: 0, m: 1, j: 3},
//         S: {A: 'S', B: 'VP', weight: -1, i: 0, j: 3},
//       },
//       4: {},
//       5: {
//         VP: {A: 'VP', B: 'VP', C: 'NP', weight: -1, i: 0, m: 1, j: 5},
//         NP: {A: 'NP', B: 'NP', C: 'NP', weight: -1, i: 0, m: 3, j: 5},
//         S: {A: 'S', B: 'VP', weight: -1, i: 0, j: 5},
//       },
//     },
//     1: {
//       2: {Det: {A: 'S', B: 'VP', weight: -1, i: 1, j: 1}},
//       3: {NP: {A: 'NP', B: 'Det', C: 'N', weight: -1, i: 1, m: 2, j: 3}},
//       4: {},
//       5: {NP: {A: 'NP', B: 'NP', C: 'PP', weight: -1, i: 1, m: 3, j: 5}}},
//     2: {
//       3: {
//         N: {A: 'N', w: 'flight', weight: -1},
//         NP: {A: 'NP', B: 'N', weight: -1, i: 1, j: 1},
//       },
//       4: {},
//       5: {NP: {A: 'NP', B: 'NP', C: 'PP', weight: -1, i: 2, m: 3, j: 5}}},
//     3: {
//       4: {
//         Prep: {A: 'Prep', w: 'through', weight: -1}},
//       5: {}},
//     4: {
//       5: {
//         N: {A: 'N', w: 'Houston', weight: -1},
//         NP: {A: 'NP', B: 'N', weight: -1, i: 1, j: 1},
//       }},

//   }
//   setBackpointerChart(back)
//   const p1 = getPointer(0, 3, 'VP')
//   const p2 = getPointer(1, 5, 'NP')
//   const p3 = getPointer(4, 5, 'N')
//   expect(p1).toEqual({A: 'VP', B: 'VP', C: 'NP', weight: -1, i: 0, m: 1, j: 3})
//   expect(p2).toEqual({A: 'NP', B: 'NP', C: 'PP', weight: -1, i: 1, m: 3, j: 5})
//   expect(p3).toEqual({A: 'N', w: 'Houston', weight: -1})
// })

// test('buildTree', () => {
//   const back: BackpointerChart = {
//     0: {
//       1: {
//         N: {A: 'N', w: 'book', weight: 0.5},
//         V: {A: 'V', w: 'book', weight: 1},
//         NP: {A: 'NP', B: 'N', weight: 0.15, i: 0, j: 1},
//         VP: {A: 'VP', B: 'V', weight: 0.1, i: 0, j: 1},
//         S: {A: 'S', B: 'VP', weight: 0.01, i: 0, j: 1},
//       },
//       2: {},
//       3: {
//         VP: {A: 'VP', B: 'VP', C: 'NP', weight: 0.0096, i: 0, m: 1, j: 3},
//         NP: {A: 'NP', B: 'NP', C: 'NP', weight: 0.0024, i: 0, m: 1, j: 3},
//         S: {A: 'S', B: 'VP', weight: 0.00096, i: 0, j: 3},
//       },
//       4: {},
//       5: {
//         VP: {A: 'VP', B: 'VP', C: 'PP', weight: 0.0000864, i: 0, m: 3, j: 5},
//         NP: {A: 'NP', B: 'NP', C: 'NP', weight: 0.0000144, i: 0, m: 3, j: 5},
//         S: {A: 'S', B: 'VP', weight: 0.00000864, i: 0, j: 5},
//       },
//     },
//     1: {
//       2: {Det: {A: 'Det', w: 'the', weight: 1}},
//       3: {NP: {A: 'NP', B: 'Det', C: 'N', weight: 0.16, i: 1, m: 2, j: 3}},
//       4: {},
//       5: {NP: {A: 'NP', B: 'NP', C: 'PP', weight: 0.00096, i: 1, m: 3, j: 5}}},
//     2: {
//       3: {
//         N: {A: 'N', w: 'flight', weight: 0.4},
//         NP: {A: 'NP', B: 'N', weight: 0.12, i: 2, j: 3},
//       },
//       4: {},
//       5: {NP: {A: 'NP', B: 'NP', C: 'PP', weight: 0.00072, i: 2, m: 3, j: 5}}},
//     3: {
//       4: {
//         Prep: {A: 'Prep', w: 'through', weight: 1}},
//       5: {
//         PP: {A: 'PP', B: 'Prep', C: 'NP', weight: 0.03, i: 3, m: 4, j: 5},
//       }},
//     4: {
//       5: {
//         N: {A: 'N', w: 'Houston', weight: 0.1},
//         NP: {A: 'NP', B: 'N', weight: -1, i: 4, j: 5},
//       }},
//   }
//   setBackpointerChart(back)
//   const bestTree: SExpression = buildTree({A: 'S', B: 'VP', weight: -1, i: 0, j: 5})
//   const expectedTree: SExpression = ['S', ['VP', ['VP', ['VP', ['V', 'book']], ['NP', ['Det', 'the'], ['N', 'flight']]], ['PP', ['Prep', 'through'], ['NP', ['N', 'Houston']]]]]
//   expect(bestTree).toEqual(expectedTree)
// })

// test('cyk works with official_test sentences', () => {
//   setLexiconFile(path.join(__dirname, './data/official_test.lexicon'))
//   setRulesFile(path.join(__dirname, './data/official_test.rules'))
//   const sentences = [
//     'a b',
//     'a a b b b',
//     'b a',
//     'a a',
//     'b',
//   ]

//   const expectedTrees = [
//     '(ROOT (X (A a)) (Y (B b)))',
//     '(ROOT (X (A a) (X (A a))) (Y (B b) (Y (B b) (Y (B b)))))',
//     '(ROOT (X (A (B b))) (Y (B (A a))))',
//     '(ROOT (X (A a)) (Y (B (A a))))',
//     '(NOPARSE b)',
//   ]

//   sentences.forEach((s, index) => {
//     const words = s.split(' ')
//     const result: SExpression | Error = cyk(words, 'ROOT')
//     const treeAsString = sExpression2Lisp(result)
//     expect(treeAsString).toEqual(expectedTrees[index])
//   })
// })

test('run() works with official_test sentences and custom symbol', () => {
  setLexiconFile(path.join(__dirname, './data/official_test_with_custom_startSymbol.lexicon'))
  setRulesFile(path.join(__dirname, './data/official_test_with_custom_startSymbol.rules'))
  const sentence = 'a a b b b'

  const expectedTree = '(WURZEL (X (A a) (X a)) (Y (B b) (Y (B b) (Y b))))'

  const words = sentence.split(' ')
  const result: SExpression | Error = cyk(words, 'WURZEL')
  const treeAsString = sExpression2Lisp(result)
  const chart = getChart()
  const back = getBackpointerChart()
  console.log(chart, back)
  expect(treeAsString).toEqual(expectedTree)
})
