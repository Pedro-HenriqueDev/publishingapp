const express = require('express');
const router = express.Router();
const session = require('express-session');
const Articles = require('./Articles')
const Users = require('../User/Users')
const adminAuth = require('../middleware/adminAuth');

router.get('/articles/create',adminAuth, (req,res) => {
    res.render('articles/create', {user: req.session.user})
})
router.get('/articles/publicacoes',adminAuth, (req,res) => {
    Articles.findAndCountAll({
        limit: 7,
        offset: 0,
        order: [
            ["id", "DESC"]
        ]
    }).then(articles => {
        let result = {
            articles: articles
        };
        Users.findAll().then(users => {
            res.render('publishing', {user: req.session.user, result: result, users: users});
        })
    });
});
router.post('/articles/save', (req, res) => {
    let title = req.body.title;
    let description = req.body.description;

    Articles.create({
        title: title,
        description: description,
        userId: req.session.user.id
    }).then(() => {
        res.redirect("/users/articles")
    })
});

router.get('/users/articles',adminAuth, (req,res) => {
    Articles.findAndCountAll({
        where: {userId: req.session.user.id},
        limit: 7,
        offset: 0,
        order: [
            ["id", "DESC"]
        ]
    }).then(articles => {
        let result = {
            articles: articles
        };
        res.render('users/articlesUser', {user: req.session.user, result: result});
    });
})

router.post('/articles/delete', (req,res) => {
    let id = req.body.id;

    Articles.destroy({where: {id: id}}).then(() => {
        res.redirect('/users/articles')
    })
})

router.get('/articles/update/:id',adminAuth, (req,res) => {
    let id = req.params.id
    let idUser = req.session.user
    
    Articles.findOne({where: {id: id, userId: idUser.id}}).then(articles => {
        res.render('articles/edit', {article: articles, user: req.session.user});
    });
});

router.post('/articles/update/save', (req,res) => {
    let title = req.body.title;
    let description = req.body.description;
    let id = req.body.id;
    let idUser = req.session.user;

    Articles.update({
        title: title,
        description: description
    },{where: {userId: idUser.id, id: id}}).then(() => {
        res.redirect('/users/articles');
    });
});

router.get('/articles/page/:id',adminAuth, (req,res) => {
    var page = req.params.id;
    var offset = 0
    
    if(isNaN(page)) {
        offset = 0;
    } else {
        offset = parseInt(page) * 7;
    }
    Articles.findAndCountAll({
        limit: 7,
        offset: offset,
        order: [
            ["id", "DESC"]
        ]
    }).then(articles => {
        let next;
        if(offset + 7 >= articles.count) {
            next = false
        } else {
            next = true
        }
        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        };
        Users.findAll().then(users => {
            res.render('page', {user: req.session.user ,result: result, users: users})  
        })
    })

});

router.get('/user/articles/page/:id',adminAuth, (req,res) => {
    var page = req.params.id;
    var offset = 0
    
    if(isNaN(page)) {
        offset = 0;
    } else {
        offset = parseInt(page) * 7;
    }
    Articles.findAndCountAll({
        where: {userId: req.session.user.id},
        limit: 7,
        offset: offset,
        order: [
            ["id", "DESC"]
        ]
    }).then(articles => {
        let next;
        if(offset + 7 >= articles.count) {
            next = false
        } else {
            next = true
        }
        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        };
            res.render('users/page', {user: req.session.user ,result: result});
    });

});
module.exports = router;
