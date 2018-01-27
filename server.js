const fs = require('fs');
const express = require('express');


const app = express();

app.use(express.static('public'));

app.use('/', (req, res) => {
  fs.createReadStream('./public/index.html').pipe(res);
});


const listener = app.listen(process.env.PORT, () => {
  console.log('🚀🚀 App is listening at port %s', listener.address().port);
});
