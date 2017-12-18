const logger = require('koa-logger');
const serve = require('koa-static');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const Koa = require('koa');
const app = new Koa();
const fs = require('fs-extra');
const gm = require('gm');

const PORT = 8080;

app.use(logger());
app.use(cors({ credentials: true }));
app.use(koaBody({ multipart: true }));

// handle uploads
app.use( (ctx, next) => new Promise( (resolve, reject) => {
    // ignore non-POSTs
    if ('POST' != ctx.method) {
        console.log(ctx.method);
        resolve();
        return next();
    }

    const file = ctx.request.body.files.file;
    console.log(file);
    const readStream = fs.createReadStream(file.path);

    gm(readStream, 'img.jpg')
        .identify((err, value) => {
            console.log('finishhh');
            console.log(err);
            console.log(value);
            ctx.body = value;
            resolve();
        });
})
);

// listen

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});