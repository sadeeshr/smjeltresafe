// import React from 'react';
// import { render } from 'react-dom';

import React, { Component } from 'react';
import safeApp from 'safe-app';
import { remote, ipcRenderer as ipc } from 'electron';
import CONSTANTS from '../safenetwork/constants';
import keytar from 'keytar';
import { Label, Button, Image, Tooltip, Grid, Row, Col} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import { store } from '../index';
// import { saveSafeApp } from '../actions'

class Smj extends Component {

  // app;

  constructor(props) {
    super(props);
    this.state= {
      app     : '',
      user    : {
        avatar : "picture.png",
        firstname : '',
        middlename : '',
        lastname : '',
        street: '',
        nr: '',
        ext : '',
        zip : '',
        town : ''
      },
      title : '',
      submittxt : '',
      hideitem  : false,
      hideitem2 : false,
      deleteB : true
    };

    ipc.on('auth-response', this.Connect.bind(this));
    // this.authorise();
  }


  componentWillMount() {
    console.log("components mounted");
    var that = this;
    setTimeout(function() {
      that.forceUpdate();
    }, 1000);
    setTimeout(function() {
      that.forceUpdate();
    }, 3000);
  }

  authorise() {
    keytar.getPassword('authuri', 'smartjuice')
      .then((res) => {
        if(res) {
          this.setState({
            title : "Welcome to Smartjuice",
            submittxt : "UPDATE",
            deleteB : true
          });
          console.log('URI from storage: ', res);
          safeApp.fromAuthURI(CONSTANTS.APP_INFO.data, res)
          .then((app) => {
            console.log(app);
            this.setState ( { app : app });
            this.fetchUserProfile();
            // this.app = app;
          })
          .catch(
            (err) => {
              console.log(err);
            }
          );
        } else {
          this.setState({
            title : "Set Your Profile Details",
            submittxt : "REGISTER",
            deleteB : true
          });
          safeApp.initializeApp(CONSTANTS.APP_INFO.data)
          .then(app => app.auth.genAuthUri(CONSTANTS.APP_INFO.permissions, CONSTANTS.APP_INFO.opt)
          .then(uri => {
            app.auth.openUri(uri)
          }));
        }
      })
      .catch(
        (err) => {
          console.log(err);
        }
      );
  }

  Connect(event, response) {
    keytar.setPassword('authuri', 'smartjuice', response);
    console.log('Store URI to storage: ', response);
    // console.log('Click On Get App button.');
    this.setState({
      title : "Set Your Profile Details",
      submittxt : "REGISTER",
      deleteB : true
    });
    this.getUri();
  }

  fetchUserProfile() {
  let user = {};
  this.state.app.auth.refreshContainersPermissions().then(() =>
    this.state.app.auth.getOwnContainer()
      .then((md) => md.getEntries()
        .then((entries) => {
          console.log(entries);
          entries.forEach((key, value) => {
              // console.log('File found: ', this.uintToString(key));
              // console.log('File found: ', this.uintToString(value.buf));
              user[this.uintToString(key)] = this.uintToString(value.buf);
              })
              console.log(user);
              this.setState({user : user, hideitem: true});
              this.forceUpdate();
        })
      ));

  }

  getUri() {
    keytar.getPassword('authuri', 'smartjuice')
    .then((res) => {
      if(res) {
        console.log('URI from storage: ', res);
        // console.log('Check permissions on safe network.');

        safeApp.fromAuthURI(CONSTANTS.APP_INFO.data, res)
        .then((app) => {
          console.log(app);
          // this.setState ({ app: app});
          this.props.saveSafeApp(app);
          // store.dispatch(saveSafeApp(app));
          // this.fetchUserProfile();
        })
        .catch(
          (err) => {
            console.log(err);
          }
        );
      }
    })
    .catch(
      (err) => {
        console.log(err);
      }
    );
  }

  deleteUri() {
    keytar.deletePassword('authuri', 'smartjuice');
    console.log('Deleted Stored Auth URI.');
    console.log('Restart App, to get authorized again');
  }

  canAccessContainers() {
    if (!this.state.app) {
      console.log('Application is not connected.');
    }
    else {
//      return this.app.auth.canAccessContainer('_public')
      return this.state.app.auth.getContainer('_public')
        .then((res) => {
          console.log(res);
        });
    }
  }

  uintToString(uintArray) {
    return new TextDecoder("utf-8").decode(uintArray);
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    this.props.checkAccessContainer();
    if(this.state.submittxt == "REGISTER") {

      this.props.saveUserInfo(this.state.user);
      // this.state.app.auth.refreshContainersPermissions().then(() =>
      // this.state.app.auth.getOwnContainer()
      //   .then((md) => md.getEntries()
      //     .then((entries) => entries.mutate()
      //       .then((mut) => {
      //         mut.insert('firstname', this.state.user.firstname)
      //           .then(() => mut.insert('middlename', this.state.user.middlename)
      //             .then(() => mut.insert('lastname', this.state.user.lastname)
      //               .then(() => mut.insert('street', this.state.user.street)
      //                 .then(() => mut.insert('nr', this.state.user.nr)
      //                 .then(() => mut.insert('ext', this.state.user.ext)
      //                   .then(() => mut.insert('zip', this.state.user.zip)
      //                     .then(() => mut.insert('town', this.state.user.town)
      //                       .then(() => mut.insert('avatar', this.state.user.avatar)
      //                         .then(() => md.applyEntriesMutation(mut))
      //                       )
      //                     )
      //                   )
      //                 )
      //               )
      //             )
      //           )
      //         )
      //       }
      //       )

      //       )
      //     ))
      //   .then(() => this.state.app.auth.getOwnContainer())
      //     .then((md) => md.get('middlename'))
      //     .then((value) => {
      //       console.log(value.buf.toString());
      //       // alert("Thank You. You are Registered.");
      //       this.setState({title : "Welcome to Smartjuice", hideitem: true});
      //       this.goHomeScreen();
      //     })


      // const metaName = `Services container for: smartjuice`;
      // const metaDesc = `Container where all the services are mapped`;

      // return this.state.app.crypto.sha3Hash(CONSTANTS.APP_INFO.data.name)
      // .then((hashedName) => this.state.app.mutableData.newPublic(hashedName, CONSTANTS.TAG_TYPE.DNS))
      // .then((md) => {
      //   return md.quickSetup({}, metaName, metaDesc)
      //     .then(() => md.getNameAndTag())
      //     .then((mdMeta) => this.getPublicNamesContainer()
      //       .then((pubMd) => this._insertToMData(pubMd, name, mdMeta.name)));
      // });


      // return this.state.app.auth.refreshContainersPermissions()
      //   .then(() => this.state.app.auth.getOwnContainer()
      //     .then((mData) => mData.quickSetup(this.state.user))
      //   )
      //   .then(() => this.state.app.auth.getOwnContainer())
      //   .then((md) => md.get('ext'))
      //   .then((value) => {
      //     console.log(value.buf.toString());
      //   })

      // return this.state.app.crypto.sha3Hash(CONSTANTS.APP_INFO.data.name)
      // .then((res) => {
      //   console.log(res);
      //   this.state.app.mutableData.newPublic(res,15002)
      //     .then((md) => md.quickSetup(this.state.user)
      //       .then((md2) => md2.serialise()
      //         .then((ser) => console.log(ser))
      //         .then(() => md2.get('firstname').then((val) => {console.log('value is: '+ val.buf.ToString())}))
      //       )
      //     )
      //   })

          // .then((m) => m.insert('middlename', this.state.user.middlename))
            // .then((m) => m.insert('lastname', this.state.user.lastname))
            // .then((m) => m.insert('street', this.state.user.street))
            // .then((m) => m.insert('nr', this.state.user.nr))
            // .then((m) => m.insert('ext', this.state.user.ext))
            // .then((m) => m.insert('zip', this.state.user.zip))
            // .then((m) => m.insert('town', this.state.user.town))

    //   .then((md) => md.quickSetup(this.state.user)
    //   .then((md2) => md2.getEntries()
    //     .then((entries) => {
    //       console.log(entries);
    //       // entries.forEach((key, value) => {
    //       //     console.log('File found: ', this.uintToString(key));
    //       //     console.log('File found: ', this.uintToString(value.buf));
    //       //     })
    //       md.applyentries
    //     })
    //   )
    // )
    //   .then((mut) => mut.insert(keyToInsert, valToInsert)
    //   .then(() => md.applyEntriesMutation(mut))
    // )
    } else {
      // return this.state.app.crypto.sha3Hash(CONSTANTS.APP_INFO.data.name)
      // .then((res) => {
      //   console.log(res);
      //   // this.state.app.mutableData.newPublic(res,15002)
      //   this.state.app.auth.getContainer(CONSTANTS.ACCESS_CONTAINERS.PUBLIC_NAMES)
      //     .then((mData) => mData.getEntries()
      //       .then((entries) => {
      //         entries.forEach((key, value) => {
      //             console.log('File found: ', this.uintToString(key));
      //             console.log('File found: ', this.uintToString(value.buf));
      //             })
      //       })
      //     )
      //   }
      // )

      return this.state.app.auth.refreshContainersPermissions().then(() =>
      this.state.app.auth.getOwnContainer()
        .then((md) => md.getEntries()
          .then((entries) => {
            console.log(entries);
            entries.forEach((key, value) => {
                console.log('File found: ', this.uintToString(key));
                console.log('File found: ', this.uintToString(value.buf));
                })
          })
        ))

    }
  }

  goHomeScreen() {
    var hide2 = !this.state.hideitem2;
    this.setState({
      hideitem2 : hide2
    })
  }

  handleInputChange(e) {
    // console.log(e.target.value);
    const userstate = this.state.user;
    const key = e.target.id;
    const value = e.target.value;
    userstate[key] = value;
    this.setState({
      user : userstate
    });
    console.log(this.state);
  }

  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      const userstate = this.state.user;
      userstate["avatar"] = reader.result;
      this.setState({
        user : userstate
      });
    }

    reader.readAsDataURL(file)
  }

  clearRegEntries(){
    this.setState({
      user  : {
        firstname : "New User",
        middlename : "",
        lastname : "",
        street: "",
        nr: "",
        ext : "",
        zip : "",
        town : ""
      }
    });
  }

  render() {

    console.log('Props: ', this.props);
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
            <input className="img_upload" id="file-input" type="file" onChange={this.handleImageChange.bind(this)}/>
          </div>
          <div hidden={this.state.hideitem} className="form-body" styles={{marginBottom :'50px'}}>
          <div className="row">
            <div className="page4form">
              <div className="form-group form-md-line-input page4" styles={{float:'left', width:'32%', marginRight:'8px'}}>
                <input id="firstname" onChange={this.handleInputChange.bind(this)} value={this.state.user.firstname} type="text" className="form-control" placeholder="First Name" />

              </div>

              <div className="form-group form-md-line-input page4" styles={{float:'left', width:'32%', marginRight:'8px'}}>
                <input id="middlename" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.middlename} className="form-control" placeholder="Middle Name" />
              </div>

              <div className="form-group form-md-line-input page4" styles={{float:'left', width:'32%'}}>
                <input id="lastname" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.lastname} className="form-control" placeholder="Last Name" />
              </div>

            </div>
            <div className="page4form">
            <div className="form-group form-md-line-input page4" styles={{float:'left', width:'45%', marginRight:'8px'}}>
              <input id="street" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.street} className="form-control" placeholder="Street" />

            </div>

            <div className="form-group form-md-line-input page4" styles={{float:'left', width:'25%', marginRight:'8px'}}>
              <input id="nr" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.nr} className="form-control" placeholder="NR" />
            </div>

            <div className="form-group form-md-line-input page4" styles={{float:'left', width:'25%'}}>
              <input id="ext" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.ext} className="form-control" placeholder="EXT" />
            </div>

          </div>


          <div className="page4form">
            <div className="form-group form-md-line-input page4" styles={{float:'left', width:'48%', marginRight:'8px'}}>
              <input id="zip" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.zip} className="form-control" placeholder="ZIP Code" />

            </div>

            <div className="form-group form-md-line-input page4" styles={{float:'left', width:'48%'}}>
              <input id="town" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.town} className="form-control" placeholder="Town" />
            </div>

          </div>

         </div>
         </div>
         <div hidden={!this.state.hideitem} className="form-body" styles={{marginBottom :'50px'}}>
         <div hidden={this.state.hideitem2} className="row">
           <div className="page4form">
             <div className="form-group form-md-line-input page4" styles={{float:'left', width:'32%', marginRight:'8px'}}>
               <label id="firstname" className="form-control" placeholder="First Name">{this.state.user.firstname}</label>
             </div>

             <div className="form-group form-md-line-input page4" styles={{float:'left', width:'32%', marginRight:'8px'}}>
               <label id="middlename" className="form-control" placeholder="Middle Name">{this.state.user.middlename}</label>
             </div>

             <div className="form-group form-md-line-input page4" styles={{float:'left', width:'32%'}}>
               <label id="lastname" className="form-control" placeholder="Last Name">{this.state.user.lastname}</label>
             </div>

           </div>
           <div className="page4form">
           <div className="form-group form-md-line-input page4" styles={{float:'left', width:'45%', marginRight:'8px'}}>
             <label id="street" className="form-control" placeholder="Street">{this.state.user.street}</label>

           </div>

           <div className="form-group form-md-line-input page4" styles={{float:'left', width:'25%', marginRight:'8px'}}>
             <label id="nr" className="form-control" placeholder="NR">{this.state.user.nr}</label>
           </div>

           <div className="form-group form-md-line-input page4" styles={{float:'left', width:'25%'}}>
             <label id="ext" className="form-control" placeholder="EXT">{this.state.user.ext}</label>
           </div>

         </div>


         <div className="page4form">
           <div className="form-group form-md-line-input page4" styles={{float:'left', width:'48%', marginRight:'8px'}}>
             <label id="zip" className="form-control" placeholder="ZIP Code">{this.state.user.zip}</label>

           </div>

           <div className="form-group form-md-line-input page4" styles={{float:'left', width:'48%'}}>
             <label id="town"  className="form-control" placeholder="Town">{this.state.user.town}</label>
           </div>

         </div>
         <Button onClick={this.goHomeScreen.bind(this)} bsStyle="success" className="btn mainbtn">Select Package</Button>
         <br /> <br />
        </div>
        </div>
        <div hidden={!this.state.hideitem2} className="content_container">


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

              <img src="car.png" />

            </div>


          </div>



          <button className="btn mainbtn">Choose</button>

          <div className="moreinfo">
            <a href="#"> More Information </a>
          </div>

        </div>

        <div hidden={this.state.hideitem}>
         <Button className="btn greybtn" bsStyle="info" active>Main Driver</Button> <Button bsStyle="info" className="btn greybtn">Investor</Button>
         <br /> <br />
         <Button onClick={this.handleSubmit.bind(this)} bsStyle="success" className="btn mainbtn">{this.state.submittxt}</Button>
<br /><br />
</div>
 <Button disabled={this.state.hideitem} bsStyle="warning" bsSize="xsmall" onClick={this.clearRegEntries.bind(this)}>Reset</Button>  <Button bsStyle="danger" onClick={this.deleteUri.bind(this)} bsSize="xsmall">Delete Key</Button>

        </div>

      </div>
      </div>
      </div>
      </div>
    );
  }
}

      // 1. Get APP object:  <button type="primary" onClick={this.getUri.bind(this)}>Get</button>
      // <br/>
      // 2. Permissions for _public container:  <button type="primary" onClick={this.canAccessContainers.bind(this)}>Check</button>
      // <br/>
      // 3. Delete safe URI stored: <button type="primary" onClick={this.deleteUri.bind(this)}>Delete</button>

      // <Button bsStyle="info" bsSize="xsmall" onClick={this.forceUpdate.bind(this)}>Refresh</Button>



      // <h1><Label bsStyle="info">Smart</Label><Label bsStyle="warning">Juice</Label></h1>
      // <form onSubmit={this.handleSubmit.bind(this)}>
      // <br /><input onChange={this.handleInputChange.bind(this)} value= {this.state.firstname} type="text" className="form-control" placeholder="First Name" id="firstname" />
      // <br /><input onChange={this.handleInputChange.bind(this)} value= {this.state.lastname} type="text" className="form-control" placeholder="Last Name" id="lastname" />
      // <br /><input onChange={this.handleInputChange.bind(this)} value= {this.state.username} type="text" className="form-control" placeholder="User Name" id="username" />
      // <br /><input onChange={this.handleInputChange.bind(this)} value= {this.state.password} type="password" className="form-control" placeholder="Enter Password" id="password" />
      // <br /><input onChange={this.handleInputChange.bind(this)} value= {this.state.password2} type="password" className="form-control" placeholder="Confirm Password again" id="password2" />
      // <br /><input onChange={this.handleInputChange.bind(this)} value= {this.state.email} type="text" className="form-control" placeholder="Email Address" id="email" />
      // <br /> <Button bsStyle="success" type="submit">Submit</Button>
      // </form>
      // <Button bsStyle="danger" onClick={this.clearRegEntries.bind(this)}>Reset</Button>


      const mapStateToProps = (state) => {
        console.log("Initial State 1: ",state);
        return {
          app     : state.app,
          user    : state.user,
          title : state.title,
          submittxt : state.submittxt,
          hideitem  : state.hideitem,
          hideitem2 : state.hideitem2
        };
      };

      const mapActionsToProps = (dispatch) => {
        return bindActionCreators(Actions, dispatch);
      };


export default connect(mapStateToProps, mapActionsToProps) (Smj);
