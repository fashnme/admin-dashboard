const express = require('express');
const path = require('path');

var app = express();

app.use(express.static("build"));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(8000, function () {
    console.log('Started at port 8000');
});