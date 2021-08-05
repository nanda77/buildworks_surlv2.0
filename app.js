// create an express app
const express = require("express")
const app = express()
const cors = require('cors')

app.use(cors())


// use the express-static middleware
app.use(express.static(__dirname + '/public'))//app.use(express.static("public"))

// define the first route
app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>")
})

// define the second route
app.get('/id/:param1', function(req,res){} )

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));
