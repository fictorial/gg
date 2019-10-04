import test from 'ava'
import moment from 'moment'
import {
  parseMarkdown as parse,
  getValueForKeyPath
} from '../lib/markdown-parser'

test('parse header level 1', t => {
  t.deepEqual(parse('# A'), [
    {
      level: 1,
      header: 'A',
      body: ''
    }
  ])
})

test('parse header level 2', t => {
  t.deepEqual(parse('# A\n## B'), [
    {
      level: 1,
      header: 'A',
      body: '',
      children: [
        {
          level: 2,
          header: 'B',
          body: ''
        }
      ]
    }
  ])
})

test('parse header level 3', t => {
  t.deepEqual(parse('# A\n## B\n### C'), [
    {
      level: 1,
      header: 'A',
      body: '',
      children: [
        {
          level: 2,
          header: 'B',
          body: '',
          children: [
            {
              level: 3,
              header: 'C',
              body: '',
            }
          ]
        }
      ]
    }
  ])
})

test('parse header with body', t => {
  const str = `
# header
body
  `;
  t.deepEqual(parse(str), [{
    level: 1,
    header: 'header',
    body: 'body'
  }])
})

test('parse header with body as date', t => {
  const str = `
# header
2019-02-17
  `;
  t.deepEqual(parse(str), [{
    level: 1,
    header: 'header',
    body: moment('2019-02-17', moment.ISO_8601).toDate()
  }])
})

test('parse header with body as integer', t => {
  const str = `
# header
42
  `;
  t.deepEqual(parse(str), [{
    level: 1,
    header: 'header',
    body: 42
  }])
})

test('parse header with body as float', t => {
  const str = `
# header
3.14
  `;
  t.deepEqual(parse(str), [{
    level: 1,
    header: 'header',
    body: 3.14
  }])
})

test('parse header with body as list of text elements', t => {
  const str = `
# header
- element 0
- element 1
- element 2
  `;
  t.deepEqual(parse(str), [{
    level: 1,
    header: 'header',
    body: [
      'element 0',
      'element 1',
      'element 2',
    ]
  }])
})

test('parse header with body as list of float/date/text elements', t => {
  const str = `
# header
- 1921.2
- 2019-02-17
- element 2
  `;
  t.deepEqual(parse(str), [{
    level: 1,
    header: 'header',
    body: [
      1921.2,
      moment('2019-02-17', moment.ISO_8601).toDate(),
      'element 2',
    ]
  }])
})

test('parse multiple headers ', t => {
  const str = `
# header one
2019-02-17

## header two
hello, world!

## header three
- a list element
- 45.2
  `;
  t.deepEqual(parse(str), [{
    level: 1,
    header: 'header one',
    body: moment('2019-02-17', moment.ISO_8601).toDate(),
    children: [
      {
        level: 2,
        header: 'header two',
        body: 'hello, world!'
      },
      {
        level: 2,
        header: 'header three',
        body: [
          'a list element',
          45.2
        ]
      }
    ]
  }])
})

test('parse deep nested', t => {
  const str = `
# header one
2019-02-17

## header two
hello, world!

### header three
- a list element
- 45.2

#### header four
hey

### header five
sup
  `;
  t.deepEqual(parse(str), [{
    level: 1,
    header: 'header one',
    body: moment('2019-02-17', moment.ISO_8601).toDate(),
    children: [
      {
        level: 2,
        header: 'header two',
        body: 'hello, world!',
        children: [
          {
            level: 3,
            header: 'header three',
            body: [
              'a list element',
              45.2
            ],
            children: [
              {
                level: 4,
                header: 'header four',
                body: 'hey'
              }
            ]
          },
          {
            level: 3,
            header: 'header five',
            body: 'sup'
          }
        ]
      }
    ]
  }])
})

test('getValueForKeyPath', t => {
  const dateStr = `2019-02-17`
  const date = moment(dateStr, moment.ISO_8601).toDate()

  const str = `
# a
${dateStr}

## b

hello, world!

## c

- a list element
- 45.2

### d

howdy

## e

- 1999
- hello
`;

  const out = parse(str)

  t.deepEqual(out, [{
    level: 1,
    header: 'a',
    body: date,
    children: [
      {
        level: 2,
        header: 'b',
        body: 'hello, world!'
      },
      {
        level: 2,
        header: 'c',
        body: [
          'a list element',
          45.2
        ],
        children: [
          {
            level: 3,
            header: 'd',
            body: 'howdy'
          }
        ]
      },
      {
        level: 2,
        header: 'e',
        body: [
          1999,
          'hello'
        ]
      }
    ]
  }])

  t.deepEqual(getValueForKeyPath(out, 'a'), date)
  t.deepEqual(getValueForKeyPath(out, 'a > b'), 'hello, world!')
  t.deepEqual(getValueForKeyPath(out, 'a > c'), [ 'a list element', 45.2 ])
  t.deepEqual(getValueForKeyPath(out, 'a > c > d'), 'howdy')
  t.deepEqual(getValueForKeyPath(out, 'a > e'), [ 1999, 'hello' ])

  t.deepEqual(getValueForKeyPath(out, 'a > c > [0]'), 'a list element')
  t.deepEqual(getValueForKeyPath(out, 'a > c > [1]'), 45.2)
  t.deepEqual(getValueForKeyPath(out, 'a > c > [2]'), undefined)

  t.deepEqual(getValueForKeyPath(out, 'a > c > [-1]'), 45.2)
  t.deepEqual(getValueForKeyPath(out, 'a > c > [-2]'), 'a list element')
  t.deepEqual(getValueForKeyPath(out, 'a > c > [-3]'), undefined)
})

