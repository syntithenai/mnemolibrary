/* global gapi */
import React, { Component } from 'react';
import Google from 'react-icons/lib/fa/google';

export default class GoogleLogin extends Component {
   constructor(props) {
        super(props);
        
        this.loggedIn = false;
        this.accessToken = '';
        //this.apiKey = 'AIzaSyCe01AFr01CUf3g82kAlJhC126j_AF7l2A';
        //this.apiKey = 'AIzaSyCe01AFr01CUf3g82kAlJhC126j_AF7l2A';
	//mnemolibrary-1517864563209
    //mnemoslibrary@gmail.com
    //1049709865001-vd3ddolmkf66rdo73624ocj16d6g5ueo.apps.googleusercontent.com

        this.GoogleAuth = null; // Google Auth object.
        this.accessTokenExpires = 0;
        this.requiredScope = 'profile email'; //requireExtraScope('https://www.googleapis.com/auth/drive.file
        this.pickerApiLoaded = false;
        this.authApiLoaded = false;
        this.lastLoggedIn = 0;
        
        
        this.requireExtraScope = this.requireExtraScope.bind(this);
        this.renewAccessToken = this.renewAccessToken.bind(this);
        this.isAccessTokenExpired = this.isAccessTokenExpired.bind(this);
        this.renderSignIn = this.renderSignIn.bind(this);
        this.handleAuthClick = this.handleAuthClick.bind(this);
        this.stashGoogleAuth = this.stashGoogleAuth.bind(this);
        this.loginToWebsite = this.loginToWebsite.bind(this);
        this.googleSignOut = this.googleSignOut.bind(this);
        this.updateSigninStatus = this.updateSigninStatus.bind(this);
        this.createPicker = this.createPicker.bind(this);
        this.onPickerApiLoad = this.onPickerApiLoad.bind(this);
        this.pickerCallback = this.pickerCallback.bind(this);
        this.handleFailure = this.handleFailure.bind(this);
        
    };
    
    render() {
        return <div id="google-signin"><Google/></div>
    };

    componentDidMount() {
       const script = document.createElement("script");
        script.src = "https://apis.google.com/js/platform.js";
        script.onload = () => {
          gapi.load('client', () => {
            gapi.client.setApiKey(this.props.clientId);
            gapi.load('client:auth2', this.renderSignIn);
            window.gapi = gapi;
            //gapi.load('picker', {'callback': onPickerApiLoad});
            //gapi.client.load('client:auth2', 'v3', () => {
              //this.setState({ gapiReady: true });
            //});
          });
        };

        document.body.appendChild(script);
    }
    
    handleFailure() {
        console.log('FAIL LOGIN');
        this.googleSignOut();
    };
    
	renderSignIn() {
        //console.log('redner signin');
		gapi.signin2.render('google-signin', {
			'scope': 'profile email',// https://www.googleapis.com/auth/drive.file',
            'width': 200,
			'height': 30,
			'longtitle': true,
			'theme': 'dark',
			'onsuccess': this.handleAuthClick,
             'onfailure': this.handleFailure
		});
	}

	handleAuthClick() {
		//console.log('handle auth click');
        this.authApiLoaded = true;
		this.GoogleAuth = gapi.auth2.getAuthInstance();
		this.GoogleAuth.isSignedIn.listen(this.updateSigninStatus);
		this.updateSigninStatus();
	}
    
    updateSigninStatus() {
		//console.log('update signin status');
		var user = this.GoogleAuth.currentUser.get();
		//$scope.$apply(function() {
			if (user) {
			//	console.log(['update signin status have user reuire scope -',this.requiredScope]);
				this.loggedIn = user.hasGrantedScopes(this.requiredScope);
				if (this.loggedIn) {
				//	console.log('update signin status do loging',user);
					this.loginToWebsite().then(function(user) {
						////$rootScope.$broadcast('sessionId',sessionId);
                  //      console.log('LOGGED IN',user);
                        //this.props.login();
					});
				}
			} else {
				//console.log(['update signin NOT LOGGED IN']);
				this.loggedIn = false;
			}
		//});
	}
	
	stashGoogleAuth(token) {
		this.accessToken = token;
		//$rootScope.$broadcast('accesstoken',token);
	}
	
	loginToWebsite(token) {
        //console.log(['login to website',token]);
		let p = new Promise((resolve, reject) => {
            //var now = new Date().getTime();
            // limit refresh to once per minute
            //if (this.lastLoggedIn > 0 && (now - this.lastLoggedIn) < 60000) {
                //stashGoogleAuth();
                var googleUser = this.GoogleAuth.currentUser.get();
          //      console.log(['do LOGINTWEB',googleUser]);
                // gather user info and post to website
                if (googleUser  && googleUser['Zi'] && googleUser['Zi']['access_token']) {
                    this.accessTokenExpires = (new Date().getTime() / 1000) + parseInt(googleUser['Zi']['expires_in'],10);
                    //this.stashGoogleAuth(googleUser['Zi']['access_token']);
                    //// Successfully authorized, create session
                    //var xhr = new XMLHttpRequest();
                    //xhr.open('POST','/login');
                    //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    var id_token = googleUser.getAuthResponse().id_token;
                    ////console.log('ALL DONE YAY  ' + id_token);
                    //xhr.onload = function() {
                        //console.log(['ALL DONE YAY  ',xhr.response]);
                        //this.lastLoggedIn = new Date().getTime();
                        ////if (xhr.responseText=="OK" || xhr.responseText=="NEW") {
                            //var thisUser = JSON.parse(xhr.response);
                            ////$rootScope.$broadcast('user:login',thisUser)
                            ////var sessionId='';
                            //if (thisUser.session_id && thisUser.session_id.length > 0) {
                                //resolve(thisUser.session_id);
                            //} else {
                                //resolve('');
                            //}
                            
                            ////$scope.$apply(function() {
                                ////
                                //// default view on load
                                ////$scope.currentView='home'; 
                            ////});
                        ////} else  {
                            ////console.log('oauth fail');  
                        ////}
                    //};
                    var profile = googleUser.getBasicProfile();
                    //xhr.send('idtoken=' + id_token + '&name=' + profile.getName() +  '&image=' + profile.getImageUrl() + '&email=' + profile.getEmail() );  // 
                    //console.log(['LW started']);
                    var props = {idtoken:id_token,name:profile.getName(),image:profile.getImageUrl() ,email: profile.getEmail() };
             //       console.log(['g login success',props]);
                    this.props.onSuccess(props);
                        
                }
            //} else {
                //d.resolve();
            //}
        });
		return p;
	}
	





    
    
    requireExtraScope(extraScope) {
		let p = new Promise((resolve, reject) => {
           // console.log(['GAUTH',extraScope,this.GoogleAuth]);
            var googleUser =  this.GoogleAuth.currentUser.get();
            if (googleUser) {
                window.timeout(function() {
                    if (!googleUser.hasGrantedScopes(extraScope)) {
                        googleUser.grant({'scope' : extraScope,'ux_mode':'popup'}).then(function(resp) {
             //               console.log(['granted',resp]);
                            resolve(resp.Zi);
                        });
                    } else {
                        resolve(googleUser['Zi']);
                    }
                });
            } else {
                reject();
            }
        });
        return p;
	}

	isAccessTokenExpired() {
		var now = new Date().getTime() / 1000;
		//console.log(['ATR ?',this.accessTokenExpires,now]);
		return (now > this.accessTokenExpires) ? true : false;
	}
	
	renewAccessToken()  {
		//console.log(['renew access token']);
		let p = new Promise((resolve, reject) => {
            if (this.authApiLoaded) {
          //      console.log(['renew auth api loaded']);
                this.GoogleAuth = gapi.auth2.getAuthInstance();
                if (this.isAccessTokenExpired()) {
         //           console.log(['tken is expired']);
                    var googleUser =  this.GoogleAuth.currentUser.get();
                    if (googleUser) {
           //             console.log(['have user',googleUser]);
                        googleUser.reloadAuthResponse().then(function(auth) {
             //               console.log(['reladed access token now logintoweb',auth]);
                            this.loginToWebsite().then(function() {
                                this.stashGoogleAuth(googleUser['Zi']['access_token']);
                                resolve(googleUser['Zi']['access_token']);
                            });
                        });
                    } else {
               //         console.log(['renew update signin']);
                        this.updateSigninStatus();
                        resolve('NOTOKEN');
                    }
                } else {
                 //   console.log(['use current token',this.accessToken]);
                    //loginToWebsite().then(function() {
                        resolve(this.accessToken);
                    //});
                }
            }
        });
		return p;
	}
	
	

	//'client_id': 'mnemolibrary-1517864563209',
			


	// triggered by soundmanager on fail to download
	// fire reload
	//var tokenException = function() {
		//var googleUser =  GoogleAuth.isSignedIn.get();
		//if (googleUser) {
			//googleUser.reloadAuthResponse().then(function(auth) {
				//loginToWebsite();
			//});
		//} else {
			//updateSigninStatus();
		//}
	//}
	
	googleSignOut() {
	//	console.log('sign ut');
		if (this.GoogleAuth) this.GoogleAuth.disconnect();
	}
	


	onPickerApiLoad() {
	//	console.log('picker api loaded');
        this.pickerApiLoaded = true;
      }


    // Create and render a Picker object for picking user songs.
    createPicker() {
		//renewAccessToken().then(function(accessToken) {
			//console.log(['create picker',pickerApiLoaded,accessToken]);
			//if (pickerApiLoaded) {
				//console.log('really create picker');
				//var view = new google.picker.View(google.picker.ViewId.DOCS);
				//view.setMimeTypes("audio/mp3,audio/mpeg");
				//var picker = new google.picker.PickerBuilder()
				//.enableFeature(google.picker.Feature.NAV_HIDDEN)
				//.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
				////.setAppId(appId)
				//.setOAuthToken(accessToken)
				//.addView(view)
				//.addView(new google.picker.DocsUploadView())
				//.setDeveloperKey(apiKey)
				//.setCallback(pickerCallback)
				//.build();
				//picker.setVisible(true);
			  //} 
			//});
		}

// GPICKER
	pickerCallback(data) {
	//	console.log(['picker callback']);
		//if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
			//for (key in data[google.picker.Response.DOCUMENTS]) {
				//var doc = JSON.parse(JSON.stringify(data[google.picker.Response.DOCUMENTS][key]));
				//console.log(['DD',document]);
				//var addToQueue = function(document) {
					//renewAccessToken().then(function(accessToken1) {
						//requireExtraScope('https://www.googleapis.com/auth/drive.file').then(function(token2) {
							//$rootScope.$broadcast('accesstoken',token2.access_token);
							//var accessToken = token2.access_token;
						
							//var waitingKey = Math.random().toString(36).substr(2, 7);
							//$rootScope.$broadcast('waiting:start',['Open file from google drive  ',waitingKey]);
							////$rootScope.$broadcast('action:pending');
							//console.log(['DD2',document]);
							
							//var url = "https://www.googleapis.com/drive/v3/files/"+document.id +"?access_token=" + accessToken;
							//console.log(['picker doc',url,document]);
							//var xhr = new XMLHttpRequest();
							//xhr.responseType = 'blob';
							//xhr.open('GET', url, true);
							//xhr.onload = function(e) {
								//console.log(['picker doc loaded',this,e,document]);
								//if (this.status == 200) {
									//var blob = this.response;
									//var name= document.name;
									//var file = new File([blob], name, {type: 'audio/mp3'});
									//$rootScope.uploader.addToQueue([file],{'googleDriveId': document.id});//
									//$rootScope.$broadcast('waiting:delete',waitingKey);
									////$rootScope.$broadcast('action:complete');
								//}
							//}
							//xhr.send();
						//});
					//});
				//}
				//addToQueue(doc);
			//}
		//}
	}

}
