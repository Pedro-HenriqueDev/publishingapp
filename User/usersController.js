const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Users = require('./Users');
const adminAuth = require('../middleware/adminAuth');
const session = require('express-session');

router.get('/users/create', (req,res) => {
    if(req.query.error) {
        res.render('users/create', {message: true});
    } else {
        res.render('users/create', {message: false});
    }
})

router.post('/users/save', (req,res) => {
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password
    let photo = req.body.photo

    Users.findOne({where: {email: email}}).then(user => {
        if(user == undefined) {
            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)

            Users.create({
                email: email,
                name: name,
                password: hash,
                photo: photo
            }).then(() => {
                res.redirect('/users/login');
            }).catch(err => {
                console.log(err)
            })
        }else {
            res.redirect('/users/create/?error=true')
        }
    })

})

router.get('/users/login', (req,res) => {
    if(req.query.error) {
        res.render('users/login', {message: true});
    } else {
        res.render('users/login', {message: false});
    }
})

router.post('/users/authenticate', (req,res) => {
    let email = req.body.email;
    let password = req.body.password;

    Users.findOne({where: {email: email}}).then(users => {
        if(users != undefined) {
            let correct = bcrypt.compareSync(password, users.password)

            if(correct) {
                req.session.user ={
                    name: users.name,
                    id: users.id,
                    photo: users.photo
                };

                res.redirect('/users/articles')
            } else {
                res.redirect('/users/login/?error=true');
            }
        } else {
            res.redirect('/users/login/?error=true');
        }
    }).catch(err => {
        console.log(err)
    })
})

router.get('/users/logout',adminAuth, (req,res) => {
    req.session.user = undefined;

    res.redirect('/');
});

router.get('/users/delete',adminAuth, (req,res) => {
    res.render('users/delete')
})

router.post('/users/delete/confirm' ,(req,res) => {
    let email = req.body.email;
    let password = req.body.password;

    Users.findOne({where: {email: email}}).then(users => {
        if(users != undefined) {
            let correct = bcrypt.compareSync(password, users.password)

            if(correct) {
                req.session.user = undefined
                Users.destroy({where: {id: users.id}}).then(() => {
                    res.redirect('/')
                })                
            } else {
                res.redirect('/users/delete')
            }
        } else {
            res.redirect('/users/delete')
        }
    })
})
module.exports = router;