const debug = require('debug')
const debugParse = debug('markdown-parser.parseMarkdown')
const debugGetValue = debug('markdown-parser.getValueForKeyPath')
const moment = require('moment')

function castValue (value) {
  const m = moment(value, moment.ISO_8601)
  if (m.isValid()) return m.toDate()

  const n = parseFloat(value)
  if (!isNaN(n)) return n

  return value
}

function parseBody (value) {
  const list = parseList (value)
  if (list) return list.map(castValue)
  return castValue(value)
}

function parseList (value) {
  if (!value.match(/^-/)) return null

  return value.split(/^-/m)
    .map(x => x.trim())
    .filter(x => x.length > 0)
    .map(x => x.replace(/$\s+/gm, ' '));
}

const headerRegex = /^(#+)\s*(.+)\s*$/

function parseMarkdown (content) {
  debugParse('content length', content.length, content)

  const sections = []
  const mostRecentSectionByLevel = []

  let start = 0

  while (start < content.length) {
    start = content.indexOf('#', start)
    if (start === -1) break
    if (start > 0 && content.charAt(start - 1) !== '\n') continue

    let end = content.indexOf('\n', start)
    if (end === -1) end = content.length
    const header = content.substring(start, end)

    let match = header.match(headerRegex)
    if (!match) break

    const headerLevel = match[1].length
    const headerValue = match[2]
    const bodyStart = end + 1

    let bodyEnd = content.indexOf('#', bodyStart)
    if (bodyEnd === -1) bodyEnd = content.length

    const body = content.substring(bodyStart, bodyEnd).trim()

    const section = {
      level: headerLevel,
      header: headerValue,
      body: parseBody(body)
    }

    mostRecentSectionByLevel[headerLevel] = section

    if (headerLevel > 1) {
      const parentSection = mostRecentSectionByLevel[headerLevel - 1]
      if (!parentSection)
        throw new Error(`failed to find parent section for section at level ${headerLevel}`)

      if (!parentSection.children) parentSection.children = [section]
      else parentSection.children.push(section)
    } else {
      sections.push(section)
    }

    start = bodyEnd
  }

  if (debugParse.enabled)
    debug(JSON.stringify(sections, null, '   '))

  return sections
}

function getValueForKeyPath (sections, keypath) {
  if (debugGetValue.enabled) {
    debugGetValue('markdown', JSON.stringify(sections))
    debugGetValue(`keypath "${keypath}"`)
  }

  if (!Array.isArray(sections) || sections.length === 0)
    return null

  const pathElements = keypath.split(/\s+>\s+/)

  let haystack = sections
  let cursor
  let listIndex

  debugGetValue('pathElements:', pathElements.length)

  for (let i = 0, N = pathElements.length; i < N; ++i) {
    const pathElement = pathElements[i]

    if (debugGetValue.enabled) {
      debugGetValue(`pathElement: "${pathElement}"`)
      debugGetValue('haystack:', JSON.stringify(haystack))
    }

    const listIndexMatch = pathElement.match(/\[\s*(-?\d+)\s*\]/)
    if (listIndexMatch) {
      const n = parseInt(listIndexMatch[1], 10)
      if (!isNaN(n)) listIndex = n

      let value

      if (Array.isArray(cursor.body)) {
        if (listIndex < 0) listIndex = cursor.body.length + listIndex
        value = cursor.body[listIndex]
      }

      debugGetValue(`done searching; final value for "${keypath}" is`, value)
      return value
    }

    for (let j = 0, M = haystack.length; j < M; ++j) {
      const candidate = haystack[j]

      if (debugGetValue.enabled) {
        debugGetValue(`section level ${candidate.level} vs path level ${i + 1}`)
        debugGetValue(`section header "${candidate.header}" vs path element "${pathElement}" / listIndex ${listIndex}`)
      }

      if (candidate.level === i + 1 && candidate.header === pathElement) {
        cursor = candidate
        haystack = candidate.children || []
        break
      }
    }
  }

  let value = cursor && cursor.body || null
  debugGetValue(`done searching; final value for "${keypath}" is`, value)
  return value
}

module.exports = {
  parseMarkdown,
  getValueForKeyPath
}
