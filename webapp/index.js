const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const information = require("./apis/information/information.js");

// set default views folder
app.set('views', __dirname + "/views");
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// registra a sessão do usuário
app.use(session({
    secret: 'mysecret',
    saveUninitialized: false,
    resave: false
}));

const authRoutes = require('./apis/routes/auth.js');

app.get('/', (req, res) => {
    res.redirect('/api/auth');
});

// * Auth pages * //
app.use("/api/auth", authRoutes);

// * Info pages * //
app.get("/editInfo", information.renderEditInfo);
app.get("/editAppInfo", information.renderEditAppInfo);
app.get("/addAppInfo", information.renderAddAppInfo);
app.get("/viewAvailableData", information.renderViewAvailableData);

app.get("/getInformation", information.getInformation);
app.post("/AppInfo", information.getAppInfo);
app.get("/AppInfos", information.getAppInfos);
app.post("/updateInformation", information.updateInformation);
app.post("/addNewAppInfo", information.addNewAppInfo);
app.post("/eraseDataTo", information.eraseDataTo);
app.post("/eraseDataToAll", information.eraseDataToAll);
app.post("/setAvailableData", information.setAvailableDataTo);
app.post("/setAvailableDataToAll", information.setAvailableDataToAll);
app.post("/decodeData", information.decodeData);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
})