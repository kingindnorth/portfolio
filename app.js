const express = require("express")

require("dotenv").config()

const PORT = process.env.PORT || 3000

const app = express()

//serve static files
app.use(express.static("public"))

app.listen(PORT,()=>{
    console.log("server started");
    console.log(`site: http://localhost:${PORT}/`);
})