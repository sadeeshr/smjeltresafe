import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
// import car from '../car.png';

class Packages extends Component {


  render() {
    return (
      <div>
      <div className="content_container">
                <h1 className="bodytitle">Choose Configuration <br />
                </h1>

                <div className="configcont">

                  <div className="form-group">

                      <div className="select">
                      <select name="slct" id="slct">
                        <option>Package A</option>
                        <option value="1">Package B</option>
                        <option value="2">Package C</option>
                        <option value="3">Package D</option>
                      </select>
                      </div>

                  </div>


                    <div className="price page5">
                  <h1> > Price: 40.000 Euro </h1>
                  </div>

                  <div className="packageimg">

                    <img src={require('../car.png')}/>

                  </div>


                </div>
                <button className="btn mainbtn">Choose</button>

                <div className="moreinfo">
                  <a href="#"> More Information </a>
                </div>
                <Link to="/home">Back</Link>
              </div>
      </div>
    );
  }
}

export default Packages;
