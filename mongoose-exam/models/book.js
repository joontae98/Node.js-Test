var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema  = new Schema({
    title: String,
    content: String,
    create_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('book',bookSchema);
// collection 의 네이밍을 단수로 해도 자동으로 복수로 변환 ex) book -> books