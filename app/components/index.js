import React, { Component } from 'react';
import safeApp from 'safe-app';
import { remote, ipcRenderer as ipc } from 'electron';
import CONSTANTS from '../safenetwork/constants';
import keytar from 'keytar';
import { Alert, Label, Button, Image, Tooltip, Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import { store } from '../index';
import { Redirect } from 'react-router-dom';

class Smj extends Component {

  constructor(props) {
    super(props);
    this.state = {
      app: '',
      user: {
        avatar: "picture.png",
        firstname: '',
        middlename: '',
        lastname: '',
        street: '',
        nr: '',
        ext: '',
        zip: '',
        town: ''
      },
      title: '',
      submittxt: 'REGISTER',
      hideitem: false,
      hideitem2: false,
      deleteB: true,
      alertVisible: true
    };

    ipc.on('auth-response', this.Connect.bind(this));
  }


  componentWillMount() {

    this.props.authorizationRequest(this.props);

  }

  Connect(event, response) {
    keytar.setPassword('authuri', 'smartjuice', response);
    console.log('Store URI to storage: ', response);
    // console.log('Click On Get App button.');
    this.setState({
      title: "Set Your Profile Details",
      submittxt: "REGISTER",
      deleteB: true
    });
    this.getUri();
  }

  getUri() {
    keytar.getPassword('authuri', 'smartjuice')
      .then((res) => {
        if (res) {
          console.log('URI from storage: ', res);
          // console.log('Check permissions on safe network.');

          safeApp.fromAuthURI(CONSTANTS.APP_INFO.data, res)
            .then((app) => {
              console.log(app);
              this.props.saveSafeApp(app);
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
    if (this.state.submittxt == "REGISTER") {
      this.props.saveUserInfo(this.props, this.state.user);
    } else {

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

  handleInputChange(e) {
    // console.log(e.target.value);
    const userstate = this.state.user;
    const key = e.target.id;
    const value = e.target.value;
    userstate[key] = value;
    this.setState({
      user: userstate
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
        user: userstate
      });
    }

    reader.readAsDataURL(file)
  }

  clearRegEntries() {
    this.setState({
      user: {
        firstname: "New User",
        middlename: "",
        lastname: "",
        street: "",
        nr: "",
        ext: "",
        zip: "",
        town: ""
      }
    });
  }

  handleAlertDismiss() {
    this.setState({ alertVisible: false });
  }

  handleAlertShow() {
    this.setState({ alertVisible: true });
  }

  render() {

    console.log('Render => Props: ', this.props);

    if (this.props.profile_saved) {
      return <Redirect to="/home" />;
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
                  <h1 className="bodytitle">{this.state.user.firstname} ! {this.state.title} <br /></h1>

                  <div className="upload_picture">
                    <label htmlFor="file-input">
                      <img src={this.state.user.avatar} />
                    </label>
                    <input className="img_upload" id="file-input" type="file" onChange={this.handleImageChange.bind(this)} />
                  </div>
                  <div hidden={this.state.hideitem} className="form-body" style={{ marginBottom: '50px' }}>
                    <div className="row">
                      <div className="page4form">
                        <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '32%', marginRight: '8px' }}>
                          <input id="firstname" onChange={this.handleInputChange.bind(this)} value={this.state.user.firstname} type="text" className="form-control" placeholder="First Name" />

                        </div>

                        <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '32%', marginRight: '8px' }}>
                          <input id="middlename" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.middlename} className="form-control" placeholder="Middle Name" />
                        </div>

                        <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '32%' }}>
                          <input id="lastname" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.lastname} className="form-control" placeholder="Last Name" />
                        </div>

                      </div>
                      <div className="page4form">
                        <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '45%', marginRight: '8px' }}>
                          <input id="street" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.street} className="form-control" placeholder="Street" />

                        </div>

                        <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '25%', marginRight: '8px' }}>
                          <input id="nr" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.nr} className="form-control" placeholder="NR" />
                        </div>

                        <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '25%' }}>
                          <input id="ext" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.ext} className="form-control" placeholder="EXT" />
                        </div>

                      </div>


                      <div className="page4form">
                        <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '48%', marginRight: '8px' }}>
                          <input id="zip" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.zip} className="form-control" placeholder="ZIP Code" />

                        </div>

                        <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '48%' }}>
                          <input id="town" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.user.town} className="form-control" placeholder="Town" />
                        </div>

                      </div>

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
}



const mapStateToProps = (state) => {
  // console.log("Initial State 1: ",state);
  return {
    ...state
  };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch);
};


export default connect(mapStateToProps, mapActionsToProps)(Smj);
