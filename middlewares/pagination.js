/**
 * This function takes one parameter (model) and then returns an async function. 
 * 
 * Inside this function, there are two query parameters: 
 * page- refer to the current page you are requesting and 
 * limit- is the number of documents you wish to retrieve.
 * 
 * Then there’s a skipIndex to skip the relevant number from the results list. 
 * The exec() function will execute this query as a promise.
 * 
 * @param {model} collection object
 * @returns {async function}
 */
const pagination = (model) => async (req, res, next) => {
    let page;
    let limit;
    if (!req.query.page) {
        page = 1
    } else {
        page = parseInt(req.query.page);
    }
    if (!req.query.limit) {
        limit = 9
    } else {
        limit = parseInt(req.query.limit);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {}
    if (endIndex < await model.countDocuments().exec()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }
    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    try {
        const paginationParams = {
            limit,
            startIndex
        }
        req.paginationParams = paginationParams;
        req.model = model;
        next()
    } catch (e) {
        console.log(e, "This is error in paginatedresults middleware");
        res.status(500).send({ status: "failed", message: e.message })
    }
}

module.exports = pagination;