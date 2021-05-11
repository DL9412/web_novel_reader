module.exports = {
  defaults:{
    useSource: "9txs",
    alwaysOnTop: false,
    sourceInfo: {
      book: '',
      chapter: ''
    },
    proxy: {
      useProxy: true,
      url: "http://106.12.205.233:3000/proxy/https/"
    },
    customStyle: {
      backgroundColor: '#ffffff',
      color: '#333333',
      opacity: 1,
      fontSize: 12,
      padding: 5
    }
  },
  defaultSource:{
    "9txs": {
      "name": "9txs",
      "url": {
        "content": "https://www.9txs.com/book/{{book}}/{{chapter}}.html"
      },
      code: "utf8",
      "pattern": {
        "content": {
          "title": {
            "selector": ".area h1",
            "getter": ["text()"]
          },
          "content": {
            "selector": "#content",
            "getter": ["html()"]
          },
          "prev": {
            "selector": ".page a",
            "getter": ["eq(0)","attr('href')"],
            "reg": "\\/(?<match>\\d*?).html$"
          },
          "next": {
            "selector": ".page a",
            "getter": ["eq(-1)","attr('href')"],
            "reg": "\\/(?<match>\\d*?).html$"
          }
        },
        "catalog": {}
      }
    },
    "ewx": {
      "name": "ewx",
      "url": {
        "content": "http://ewenxue.org/xs/{{book}}/{{chapter}}.htm"
      },
      code: "",
      "pattern": {
        "content": {
          "title": {
            "selector": "#h1 h1",
            "getter": ["text()"]
          },
          "content": {
            "selector": "#cContent",
            "getter": ["html()"]
          },
          "prev": {
            "selector": "#chapter .clearfix li",
            "getter": ["not('.mb20')","find('a')","eq(0)","attr('href')"],
            "reg": "\\/(?<match>\\d*?).htm$"
          },
          "next": {
            "selector": "#chapter .clearfix li",
            "getter": ["not('.mb20')","find('a')","eq(-1)","attr('href')"],
            "reg": "\\/(?<match>\\d*?).htm$"
          }
        },
        "catalog": {}
      }
    }
  }
}


