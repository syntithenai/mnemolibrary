//// LOGIN TEMPLATE
//module.exports.login =  `
            //<div class="row" >
                //<div class='col-12 warning-message'>{{warning_message}}</div>
                //<div class="col-6 card">
                    //<form method="POST" action="http://localhost:4000/oauth/token" class="form-group">
                      //<h3 class="card-title">Sign In</h3>
                      //<div class='col-12 warning-message'>{{signin_warning_message}}</div>
                
                        //<label for="email_login" class="row">Email </label><input id="email_login" type='text' name='username'  value="{{email_login}}admin" />
                        //<label for="password_login" class="row">Password </label><input id="password_login" type='text' name='password' value="admin" />
                        //<br/><br/>
                       //<button  class='btn btn-info'>Sign In</button>
                       //<input type='hidden' name='grant_type' value='password' />
                        //<input type='hidden' name='client_id' value='{{clientId}}' />
                        //<input type='hidden' name='client_secret' value='{{clientSecret}}' />
                        //<input type='hidden' name='grants' value='defaultscope' />
                    //</form>
                //</div>
                //<div class="col-6  card">
                    //<form method="POST" action="/oauth/signup" class="form-group" >
                      //<h3 class="card-title">Sign Up</h3>
                      //<div class='col-12 warning-message'>{{signup_warning_message}}</div>
                
                        //<label for="name" class='row'>Name </label><input id="name" type='text' name='name' value="{{name}}">
                        //<label for="email" class='row'>Email </label><input id="email" type='text' name='email' value="{{email}}">
                        //<label for="password" class='row'>Password</label> <input id="password" type='text' name='password' />
                        //<label for="password2" class='row'>Repeat Password</label><input id="password2" type='password' name='password2' />
                        //<br/>
                        //<br/>
                        //<button  class='btn btn-info'>Sign Up</button>
                    //</form>
                    //<br/>
                //</div>
            //</div>
            
            //`


//// LAYOUT TEMPLATE

//module.exports.layout =  `


//<!doctype html>
//<html lang="en">
  //<head>
    //<meta charset="utf-8">
    //<meta name="viewport" content="width=device-width, initial-scale=1">
    //<script
  //src="https://code.jquery.com/jquery-3.3.1.min.js"
  //integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  //crossorigin="anonymous"></script>
  
    //<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    //<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  //</head>
  //<div id="root" class="root">
    //<div class="mnemo">
    //<br/><br/>
        //<div class="container">
            //{{&content}}
        //</div>
      
  //</body>
  
//</html>
//`
////module.exports.layout =  `


////<!doctype html>
////<html lang="en">
  ////<head>
    ////<meta charset="utf-8">
    ////<meta name="viewport" content="width=device-width, initial-scale=1">
    
    ////<meta name="google-signin-client_id" content="1049709865001-vd3ddolmkf66rdo73624ocj16d6g5ueo.apps.googleusercontent.com">
    ////<script src="/res/foundation/js/vendor/jquery.js"></script>
    
    ////<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    ////<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    ////<link rel="shortcut icon" href="/res/favicon.ico">
    ////<title>Nemo Learning</title>
  ////</head>
  ////<body>
    ////<div id="root" class="root">
    ////<div class="mnemo">
    
           
        ////<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark" >
          ////<div class="navbar-brand"  style="width: 100%">
          ////<a  href="/" ><img alt="Mnemonikas" src="/res/mnemoicon.jpg" height="100%" data-toggle="collapse" data-target="#navbarCollapse"/></a>
          ////<div class='page-title'><h4>Nemos Library</h4></div>
          ////</div>
          
          
        ////</nav>
        ////<br/><br/>
        ////<div class="container">
        ////{{&content}}
        ////</div>
      ////<!--  {{name}}
        ////<a href="http://localhost:4000/">auth</a>
        ////<a href="http://localhost:4000/login">login</a>
        ////<a href="http://localhost:4000/oauth/authorize?response_type=code&client_id={{clientId}}&redirect_uri={{redirectUri}}&scope={{scope}}">authorize</a>
        ////<a href="http://localhost:4000/login">token</a>
    
    ////<h3>From Google</h3>
    ////<form>
    ////<label>Name <input type='text' name='name' ></label>
    ////<label>Email <input type='text' name='email' ></label>
    ////<button class='button'>Start Authorization</button>
    ////</form>
    
  
    
    ////<h3>Authorized</h3>
    ////<form>
    ////<label>Auth token <input type='text' name='auth_token' ></label>
    ////<button  class='button'>Get Token</button>
    ////</form>
    
    ////<h3>Login</h3>
    ////<form>
    ////<label>Email <input type='text' name='email' ></label>
    ////<label>Password <input type='text' name='password' ></label>
    ////<button class='button'>Login</button>
    ////</form>
    
    ////-->
    
    ////</div>
    ////<br/>
    ////<br/>
        ////<div class='footer'>
        ////<nav class="nav">
          ////<a class="nav-link active" target='_new' href="https://twitter.com/MnemosLibrary"><Twitter/>&nbsp;Twitter</a>
          ////<a class="nav-link" target='_new' href="https://www.facebook.com/Mnemos-Library-258728258000790"><Facebook/>&nbsp;Facebook</a>
          ////<a class="nav-link" target='_new' href="https://github.com/syntithenai/mnemolibrary"><Github/>&nbsp;Github</a>
        ////</nav>
        ////</div>
  ////</body>
  
////</html>










////`
