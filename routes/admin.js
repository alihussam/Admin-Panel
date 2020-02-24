var express = require('express');
var router = express.Router();
const axios = require('axios')
const redirect = require('url');
/* GET home page. */
router.get('/login', function(req, res, next) {
    let alert,alertType;
    if(req.query.alert){
        alert = req.query.alert
        alertType = req.query.alertType
    }
    res.render('login.hbs',{alert: alert,alertType: alertType});
});

router.post('/login',function (req,res,next) {
  const url = 'https://auth-dhub.herokuapp.com/a/login'

  axios.post(url,req.body)
      .then((ApiResponse)=>{
        if(ApiResponse.status === 200){
            console.log(ApiResponse.data.headers)
            req.session.admin = ApiResponse.data.body._id
            req.session.auth = ApiResponse.data.headers['x-auth']
            req.session.refreshToken = ApiResponse.data.headers['r-auth']
            res.redirect('/admin/home')
        }
        else{
            res.render('login',{alert: ApiResponse.response})
        }
      })
      .catch((error)=>{
          console.log(error)
        res.render('login',{alert: error})

      })
})


router.get('/home',function (req,res) {
    if(req.session.admin){
        res.render('adminindex.hbs')
    }
    else{
        res.redirect('/admin/login')
    }
})

router.get('/createadmin',function (req,res) {
    if(req.session.admin) {
        res.render('createadmin')
    }
    else{
        res.redirect('/admin/login')
    }
})

router.post('/createadmin',function (req,res) {
    if(req.session.admin) {
        const id = req.session.admin
        const requestObject = {
            'name': req.body.name,
            'email': req.body.email,
            'password': req.body.password,
            'phone': req.body.phone,
            'uid': id
        }
        console.log(requestObject)
        const url = 'https://auth-dhub.herokuapp.com/a/createAdmin'
        axios.post(url, requestObject)
            .then((createAdminResponse) => {
                if(createAdminResponse.status === 200){
                    res.render('createadmin.hbs',{alert: 'Admin successfully created !!', status: 'success' })
                }
                else{
                    res.render('createadmin.hbs',{alert: 'Error !!', status: 'danger' })
                }
            })
            .catch((error) => {
                if(error.response.data[0]) {
                    res.render('createadmin.hbs', {alert: error.response.data[0].msg, status: 'danger'})
                }
                else{
                    res.render('createadmin.hbs', {alert: error.response.data.body, status: 'danger'})
                }
            })
    }
    else{
        res.redirect('/admin/login')
    }
})

router.get('/createvendor',function (req,res) {
    if(req.session.admin){
        res.render('createvendor')
    }
    else{
        res.redirect('/admin/login')
    }
})

router.post('/createvendor',function (req,res) {
    if(req.session.admin) {
        const id = req.session.admin
        const requestObject = {
            'name': req.body.name,
            'email': req.body.email,
            'password': req.body.password,
            'phone': req.body.phone,
            'uid': id
        }
        console.log(requestObject)
        const url = 'https://auth-dhub.herokuapp.com/a/createVendor'
        axios.post(url, requestObject)
            .then((createVendorResponse) => {
                if(createVendorResponse.status === 200){
                    res.render('createvendor.hbs',{alert: 'Vendor successfully created !!', status: 'success' })
                }
                else{
                    res.render('createvendor.hbs',{alert: 'Error !!', status: 'danger' })
                }
            })
            .catch((error) => {
                if(error.response.data[0]) {
                    res.render('createvendor.hbs', {alert: error.response.data[0].msg, status: 'danger'})
                }
                else{
                    res.render('createvendor.hbs', {alert: error.response.data.body, status: 'danger'})
                }
            })
    }
    else{
        res.redirect('/admin/login')
    }
})

router.get('/logout',function (req,res) {
    if(req.session.admin){
        const requestObject = {
            uid: req.session.admin,
            refreshToken: req.session.refreshToken
        }
        const url = 'https://auth-dhub.herokuapp.com/a/logout'
        axios.post(url, requestObject)
            .then((logoutAdminResponse) => {
                    req.session.destroy()
                    res.redirect(redirect.format({
                        pathname: '/admin/login',
                        query: {
                            'alert': 'Admin logged out successfully !',
                            'alertType': 'success'
                        }
                    }))
            })
            .catch((error) => {
                res.redirect('/admin/home')
            })
    }
    else{
    }
})
module.exports = router;
