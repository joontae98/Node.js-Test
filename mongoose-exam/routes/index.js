// pretty URL 사용

// express = app
module.exports = (app, Book) => {
    // GET ALL BOOKS
    app.get('/api/books', (req, res) => {
        Book.find((err, books) => {
            if (err) return res.status(500).send({error: 'database failure'});
            res.json(books);
        })
    });

    // GET SINGLE BOOK
    app.get('/api/books/:book_id', (req, res) => {
        Book.findOne({_id: req.params.book_id}, (err, book) => {
            if (err) return res.status(500).json({error: err});
            if (!book) return res.status(404).json({error: 'book not found'});
            res.json(book);
        })
    });

    // GET BOOK BY CONTENT
    app.get('/api/books/content/:content', (req, res) => {
        Book.find({content: req.params.content}, {_id: 0, title: 1, create_date: 1}, (err, books) => {
            if (err) return res.status(500).json({error: err});
            if (books.length === 0) return res.status(404).json({error: 'book not found'});
            res.json(books);
        })
    });

    // CREATE BOOK
    app.post('/api/books', (req, res) => {
        var book = new Book();
        book.title = req.body.name;
        book.content = req.body.content;
        book.create_date = new Date();

        book.save((err) => {
            if (err) {
                console.error(err);
                res.json({result: 0});
                return;
            }
            res.json({result: 1});
            console.log(book);
        });
    });

    // UPDATE THE BOOK
    app.put('/api/books/:book_id', (req, res) => {
        Book.findById(req.params.book_id, (err, book) => {
            if (err) return res.status(500).json({error: 'database failure'});
            if (!book) return res.status(404).json({error: 'book not found'});

            if (req.body.title) book.title = req.body.title;
            if (req.body.content) book.content = req.body.content;
            if (req.body.create_date) book.create_date = req.body.create_date;

            book.save((err) => {
                if (err) res.status(500).json({error: 'failed to update'});
                res.json({message: 'book updated'});
            })

        })
    });

    // DELETE BOOK
    app.delete('/api/books/:book_id', (req, res) => {
        Book.remove({_id: req.params.book_id}, (err, output) => {
            if (err) return res.status(500).json({error: "database failure"});
            res.status(204).end();
        })
    });
}