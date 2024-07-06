const express = require('express');
const session = require('express-session')
const passport = require('passport')
const path = require('path')
const app = express()
require('./auth')
app.use (express.json())
app.use(express.static(path.join(__dirname, 'client')))

function isLoggedIn(req,res,next) {
    req.user ? next() : res.sendStatus(401)
    
}

app.get('/',(req,res)=>{
    res.sendFile('index.html')
})

app.use(session({
    secret: 'maysecret',
    resave: false,
    saveUninitialized : true,
    cookie:{secure : false} //pasar a false
}))

app.use(passport.initialize())
app.use(passport.session())

// sdsdsds
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));
// dsdsd
app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure'
})); 
// dsdsd
app.get('auth/google/failure',(req,res)=> {
    res.send('Something went wrong')
})
// dsdsd
app.get('/auth/protected',isLoggedIn,(req,res)=> {
    let name = req.user.displayName;
    res.send(`Hello ${name}`)
})
// dsdsd
app.use('/auth/logout',(req,res)=> {
    req.session.destroy();
    res.send(`See you again`) // para cerrar la session y cuando entras aqui y cuando regresas a protect ya dira Unaythorized
})
app.listen(5000, () => {
    console.log('Listenening on port 5000')
})
