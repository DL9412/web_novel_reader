const { app, BrowserWindow, screen, ipcMain, shell } = require('electron')
const axios = require('axios')
const cheerio = require('cheerio')
const { defaults, defaultSource } = require('./defaults.js')
const utils = require('./utils')
const electronStore = require('electron-store');

const store = new electronStore({
    defaults
})
const sourceStore = new electronStore({
    defaults: defaultSource,
    fileExtension: "json",
    name: 'source'
})

const source = sourceStore.store

let sourceConf = source[store.get('useSource')]

let mainWindow = null

function createWindow () {
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        height: 300,
        width: 800,
        alwaysOnTop: store.get('alwaysOnTop'),
        resizable: true,
        frame: false,
        opacity: store.get('customStyle.opacity'),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    // 并且为你的应用加载index.html
    mainWindow.loadFile('./views/index.html')

    // mainWindow.webContents.openDevTools()
}

ipcMain.on('loadPage', (e, book, chapter) => {
    store.set('sourceInfo', {
        book,
        chapter
    })
    let url = utils.strRender(sourceConf.url.content, {book,chapter})
    const useProxy = store.get('proxy.useProxy')
    if(useProxy) {
        url = store.get('proxy.url') + utils.b64Encode(url)
    }
    axios.get(url, {
        responseType: "text"
    })
        .then(res => {
            let str = res.data
            if(useProxy) str = utils.b64Decode(str)
            const $ = cheerio.load(str)
            const result = {}
            for(let k in sourceConf.pattern.content) {
                const o = sourceConf.pattern.content[k]
                let querystr = `$('${o.selector}').${o.getter.join('.')}`
                let str = eval(querystr)
                if(o.reg){
                    try{
                        const reg = new RegExp(o.reg)
                        str = str.match(reg).groups.match
                    } catch (e) {
                        str = ''
                    }
                }
                result[k] = str
            }
            e.sender.send('pageLoad', result)
        })
        .catch(err => {
            e.sender.send('pageLoadError', err)
        })
})

ipcMain.on('saveStyle', (e, customStyle) => {
    mainWindow.setOpacity(customStyle.opacity)
    store.set('customStyle', customStyle)
})

ipcMain.on('saveSetting', (e, customSetting) => {
    sourceConf = source[customSetting.useSource]
    store.set('useSource', customSetting.useSource)
    store.set('proxy.useProxy', customSetting.useProxy)
    store.set('proxy.url', customSetting.proxyUrl)
    store.set('alwaysOnTop', customSetting.alwaysOnTop)
    mainWindow.setAlwaysOnTop(customSetting.alwaysOnTop)
})

ipcMain.on('quit', (e) => {
    app.quit()
})

app.whenReady().then(createWindow)
