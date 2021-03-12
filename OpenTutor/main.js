var express = require('express')
var app = express()
var port = 4000
var fs = require('fs')
var path = require('path')
var template = require('./lib/template')
var qs = require('querystring')
var sanitizeHtml = require('sanitize-html')
var bodyParser = require('body-parser')
var multer = require('multer')

app.use(bodyParser.urlencoded({extended: false}))

// request -> 불러올때, response -> 내보낼 때

// pretty URL
// '/page/:${key}' => /page/${value}
// return {"key" : "value"}
// ex     {"name" : "park"}

app.get('/', (req, res) => {
    fs.readdir('./data', (err, filelist) => {
        var title = 'Welcome'
        var description = 'Hello, Node.js'
        var list = template.list(filelist)
        var html = template.HTML(title, list,
            `<h2>${title}</h2><p>${description}</p>`,
            `<a href="/create">create</a>`
        )
        res.send(html)
    })
})

app.get('/page/:pageId', (req, res) => {
    fs.readdir('./data', (error, filelist) => {
        var filteredId = path.parse(req.params.pageId).base
        fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
            var title = req.params.pageId
            var sanitizedTitle = sanitizeHtml(title)
            var sanitizedDescription = sanitizeHtml(description)
            var list = template.list(filelist)
            var html = template.HTML(title, list,
                `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
                `<a href="/create">create</a>
            <a href="/update/${sanitizedTitle}">update</a>
            <form action="/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form> `
            )
            res.send(html)
        })
    })
})

app.get('/create', (req, res) => {
    fs.readdir('./data', (err, filelist) => {
        var title = 'Create'
        var list = template.list(filelist)
        var html = template.HTML(title, list, `
        <form action="/create_process" method="post">
          <p>
            <input type="text" name="title" placeholder="title">
          </p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `, ''
        )
        res.send(html)
    })
})

app.post('/create_process', (req, res) => {
    var post = req.body
    var title = post.title
    var description = post.description
    fs.writeFile(`./data/${title}`, description, 'utf8', (err) => {
        res.redirect(`/page/${title}`)
    })
})

app.get('/update/:pageId', (req, res) => {
    fs.readdir('./data', (err, filelist) => {
        var filteredId = path.parse(req.params.pageId).base
        fs.readFile(`data/${filteredId}`, 'utf8', (err2, description) => {
            var title = req.params.pageId
            var list = template.list(filelist)
            var html = template.HTML(title, list,
                `
          <form action="/update_process "method="post">
          <input type="hidden" name="id" value="${title}">
            <p>
              <input type="text" name="title" placeholder="title" value="${title}">
            </p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
                `<a href="/create">create</a> <a href="/update/${title}">update</a>`
            )
            res.send(html)
        })
    })
})

app.post('/update_process', (req, res) => {
    var post = req.body
    var id = post.id
    var title = post.title
    var description = post.description
    fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
        fs.writeFile(`./data/${title}`, description, 'utf8', (err) => {
            res.redirect(`/page/${title}`)
        })
    })
})

app.post('/delete_process', (req, res) => {
    var post = req.body
    var id = post.id
    var filteredId = path.parse(id).base
    fs.unlink(`./data/${filteredId}`, (err) => {
        res.redirect('/')
    })
})
// img url code
app.get('/:img', (req, res) => {
    var img = req.params.img
    fs.readFile(`./imgs/${img}`, (err,data) => {
        res.end(data)
    })
})
// multer code image create
var upload = multer({
    storage: multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null, 'imgs/');
        },
        filename:(req,file,cb)=>{
            cb(null,`img04.jpg`);
        }
    })
});

app.post('/img_create',upload.single('file'), (req,res) => {
    console.log(req.file);
    res.send(JSON.stringify(
        { result : "success" }
    ));

})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})