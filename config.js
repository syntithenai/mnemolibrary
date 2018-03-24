module.exports = {
    transport :{
      service: 'gmail',
      auth: {
        user: 'mnemoslibrary@gmail.com',
        pass: '42itmol!'
      }
    },
    googleClientId: '1049709865001-vd3ddolmkf66rdo73624ocj16d6g5ueo.apps.googleusercontent.com',
   mailFrom: 'mnemoslibrary@gmail.com',
   clientId: "application",
   clientSecret : "secret",
   authorizeUrl: "http://localhost:4000/oauth/authorize",
   tokenUrl: "http://localhost:4000/oauth/token",
   successUrl: "http://localhost/",
   scope: "profile email",
   database: 'oauth',
   databaseConnection: 'mongodb://mongo:27017/',
   port: '4000',
   masterSpreadsheet:'https://docs.google.com/spreadsheets/d/e/2PACX-1vTz3rAzVov3GQqn-9Yb_4wFxjLymAbN5xWqGk5Cl_F80StXCTV1N9hJEoocSg51h13DDXvKp9ukiBIK/pub?gid=876915125&single=true&output=csv'
}
