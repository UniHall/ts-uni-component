const hljs = require('highlight.js')

const cheerio = require('cheerio')
const markdown = require('markdown-it')
const componentIndex = 0
const path = require('path')
const renderHighlight = function(str, lang) {
  if (!(lang && hljs.getLanguage(lang))) {
    return ''
  }

  return hljs.highlight(lang, str, true).value
}
const renderVueTemplate = function(content, componentName) {
  const $ = cheerio.load(content, {
    decodeEntities: false
  })

  const $style = $('style')
  $style.remove()

  const $script = $('script')
  let componentOptionsStr = ''
  if ($script) {
    const execResult = /export[\s]+?default[\s]*?{([\s\S]*)}/.exec($script.html())
    componentOptionsStr = execResult ? execResult[1] : ''
  }

  $script.remove()

  const templateExecResult = /^\s*<template>([\s\S]*)<\/template>\s*$/.exec($.html())

  let templateStr = ''
  templateStr = templateExecResult ? templateExecResult[1] : $.html()

  const componentStr = `{template: \`<div class="${componentName}">${templateStr}</div>\`,${componentOptionsStr}}`
  return componentStr
}

const renderMd = function(html, fileName) {
  const $ = cheerio.load(html, {
    decodeEntities: false,
    lowerCaseAttributeNames: false,
    lowerCaseTags: false
  })
  let componenetsString = ''
  let id = 0
  let styleStr = ''

  $('style').each((index, item) => {
    styleStr += $(item).html()
  })

  $('div.kv-demo').each((index, item) => {
    const componentName = `kv-demo${id}`
    const vueTeml = renderVueTemplate($(item).html(), componentName)

    $(item).replaceWith(`<template slot="source"><${componentName} /></template>`)

    componenetsString += `${JSON.stringify(componentName)}: ${vueTeml},`
    id++
  })

  const pageScript = `<script>
      export default {
        name: "component-doc${componentIndex}",
        components: {
          ${componenetsString}
        }
      }
    </script>`

  const htmlStr = $.html()
  const result = `<template> <div class="demo-${fileName}">${htmlStr}</div> </template> \n  ${pageScript} \n  <style lang="scss"  >${styleStr}</style>`

  return result
}

const parser = markdown('default', {
  // ?????????markdown?????????demo::??????????????????
  highlight: renderHighlight
})
// const ensureVPre = function(markdown, ...args) {
//   if (markdown && markdown.renderer && markdown.renderer.rules) {
//     const rules = ['code_inline', 'code_block', 'fence']
//     const rendererRules = markdown.renderer.rules
//     rules.forEach(function(rule) {
//       if (typeof rendererRules[rule] === 'function') {
//         const saved = rendererRules[rule]
//         rendererRules[rule] = function() {
//           return saved.apply(this, args).replace(/(<pre|<code)/g, '$1 v-pre')
//         }
//       }
//     })
//   }
// }
// ensureVPre(parser)

const defaultRender = parser.renderer.rules.fence
parser.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  // ????????? fence ????????? :::demo ???
  const prevToken = tokens[idx - 1]
  const isInDemoContainer = prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^demo\s*(.*)$/)
  if (token.info === 'html' && isInDemoContainer) {
    return `<template slot="highlight">
					${defaultRender(tokens, idx, options, env, self)}
				</template>`
  }

  return `<div class="code-common">${defaultRender(tokens, idx, options, env, self)}</div>`
}

// ???table????????????
parser.renderer.rules.table_open = function() {
  return '<table class="md-table">'
}

// ```code`` ?????????????????????class code_inline
const { code_inline } = parser.renderer.rules
parser.renderer.rules.code_inline = function(...args) {
  args[0][args[1]].attrJoin('class', 'code_inline')
  return code_inline(...args)
}

parser.use(require('markdown-it-container'), 'demo', {
  validate(params) {
    return params.trim().match(/^demo\s*(.*)$/)
  },
  // ???demo????????????div.kv-demo??????
  render(tokens, idx) {
    // const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
    if (tokens[idx].nesting === 1) {
      const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : ''
      // ??????demo??????????????????demo-block??????????????????????????????render fence??????????????????fence????????????????????????????????????????????????????????????
      return `<demo-block><div  class="kv-demo">${content}</div>`
    }
    return '</demo-block>'
  }
})

const { slugify } = require('transliteration')
parser.use(require('markdown-it-anchor'), {
  level: 2, // ??????????????????????????????????????????, ???: #?????? ??????????????????
  slugify: slugify, // ?????????slugify, ?????????????????????????????????????????????,?????????????????????id??????
  permalink: true, // ????????????????????????
  permalinkBefore: true // ????????????????????????
})

parser.use(require('markdown-it-container'), 'tip')
parser.use(require('markdown-it-container'), 'warning')

module.exports = function(source) {
  this.cacheable && this.cacheable()
  const { resourcePath = '' } = this
  const fileName = path.basename(resourcePath, '.md')
  // @?????????markdown??????????????????
  source = source.replace(/@/g, '__at__')

  const content = parser.render(source).replace(/__at__/g, '@')

  const result = renderMd(content, fileName)
  return result
}
