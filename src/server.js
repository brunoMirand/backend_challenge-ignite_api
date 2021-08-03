const app = require('./');
const port = 3333;

app.listen(port, () => {
  console.log(`Application running in http://localhost:${port}`);
});
