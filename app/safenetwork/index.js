import React, { Component } from 'react';
import safeApp from 'safe-app';
import CONSTANTS from './constants';
import keytar from 'keytar';
// import { store } from '../index';
// import { saveSafeApp } from '../actions';

class SafeAPI {

  constructor(props) {
    this.app = null;
    // super(props);
  }

  authorize() {
    keytar.getPassword('authuri', 'smartjuice')
      .then((res) => {
        if(res) {
          console.log('URI from storage: ', res);
          return safeApp.fromAuthURI(CONSTANTS.APP_INFO.data, res)
          .then((app) => {
            console.log(app);
            this.app = app;
            // this.props.saveSafeApp(app);
          });
        } else {
          return safeApp.initializeApp(CONSTANTS.APP_INFO.data)
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

  checkAccessContainer() {
    if (!this.app) {
      console.log('Application is not connected.');
    }
    else {
      return this.app.auth.getContainer('_public')
        .then((res) => {
          console.log(res);
        });
    }
  }

  connect(event, response) {
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
          this.setState ({ app: app});
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


}
const safe = new SafeAPI();
export default safe;
