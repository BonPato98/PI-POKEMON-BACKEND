const server = require('./src/app.js');
const { conn } = require('./src/db.js');
port = process.env.PORT || 3001

conn.sync({ alter: true }).then(() => {
  server.listen(port, () => {
    console.log(`%s listening at ${port}`); // eslint-disable-line no-console
  });
});
