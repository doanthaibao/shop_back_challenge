const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('./controllers'));

app.listen(PORT, () => {
  console.log(`Shopback is started at PORT: ${PORT}`);
});
