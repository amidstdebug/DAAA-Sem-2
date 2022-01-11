let app = require('./controller/router.js')

let port = 8081

let hostname = 'localhost'

let server = app.listen(port, hostname, ()=>{
    console.log(`Web App Hosted at http://${hostname}:${port}/api/user/1`)
})