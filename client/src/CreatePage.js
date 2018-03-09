import React, { Component } from 'react';


export default class CreatePage extends Component {
    
    render() {

        return (
        <div>
        <form>
          <input type='text' name='interrogative'  />
          <input type='text' name='question'  />
          <input type='text' name='mnemonic'  />
          <input type='text' name='answer'  />
          <input type='text' name='link'  />
          <input type='submit'  />
        </form>
        </div>

        )
    }
};
