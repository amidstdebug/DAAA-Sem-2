let app = require('./controller/app.js')

let port = 8001

let hostname = 'localhost'

let server = app.listen(port, hostname, ()=>{
    console.log(`Web App Hosted at http://${hostname}:${port}`)
})