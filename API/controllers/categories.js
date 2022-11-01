const posts = new (require('../models/posts'))()
const categories = new (require('../models/categories'))()
const getAbsoluteUrl = require('../utils/getAbsoluteUrl')

module.exports = {
    async getCategoriesList(req, res) {
        const url = getAbsoluteUrl(req);
        const pageNum = req.query.page ?? 1;
        const limit = req.query.limit ?? 10;

        let list = await categories.pagination(pageNum, limit);
        let responseData = {
            list : list,
            links: {
                next: `${url}?page=${pageNum + 1}&limit=${limit}`,
                self: `${url}?page=${pageNum}&limit=${limit}`
            }
        }

        res.status(200).json(responseData);
    },

    async newCategory(req, res) {
        if(req.user.role !== 'admin') {
            res.sendStatus(403);
            return;
        }
        let categoryId = await categories.save(req.body)
        if (categoryId == -1) {
            res.sendStatus(400);
            return;
        }

        res.status(200).json({category_id: categoryId});
    },

    async getCategory(req, res) {
        let categoryId = parseInt(req.params.categoryId);
        if(isNaN(categoryId)) {
            res.sendStatus(400);
            return;
        }
        let category = await categories.find(categoryId);
        if (category == -1) {
            res.sendStatus(400);
            return;
        }

        res.status(200).json(category);
    },

    async updateCategory(req, res) {
        if(req.user.role !== 'admin') {
            res.sendStatus(403);
            return;
        }
        let categoryId = parseInt(req.params.categoryId);
        if(isNaN(categoryId)) {
            res.sendStatus(400);
            return;
        }
        
        let resId = await categories.save({id: categoryId, ...req.body})
        if (resId == -1) {
            res.sendStatus(400);
            return;
        }

        res.sendStatus(200);
    },

    async deleteCategory(req, res) {
        if(req.user.role !== 'admin') {
            res.sendStatus(403);
            return;
        }

        let categoryId = parseInt(req.params.categoryId);
        if(isNaN(categoryId)) {
            res.sendStatus(400);
            return;
        }

        if (!await categories.delete(categoryId)) {
            res.sendStatus(400);
            return;
        }
        
        res.sendStatus(200);
    },

    async getPostsByCategory(req, res) {
        let categoryId = parseInt(req.params.categoryId);
        if(isNaN(categoryId)) {
            res.sendStatus(400);
            return;
        }
        const url = getAbsoluteUrl(req);
        const pageNum = req.query.page ?? 1;
        const limit = req.query.limit ?? 10;

        const sqlFilter = `left join posts_categories on posts.id = posts_categories.post_id where category_id = ` + categoryId;
        let list = await posts.pagination(pageNum, limit, sqlFilter);
        let responseData = {
            list : list,
            links: {
                next: `${url}?page=${pageNum + 1}&limit=${limit}`,
                self: `${url}?page=${pageNum}&limit=${limit}`
            }
        }

        res.status(200).json(responseData);
    }
}