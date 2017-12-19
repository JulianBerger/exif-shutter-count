const logger = require('koa-logger');
const serve = require('koa-static');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const Koa = require('koa');
const app = new Koa();
const os = require('os');
const path = require('path');
const fs = require('fs-extra');

const { ExifTool } = require("exiftool-vendored");
const exiftool = new ExifTool();

const PORT = 8080;

exiftool.version().then( (version) => {
    console.log(`We're running ExifTool v${version}`);
});

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
    const tmpFilePath = path.join(os.tmpdir(), Math.random().toString() + file.name);
    const readStream = fs.createReadStream(file.path);
    const writestream = fs.createWriteStream(tmpFilePath);
    readStream.pipe(writestream);
    console.log('uploading %s -> %s', file.name, writestream.path);

    exiftool
        .read(tmpFilePath)
        .then((tags /*: Tags */) => {
          // remove file
          fs.unlink(tmpFilePath, (err) => {
            if(err) return console.error(`Remove File Error: ${err}`);
            console.log(`Removed File: ${tmpFilePath}`);
          });

          console.log(`Make: ${tags.Make}, Model: ${tags.Model}, Errors: ${tags.errors}`);
          console.log(`All Tags: ${tags}`);

          let response = {};
          response.exif = tags;

          ctx.body = response;
          resolve();
        })
        .catch(err => console.error("Something terrible happened: ", err))

})
);

// listen

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});