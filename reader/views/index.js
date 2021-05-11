const { ipcRenderer, shell } = require('electron')
const Store = require('electron-store')

const store = new Store();
const sourceStore = new Store({
    name: 'source'
})

const vueApp = new Vue({
    el: '#main',
    data: {
        dialogVis:{
            go: false,
            style: false,
            setting: false
        },
        menuHide: false,
        customStyle: store.get('customStyle'),
        customSetting: {
            useSource: store.get('useSource'),
            useProxy: store.get('proxy.useProxy'),
            proxyUrl: store.get('proxy.url'),
            alwaysOnTop: store.get('alwaysOnTop')
        },
        bookCode: store.get('sourceInfo.book'),
        chapterCode: store.get('sourceInfo.chapter'),
        sourceList: sourceStore.store,
        title: '',
        content: '',
        next: '',
        prev: '',
        enableDrag: false
    },
    computed: {
        readerStyle() {
            return {
                backgroundColor: this.customStyle.backgroundColor,
                color: this.customStyle.color,
                fontSize: this.customStyle.fontSize+'px',
                padding: '0 '+this.customStyle.padding+'px',
            }
        }
    },
    mounted() {
        ipcRenderer.on('pageLoad', (e, res) => {
            this.content = res.content
            this.title = res.title
            this.prev = res.prev
            this.next = res.next
            this.openDialog()
            this.menuHide = true
            document.body.parentNode.scrollTo(0, 0)
        })
        ipcRenderer.on('pageLoadError', (e, err) => {
            this.$message({
                message: 'load error',
                type: 'error'
            })
        })
        window.addEventListener('keydown', e => {
            switch (e.key) {
                case 'ArrowRight':
                    this.goNext()
                    break
                case 'ArrowLeft':
                    this.goPrev()
                    break
            }
        })
        if(this.bookCode && this.chapterCode) this.loadBook()
    },
    watch: {
    },
    methods: {
        loadBook() {
            ipcRenderer.send('loadPage', this.bookCode, this.chapterCode)
        },
        openDialog(name) {
            for(const k in this.dialogVis) {
                this.dialogVis[k] = k == name
            }
        },
        goPrev(e) {
            if(!this.prev){
                this.$message({
                    message: 'no prev chapter',
                    type: 'warning'
                })
                return
            }
            this.chapterCode = this.prev
            this.loadBook()
        },
        goNext(e) {
            if(!this.next){
                this.$message({
                    message: 'no next chapter',
                    type: 'warning'
                })
                return
            }
            this.chapterCode = this.next
            this.loadBook()
        },
        saveStyle() {
            this.openDialog()
            ipcRenderer.send('saveStyle', this.customStyle)
        },
        saveSetting() {
            this.openDialog()
            ipcRenderer.send('saveSetting', this.customSetting)
        },
        editSource() {
            sourceStore.openInEditor()
        },
        openPath() {
            shell.showItemInFolder(store.path)
        },
        closeWindow() {
            ipcRenderer.send('quit')
        }
    }
})
