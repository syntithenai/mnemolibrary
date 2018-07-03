
import React, { Component } from 'react';

export default class HomeCarousel extends Component {
  
    constructor(props) {
      super(props);
      this.state = { width: 0, height: 0 };
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
      console.log(['CH',this.state.width]);
        
    }
  
    
    render() {
        let h = this.state.width;
        let content=(<div>
          <ol class="carousel-indicators">
    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
  </ol>
  <div class="carousel-inner">
    <div class="carousel-item active">
        <div class="carousel-caption d-none d-md-block">
            <h5>Discover</h5>
            <p>curated topics graded from beginner to sage.</p>
        </div>
         <img class="d-block w-100" src="/help/discover.jpg" alt="Discover" />
     
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src="/help/search.jpg" alt="Search" />
      <div class="carousel-caption d-none d-md-block" >
            <h5>Search</h5>
            <p> content by topic, tag, or keyword.</p>
        </div>
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src="/help/review.jpg" alt="Review" />
      <div class="carousel-caption d-none d-md-block" >
            <h5>Review</h5>
            <p>questions in the spare moments of your day.</p>
        </div>
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src="/help/profile.jpg" alt="Profile" />
      <div class="carousel-caption d-none d-md-block">
            <h5>Profile</h5>
            <p>to monitor your progress.</p>
        </div>
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src="/help/create.jpg" alt="Create" />
      <div class="carousel-caption d-none d-md-block">
            <h5>Create</h5>
            <p>your own questions and topics.</p>
        </div>
    </div>
        <div class="carousel-item">
      <img class="d-block w-100" src="/help/alexachat.png" alt="Alexa" />
      <div class="carousel-caption d-none d-md-block" style={{top: '1em',left:'5em',height:'4em'}}>
            <h5>Chat with Alexa</h5>
        </div>
    </div>

  </div>
  <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true" ></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>

        </div>)
        
        if (h > 800) {
            return  (
            <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel" style={{width:'50%',paddingTop:'4%',paddingBottom:'4%',paddingLeft:'4%',paddingRight:'4%',marginLeft:'1%',marginRight:'1%',backgroundColor: 'lightgrey'}}>{content}
            </div>
            )            
        } else {
             return  (
            <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel" style={{width:'90%',paddingTop:'4%',paddingBottom:'4%',paddingLeft:'4%',paddingRight:'4%',marginLeft:'1%',marginRight:'1%',backgroundColor: 'lightgrey'}}>{content}
            </div>
)           
        }
}}
