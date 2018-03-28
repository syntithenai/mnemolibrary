module.exports = {
    // email
    transport :{
      service: 'gmail',
      auth: {
        user: 'mnemoslibrary@gmail.com',
        pass: '42itmol!'
      }
    },
   mailFrom: 'mnemoslibrary@gmail.com',
   // oauth
   clientId: "application",
   clientSecret : "secret",
   authorizeUrl: "http://localhost:4000/oauth/authorize",
   tokenUrl: "http://localhost:4000/oauth/token",
   successUrl: "http://localhost/",
   scope: "profile email",
   
   // database
   database: 'mnemo',
   databaseConnection: 'mongodb://mongo:27017/',
   // expose public api
   port: '4000',
   // google login
   googleClientId: '1049709865001-vd3ddolmkf66rdo73624ocj16d6g5ueo.apps.googleusercontent.com',
   // admin sheet import
   //masterSpreadsheet:'https://docs.google.com/spreadsheets/d/e/2PACX-1vTz3rAzVov3GQqn-9Yb_4wFxjLymAbN5xWqGk5Cl_F80StXCTV1N9hJEoocSg51h13DDXvKp9ukiBIK/pub?gid=273340787&single=true&output=csv'
   masterSpreadsheet:'https://docs.google.com/spreadsheets/d/e/2PACX-1vTz3rAzVov3GQqn-9Yb_4wFxjLymAbN5xWqGk5Cl_F80StXCTV1N9hJEoocSg51h13DDXvKp9ukiBIK/pub?gid=876915125&single=true&output=csv'
   //'https://docs.google.com/spreadsheets/d/e/2PACX-1vTz3rAzVov3GQqn-9Yb_4wFxjLymAbN5xWqGk5Cl_F80StXCTV1N9hJEoocSg51h13DDXvKp9ukiBIK/pub?gid=273340787&single=true&output=csv'
}
//
