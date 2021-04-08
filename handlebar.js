const Handlebars = require('handlebars')
const fs = require('fs')
let contracts = JSON.parse(fs.readFileSync('contracts.json'))

let index_template = fs.readFileSync(
  'tokenhost-web-template/pages/index.hbs',
  'utf-8',
)

const template = Handlebars.compile(index_template)

fs.writeFileSync('site/pages/index.js', template(contracts))

let page_template = Handlebars.compile(
  fs.readFileSync('tokenhost-web-template/pages/contract.hbs', 'utf-8'),
)

let AddTemplate = Handlebars.compile(
  fs.readFileSync('tokenhost-web-template/components/Add.hbs', 'utf-8'),
)

let IndexTemplate = Handlebars.compile(
  fs.readFileSync('tokenhost-web-template/components/Index.hbs', 'utf-8'),
)

let ViewTemplate = Handlebars.compile(
  fs.readFileSync('tokenhost-web-template/components/View.hbs', 'utf-8'),
)

for (var contract in contracts.contracts) {
  console.log('c', contract)
  fs.writeFileSync(`site/pages/${contract}.js`, page_template({ contract }))

  try {
    fs.mkdirSync(`site/components/${contract}`, true)
  } catch (e) {}

  fs.writeFileSync(
    `site/components/${contract}/Add.js`,
    AddTemplate({ contract }),
  )
  fs.writeFileSync(
    `site/components/${contract}/Index.js`,
    IndexTemplate({ contract:contract }),
  )
  fs.writeFileSync(
    `site/components/${contract}/View.js`,
    ViewTemplate({ contract }),
  )
}