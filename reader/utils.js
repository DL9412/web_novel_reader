function b64Encode(str, code='utf8') {
    const b = Buffer.from(str, code)
    return b.toString('base64')
}

function b64Decode(str, code='utf8') {
    const b = Buffer.from(str, 'base64')
    return b.toString(code)
}

function strRender(str, obj) {
    return str.replace(/{{(\w+?)}}/g,(match,group) => obj[group])
}

module.exports = {
    b64Encode,
    b64Decode,
    strRender
}
