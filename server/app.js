require("dotenv").config();
const Express = require("express");
const app = Express();
const dbConnection = require("./db");
// const cors = require('cors');
// app.use(require('./middleware/headers'));
// app.use(cors());

const controllers = require("./controllers");

app.use(Express.json());

app.use("/log", controllers.logController);
app.use("/user", controllers.userController);

dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {

// app.use('/test', (req, res) => {
//     res.send('This is a message from test endpont.')
// });

    app.listen(3000, () => {
        console.log(`[Server]: App is listening on 3000.`);

    });
})

.catch((err) => {
    console.log(`[Server]: Server crashed.  Error = ${err}`);
});
