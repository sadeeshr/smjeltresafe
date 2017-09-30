import React, { Component } from 'react';
import { Label, Button, Image, Tooltip, Grid, Row, Col, Panel} from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state= {
      app     : '',
      user    : {
        avatar : "picture.png",
        firstname : 'Sadeesh',
        middlename : 'Radha',
        lastname : 'Krishnan',
        street: '9F',
        nr: 'Davinci',
        ext : 'Palazzo',
        zip : '1110',
        town : 'Eastwood'
      },
      title : '',
      submittxt : '',
      hideitem  : true,
      hideitem2 : true,
      deleteB : true,
      goPackages : false
    };
  }

  goPackages() {
    this.setState({goPackages : true})
  }

  render() {
    if (this.state.goPackages) {
      return <Redirect to="/packages" />;
    } else {
      return (
        <div>
        <div className="login-container">
        <div className="login-banner"></div>

          <div className="main">

            <div className="topbarbg">


            </div>

            <div className="inner">
          <div className="content_container">
            <div className="greybg"> </div>
            <h1 className="bodytitle">{this.state.user.firstname} ! {this.state.title} <br/></h1>

            <div className="upload_picture">
              <label htmlFor="file-input">
                <img src={this.state.user.avatar} />
              </label>
              <input className="img_upload" id="file-input" type="file" />
            </div>

           <div  className="form-body" style={{marginBottom :'50px'}}>
           <div  className="row">
           <Panel bsStyle="warning">
             <div className="page4form">
               <div className="form-group form-md-line-input page4" style={{float:'left', width:'32%', marginRight:'8px'}}>
                 <label id="firstname" className="form-control" placeholder="First Name">{this.state.user.firstname}</label>
               </div>

               <div className="form-group form-md-line-input page4" style={{float:'left', width:'32%', marginRight:'8px'}}>
                 <label id="middlename" className="form-control" placeholder="Middle Name">{this.state.user.middlename}</label>
               </div>

               <div className="form-group form-md-line-input page4" style={{float:'left', width:'32%'}}>
                 <label id="lastname" className="form-control" placeholder="Last Name">{this.state.user.lastname}</label>
               </div>

             </div>
             <div className="page4form">
             <div className="form-group form-md-line-input page4" style={{float:'left', width:'45%', marginRight:'8px'}}>
               <label id="street" className="form-control" placeholder="Street">{this.state.user.street}</label>

             </div>

             <div className="form-group form-md-line-input page4" style={{float:'left', width:'25%', marginRight:'8px'}}>
               <label id="nr" className="form-control" placeholder="NR">{this.state.user.nr}</label>
             </div>

             <div className="form-group form-md-line-input page4" style={{float:'left', width:'25%'}}>
               <label id="ext" className="form-control" placeholder="EXT">{this.state.user.ext}</label>
             </div>

           </div>


           <div className="page4form">
             <div className="form-group form-md-line-input page4" style={{float:'left', width:'48%', marginRight:'8px'}}>
               <label id="zip" className="form-control" placeholder="ZIP Code">{this.state.user.zip}</label>

             </div>

             <div className="form-group form-md-line-input page4" style={{float:'left', width:'48%'}}>
               <label id="town"  className="form-control" placeholder="Town">{this.state.user.town}</label>
             </div>

           </div>
           </Panel>
           <Link to="/packages">Packages</Link>
           <Button bsStyle="success" className="btn mainbtn" onClick={this.goPackages.bind(this)}>Select Package</Button>
           <br /> <br />
          </div>
          </div>

        </div>
        </div>

              </div>
              </div>
              </div>
      );
    }

  }
}

export default Home;
