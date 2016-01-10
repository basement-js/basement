// Remove this file once a real model is added

module.exports = function () {
    var TestTable = this.bookshelf.Model.extend({
        tableName: "test_table"
    });

    return this.bookshelf.model("TestTable", TestTable);
}