import './polyfills'
import '@fortawesome/fontawesome-free/css/all.css'
import 'normalize.css/normalize.css'
import lzString from 'lz-string'
import 'jsoneditor/dist/jsoneditor.css'
import JSONEditor from 'jsoneditor/dist/jsoneditor.js'
import './toolbox.css'

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/

let mode = 'app'
let view = 'desktop'
let tile = 'createSpendingWheel'
let audience = 'consumer'
let collapsed = false
let jwt = ''
let environment = new RegExp(/^.*\//).exec(window.location.href)[0]
let config = {
  showHeader                : false,
  showProductHeader         : false,
  showCloseButton           : true,
  hideNotificationsSnackbar : false,
  disableFixed              : false,
  disableSearchButton       : false,
  enableSettings            : false,
  showAdvancedSearch        : true,
  hideTitle                 : false,
  donutSize                 : 250,
  donutSaturation           : 0.15,
  transformAccountNames     : false,
  scrollTracking            : false,
  props: {
    MuiButtonBase: {
      disableRipple: false
    }
  },
  transactions: {
    showOriginalMemo: true
  },
  expenses: {
    // Using local path instead of S3
    balancesImage: `https://geezeo.geezeo.banno-${process.env.ENV}.com/assets/tiles/v2/images/summit-background.png`
  },
  institution: {
    // Using local path instead of S3
    image: `https://geezeo.geezeo.banno-${process.env.ENV}.com/assets/tiles/v2/images/institution.svg`
  },
  product: {
    // Using local path instead of S3
    image: `https://geezeo.geezeo.banno-${process.env.ENV}.com/assets/tiles/v2/images/product.gif`
  },
  header: {
    includeNav : true,
    // Using local path instead of S3
    image: `https://geezeo.geezeo.banno-${process.env.ENV}.com/assets/tiles/v2/images/visa.jpg`,
    height     : 130,
    alpha      : 0.7
  },
  palette: {
    primary: {
      main: '#2C6E9B'
    },
    secondary: {
      main: '#4caf50'
    },
    custom: {
      positive : '#43a047',
      negative : '#e53935',
      success  : '#81c784',
      error    : '#e57373',
      warning  : '#fff176',
      tag      : '#008457',
      tagText  : '#ffffff',
      donut    : [
        '#f7e000', '#c585d5', '#ff5b69', '#00c7b6',
        '#008f80', '#ffc04f', '#5a7576', '#8fdaff',
        '#42577d', '#ea9fe2'
      ]
    },
    contrastThreshold : 2,
    tonalOffset       : 0.2
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  topLevelRoutes: [
    '/',
    '/budgets',
    '/cashflow/agenda',
    '/cashflow',
    '/goals',
    '/networth',
    '/transactions/search',
    '/accounts',
    '/aggregation',
    '/alerts',
    '/help'
  ],
  dashboard: {
    cards: [
      'SpendingWheel',
      'Budgets',
      'CashOverview',
      'NetWorth',
      'Accounts',
      'Transactions',
      'Goals'
    ]
  },
}
let editor

const nodesToArray = nodes => [].slice.call(nodes)

const configWithAuth = ({ excludeAuth } = {}) => {
  let merge = {}
  if (hasValidJWT() && !excludeAuth) {
    merge.auth = {
      jwt: jwt
    }
  }
  return JSON.stringify(Object.assign({}, merge, config), null, ' ')
}

const prepareMarkup = function () {
  let markup = ''
  markup += '<html>\n'
  markup += '<head>\n'
  markup += '<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">\n'
  markup += '</head>\n'
  markup += '<body style="margin: 0; padding: 0;">\n'
  if (mode === 'tile') {
    markup += '<div id="tile"></div>\n'
    markup += '<!-- tiles bootstrap -->\n'
    markup += '<script>\n'
    markup += 'window.geezeo = (function(d, s, id, u) {var js, fjs = d.getElementsByTagName(s)[0],g = window.geezeo || {};\n'
    markup += 'if (d.getElementById(id)) return g;js = d.createElement(s);js.id = id;js.src = u;\n'
    markup += 'fjs.parentNode.insertBefore(js, fjs);g._e = [];g.ready = function() {g._e.push(arguments);};return g;\n'
    markup += '}(document, "script", "geezeo-widgets", "' + environment + 'tiles.js"));\n\n'
    markup += '</script>\n'
    markup += '<!-- example usage -->\n'
    markup += '<script>\n'
    if (hasValidJWT()) {
      markup += 'geezeo.ready({ auth: { jwt: \'' + jwt + '\' } }, function() {\n'
    } else {
      markup += 'geezeo.ready(function() {\n'
    }
    markup += ' window.tile = geezeo.tiles.' + tile + '(document.getElementById("tile"), ' + configWithAuth({ excludeAuth: true }) + ');\n'
    markup += '});\n'
    markup += '<\/script>\n'
  } else if (mode === 'app') {
    markup += '<script type="text/javascript">\n'
    markup += 'window.geezeoConfig = ' + configWithAuth() + ';\n'
    markup += '<\/script>\n'
    markup += '<div id="app"></div>\n'
    markup += '<script type="text/javascript" src="' + environment + audience + '.js"><\/script>\n'
  }
  markup += '</body>\n'
  markup += '</html>\n'
  return markup
}

const render = function () {
  const wrapper = document.getElementById('iframe-wrapper')
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild)
  }
  const iframe = document.createElement('iframe')
  iframe.setAttribute('id', 'tiles-iframe')
  iframe.setAttribute('width', '100%')
  iframe.setAttribute('height', '100%')
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('scrolling', 'no')
  iframe.setAttribute('srcdoc', prepareMarkup())
  wrapper.appendChild(iframe)
  window.iFrameResize({
    sizeHeight  : false,
    checkOrigin : false,
    log         : false
  }, iframe)
}

const serialize = () => {
  return new Promise((resolve, reject) => {
    try {
      const compressed = lzString.compressToEncodedURIComponent(JSON.stringify({
        config,
        audience,
        mode,
        tile,
        view
      }))
      return resolve(compressed)
    } catch(error) {
      return reject(error)
    }
  })
}

const deserialize = () => {
  if (window.location.search === '') {
    audience = 'consumer'
    mode = 'app'
    view = 'desktop'
    tile = 'createSpendingWheel'
    return Promise.resolve({
      config,
      audience,
      mode,
      view,
      tile,
      serialized: false
    })
  }
  return new Promise((resolve, reject) => {
    try {
      const deserialized = JSON.parse(
        lzString.decompressFromEncodedURIComponent(window.location.search.substring(3))
      )
      config = deserialized.config
      audience = deserialized.audience
      mode = deserialized.mode
      tile = deserialized.tile
      view = deserialized.view
      deserialized.serialized = true
      return resolve(deserialized)
    } catch(error) {
      return reject(error)
    }
  })
}

const restoreDefaults = () => {
  setTimeout(() => {
    const tileConfig = document.getElementById('tile-config')
    const appConfig = document.getElementById('app-config')
    const modeAppEl = document.getElementById('mode-app')
    const viewDesktopEl = document.getElementById('view-desktop')
    const audienceConsumerEl = document.getElementById('audience-consumer')

    tileConfig.style.display = 'none'
    appConfig.style.display = ''

    modeAppEl.checked = true
    viewDesktopEl.checked = true
    audienceConsumerEl.checked = true
  }, 500)
}

const restoreForm = results => {
  // restore mode
  nodesToArray(document.getElementsByName('mode')).forEach(element => {
    document.getElementById(`${element.value}-config`).style.display = 'none'
    if (element.value === mode) {
      document.getElementById(`${element.value}-config`).style.display = ''
      element.checked = true
    }
  })
  // restore audience
  nodesToArray(document.getElementsByName('audience')).forEach(element => {
    if (element.value === audience) {
      element.checked = true
    }
  })
  // restore tile
  document.getElementById('tiles').value = tile
  // restore view
  nodesToArray(document.getElementsByName('view')).forEach(element => {
    if (element.value === view) {
      element.checked = true
    }
  })
  updateView()
}

const main = () => {
  deserialize()
    .then(results => {
      results.serialized
        ? restoreForm()
        : restoreDefaults()
      loadJSONEditor()
      render()
      showBody()
    })
}

const updateLinkText = () => {
  const shareLink = document.getElementById('share-link')
  serialize()
    .then(serialized => {
      shareLink.setAttribute('href', '?s=' + serialized)
    })
}

const hasValidJWT = function () {
  return JWT_REGEX.test(jwt)
}

const onConfigChange = () => {
  try {
    config = editor.get()
    updateLinkText()
    render()
  } catch (e) {
    // ignore invalid json
  }
}

const showBody = () => {
  document.body.style.display = ''
}

const loadJSONEditor = () => {
  if (!editor) {
    editor = new JSONEditor(document.getElementById('jsoneditor'), {
      mode            : 'tree',
      modes           : ['tree', 'code'],
      search          : false,
      enableTransform : false,
      onChange        : onConfigChange,
      onColorPicker: (parent, color, onChange) => {
        new JSONEditor.VanillaPicker({
          parent : parent,
          color  : color,
          popup  : 'top',
          onChange: color => {
            const alpha = color.rgba[3]
            const hex = (alpha === 1)
              ? color.hex.substr(0, 7)  // return #RRGGBB
              : color.hex               // return #RRGGBBAA
            onChange(hex)
          }
        }).show()
      }
    }, config)
    editor.expandAll()
  }
}

const updateView = () => {
  const wrapperEl = document.getElementById('iframe-wrapper')
  wrapperEl.className = view === 'desktop' ? '' : 'mobile'
}

window.onModeChange = function (e) {
  mode = e.value
  // toggle config visibility
  document.getElementById('tile-config').style.display = mode === 'tile' ? '' : 'none'
  document.getElementById('app-config').style.display = mode === 'app' ? '' : 'none'
  updateLinkText()
  render()
}

window.onAudienceChange = function (e) {
  audience = e.value
  updateLinkText()
  render()
}

window.onViewChange = function (e) {
  view = e.value
  updateLinkText()
  updateView()
}

window.onTileChange = function (e) {
  tile = e.value
  updateLinkText()
  render()
}

window.onJWTChange = function (e) {
  jwt = e.value
  if (hasValidJWT() || jwt === '') {
    e.style.outlineColor = 'rgb(153, 153, 158)'
    render()
  } else {
    e.style.outlineColor = '#bd5252'
  }
}

window.onCollapseClick = e => {
  e.preventDefault()
  const iframe = document.getElementById('iframe-wrapper-border')
  const controls = document.getElementById('controls')
  const collapseIcon = document.getElementById('collapse-icon')
  if (collapsed) {
    iframe.classList.add('iframe-wrapper-border-shift')
    controls.classList.add('controls-shift')
    collapseIcon.classList.add('fa-caret-right')
  } else {
    iframe.classList.remove('iframe-wrapper-border-shift')
    controls.classList.remove('controls-shift')
    collapseIcon.classList.remove('fa-caret-right')
  }
  collapsed = !collapsed
}

window.onDownloadClick = e => {
  const blob = new Blob([prepareMarkup()], { type: 'text/html;charset=utf-8;' })
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, 'tiles.html')
  } else {
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'tiles.html')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  e.preventDefault()
}

main()
