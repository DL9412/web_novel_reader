const https = require("https")
const http = require("http")
const buffer = require("buffer")

function reqGet(url) {
  console.log(url)
  return new Promise(function(resolve, reject){
    https.get(url, res => {
	    let tmp = null
        res.on('data', (d) => {
            tmp = tmp?tmp+=d:d
        });
	    res.on('end', d => {
            resolve(Buffer.from(tmp).toString('base64'))
	    })
    }).on('error', (e) => {
        reject(e)
    })
  })
}

function reqGetHttp(url) {
  console.log(url)
  return new Promise(function(resolve, reject){
    http.get(url, res => {
	    let tmp = null
        res.on('data', (d) => {
            tmp = tmp?tmp+=d:d
        });
	    res.on('end', d => {
            resolve(Buffer.from(tmp).toString('base64'))
	    })
    }).on('error', (e) => {
        reject(e)
    })
  })
}

module.exports = {
    reqGet,
    reqGetHttp
}
