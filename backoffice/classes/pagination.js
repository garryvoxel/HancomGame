class Pagination {
    constructor(req, totalItemCount) {
        const request = req || {};

        this.currentPage = parseInt(req.query.page || 1);

        if (this.currentPage <= 0) {
            this.currentPage = 1;
        }

        this.itemsPerPage = parseInt(req.query.count || 10);
        this.totalItemCount = parseInt(totalItemCount);
        this.pagesPerBlock = 10;

        this.virutalNumberStart =  this.totalItemCount - (this.currentPage-1) * this.itemsPerPage;

        //console.log(`로그 보자 %j %j %j`,this.totalItemCount, this.currentPage, this.itemsPerPage );

        this.totalPageCount = this.totalItemCount > 0 ? Math.ceil(this.totalItemCount / this.itemsPerPage) : 1;
        this.totalBlockCount = Math.ceil(this.totalPageCount / this.pagesPerBlock);
        this.block = Math.ceil(this.currentPage / this.pagesPerBlock);
        this.firstPage = (this.block - 1) * this.pagesPerBlock + 1;
        this.lastPage = Math.min(this.block * this.pagesPerBlock, this.totalPageCount);

        this.url = req.originalUrl.split('?')[0];
        this.field = req.query && req.query.field ? req.query.field : null;
        this.keyword = req.query && req.query.keyword ? req.query.keyword : null;
    }

    hasNext() {
        return this.currentPage < this.totalPageCount;
    }

    hasPrev() {
        return this.currentPage > 1;
    }

    prev() {
        return this.query({
            page: this.currentPage - 1
        });
    }

    next() {
        return this.query({
            page: this.currentPage + 1
        })
    }

    first() {
        return this.query({
            page: this.firstPage
        });
    }

    last() {
        return this.query({
            page: this.lastPage
        });
    }

    page(page) {
        return this.query({
            page: page
        });
    }

    query(args) {
        const queries = [];

        args = args || {};
        args.page = args.page || this.page;
        args.count = args.count || this.itemsPerPage;
        args.field = args.field || this.field;
        args.keyword = args.keyword || this.keyword;

        for (var key in args) {
            if (args[key]) {
                queries.push(`${key}=${args[key]}`);
            }
        }

        return this.url + '?' + queries.join('&');
    }
}

module.exports = Pagination;