/* eslint-disable */ 
import React, { Component } from 'react';
export default  class SignIn extends Component {
    render() {
       
       return  <form className="form-signin">
      <img className="mb-4" src="https://getbootstrap.com/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72" />
      <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
      <label for="inputEmail" className="sr-only">Email address</label>
      <input autocomplete='off' type="email" id="inputEmail" className="form-control" placeholder="Email address" required autofocus />
      <label for="inputPassword" className="sr-only">Password</label>
      <input  autocomplete='off' type="password" id="inputPassword" className="form-control" placeholder="Password" required />
      <div className="checkbox mb-3">
        <label>
          <input  autocomplete='off' type="checkbox" value="remember-me" /> Remember me
        </label>
      </div>
      <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <p className="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
    </form>
    };
}
