const Koa = require('koa');
const router = require('koa-router')();
const req = require('./req')

const app = new Koa();

router.get('/proxy/https/:hash', async (ctx, next) => {
    let b = Buffer.from(ctx.params.hash, 'base64')
    let res = await req.reqGet(b.toString('ascii'))
    ctx.response.body = res
});

router.get('/proxy/http/:hash', async (ctx, next) => {
    let b = Buffer.from(ctx.params.hash, 'base64')
    let res = await req.reqGetHttp(b.toString('ascii'))
	console.log(res)
    ctx.response.body = res
})

app.use(router.routes());

app.listen(3001);
console.log('listen@3001')
