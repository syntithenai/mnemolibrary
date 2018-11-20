import React, { Component } from 'react';
import FaChild from 'react-icons/lib/fa/child';
import FaDatabase from 'react-icons/lib/fa/database';
import FaLanguage from 'react-icons/lib/fa/language';
import FaBalanceScale from 'react-icons/lib/fa/balance-scale';
import FaGlobe from 'react-icons/lib/fa/globe';
import FaGraduationCap from 'react-icons/lib/fa/graduation-cap';

let iconStyle={height: '1.6em'}

// ICONS FROM https://fontawesome.com/

const chalkboardIcon = <svg style={iconStyle} aria-hidden="true" data-prefix="fas" data-icon="chalkboard" class="svg-inline--fa fa-chalkboard fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M96 64h448v352h64V40c0-22.06-17.94-40-40-40H72C49.94 0 32 17.94 32 40v376h64V64zm528 384H480v-64H288v64H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h608c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z"></path></svg>

const brainIcon = 
<svg style={iconStyle}  aria-hidden="true" data-prefix="fas" data-icon="brain" class="svg-inline--fa fa-brain fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M208 0c-29.87 0-54.74 20.55-61.8 48.22-.75-.02-1.45-.22-2.2-.22-35.34 0-64 28.65-64 64 0 4.84.64 9.51 1.66 14.04C52.54 138 32 166.57 32 200c0 12.58 3.16 24.32 8.34 34.91C16.34 248.72 0 274.33 0 304c0 33.34 20.42 61.88 49.42 73.89-.9 4.57-1.42 9.28-1.42 14.11 0 39.76 32.23 72 72 72 4.12 0 8.1-.55 12.03-1.21C141.61 491.31 168.25 512 200 512c39.77 0 72-32.24 72-72V205.45c-10.91 8.98-23.98 15.45-38.36 18.39-4.97 1.02-9.64-2.82-9.64-7.89v-16.18c0-3.57 2.35-6.78 5.8-7.66 24.2-6.16 42.2-27.95 42.2-54.04V64c0-35.35-28.66-64-64-64zm368 304c0-29.67-16.34-55.28-40.34-69.09 5.17-10.59 8.34-22.33 8.34-34.91 0-33.43-20.54-62-49.66-73.96 1.02-4.53 1.66-9.2 1.66-14.04 0-35.35-28.66-64-64-64-.75 0-1.45.2-2.2.22C422.74 20.55 397.87 0 368 0c-35.34 0-64 28.65-64 64v74.07c0 26.09 17.99 47.88 42.2 54.04 3.46.88 5.8 4.09 5.8 7.66v16.18c0 5.07-4.68 8.91-9.64 7.89-14.38-2.94-27.44-9.41-38.36-18.39V440c0 39.76 32.23 72 72 72 31.75 0 58.39-20.69 67.97-49.21 3.93.67 7.91 1.21 12.03 1.21 39.77 0 72-32.24 72-72 0-4.83-.52-9.54-1.42-14.11 29-12.01 49.42-40.55 49.42-73.89z"></path></svg>

const userGraduateIcon = 
<svg  style={iconStyle} aria-hidden="true" data-prefix="fas" data-icon="user-graduate" class="svg-inline--fa fa-user-graduate fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M319.4 320.6L224 416l-95.4-95.4C57.1 323.7 0 382.2 0 454.4v9.6c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-9.6c0-72.2-57.1-130.7-128.6-133.8zM13.6 79.8l6.4 1.5v58.4c-7 4.2-12 11.5-12 20.3 0 8.4 4.6 15.4 11.1 19.7L3.5 242c-1.7 6.9 2.1 14 7.6 14h41.8c5.5 0 9.3-7.1 7.6-14l-15.6-62.3C51.4 175.4 56 168.4 56 160c0-8.8-5-16.1-12-20.3V87.1l66 15.9c-8.6 17.2-14 36.4-14 57 0 70.7 57.3 128 128 128s128-57.3 128-128c0-20.6-5.3-39.8-14-57l96.3-23.2c18.2-4.4 18.2-27.1 0-31.5l-190.4-46c-13-3.1-26.7-3.1-39.7 0L13.6 48.2c-18.1 4.4-18.1 27.2 0 31.6z"></path></svg>

const bookIcon = 
<svg  style={iconStyle} aria-hidden="true" data-prefix="fas" data-icon="book-open" class="svg-inline--fa fa-book-open fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64 2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49 69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43 30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73 87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0 62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11 218.77 46.95 10.62 5.35 23.21-1.94 23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z"></path></svg>

const userFriendsIcon = 
<svg aria-hidden="true" style={iconStyle} data-prefix="fas" data-icon="user-friends" class="svg-inline--fa fa-user-friends fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z"></path></svg>

const startOfLifeIcon = 
<svg aria-hidden="true"  style={iconStyle} data-prefix="fas" data-icon="star-of-life" class="svg-inline--fa fa-star-of-life fa-w-15" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512"><path fill="currentColor" d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z"></path></svg>

const globeIcon = 
<svg aria-hidden="true" style={iconStyle} data-prefix="fas" data-icon="globe" class="svg-inline--fa fa-globe fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg>

export default class Splash extends Component {
    

    render() {
        let iconSize=36;
        let blockStyle={minHeight:'150px',border:'2px solid white',fontSize:'1.1em',paddingTop:'0.2em',fontWeight:'bold'}
        return  (
        <div className="splash" >
            <div className="row" >
                <div style={Object.assign({color:'white',backgroundColor:'#fe0000'},blockStyle)} className="col-lg-4 col-6" >{chalkboardIcon} Beginner
                    <div>What is the largest fish?</div>
                </div>
                <div style={Object.assign({backgroundColor:'#f60'},blockStyle)}  className="col-lg-4 col-6" >{userGraduateIcon} Advanced
                <div>What is the largest fish?</div>
                </div>
                <div style={Object.assign({backgroundColor:'#fe9900'},blockStyle)}  className="col-lg-4 col-6" >{brainIcon} Genius
                <div>What is the largest fish?</div>
                </div>
                <div style={Object.assign({backgroundColor:'#fc0'},blockStyle)}  className="col-lg-4 col-6" ><FaGraduationCap size={iconSize} /> Academic 
                <div>What is the largest fish?</div>
                </div>
                <div style={Object.assign({backgroundColor:'#ff0'},blockStyle)}  className="col-lg-4 col-6" ><FaGlobe size={iconSize} />  Australian News
                <div>What is the largest fish?</div>
                </div>
                <div style={Object.assign({backgroundColor:'#98cb00'},blockStyle)}  className="col-lg-4 col-6" >{globeIcon} World News
                <div>What is the largest fish?</div>
                </div>
                <div style={Object.assign({color:'white',backgroundColor:'#090'},blockStyle)}  className="col-lg-4 col-6" ><FaLanguage size={iconSize}  /> Language
                <div>What is the largest fish?</div>
                </div>
                <div style={Object.assign({backgroundColor:'#0099cb'},blockStyle)}  className="col-lg-4 col-6" >{bookIcon} Encyclopaedia
                <div>What is the largest fish?</div>
                </div>
                <div style={Object.assign({color:'white',backgroundColor:'#0066cb'},blockStyle)}  className="col-lg-4 col-6" ><FaDatabase size={iconSize} /> Facts and Figures
                <div>What is the largest fish?</div>
                </div>
                <div style={Object.assign({color:'white',backgroundColor:'#000098'},blockStyle)}  className="col-lg-4 col-6" >{userFriendsIcon} Community
                <div>What is the largest fish?</div>
                </div>
                <div style={Object.assign({color:'white',backgroundColor:'#670099'},blockStyle)}  className="col-lg-4 col-6" ><FaBalanceScale size={iconSize} /> Law
                <div>What is the largest fish?</div>
                </div>
                <div style={Object.assign({color:'white',backgroundColor:'#cd0067'},blockStyle)}   className="col-lg-4 col-6" >{startOfLifeIcon} All
                <div>What is the largest fish?</div>
                </div>
            </div>
        </div>
    )

    }


}


