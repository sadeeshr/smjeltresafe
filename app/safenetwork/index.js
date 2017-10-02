import React, { Component } from 'react';
import safeApp from 'safe-app';
import CONSTANTS from './constants';
import keytar from 'keytar';

class SafeAPI {

  constructor(props) {
    this.app = null;
    // super(props);
  }

  uintToString(uintArray) {
    return new TextDecoder("utf-8").decode(uintArray);
  }

  authorize(props) {
    keytar.getPassword('authuri', 'smartjuice')
      .then((res) => {
        if (res) {
          console.log('URI from storage: ', res);
          return safeApp.fromAuthURI(CONSTANTS.APP_INFO.data, res)
            .then((app) => {
              console.log(app);
              this.app = app;
              props.profileSaved();
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
    this.setState({
      title: "Set Your Profile Details",
      submittxt: "REGISTER",
      deleteB: true
    });
    this.getUri();
  }

  fetchUserProfile(cb) {
    if (!this.app) {
      console.log('Application is not connected.');
    }
    else {
      let user = {};
      return this.app.auth.refreshContainersPermissions().then(() =>
        this.app.auth.getOwnContainer()
          .then((md) => md.getEntries()
            .then((entries) => {
              // console.log(entries);
              entries.forEach((key, value) => {
                user[this.uintToString(key)] = this.uintToString(value.buf);
                cb.profileSaved(user);
              })
            })
          ));
    }
  }


  saveUri(uri) {
    this.app = uri;
    console.log("app inside safe lib: ", this.app);
    return this.app;
  }

  saveUserInfo(props, user) {
    if (!this.app) {
      console.log('Application is not connected.');
    }
    else {
      return this.app.auth.refreshContainersPermissions().then(() =>
        this.app.auth.getOwnContainer()
          .then((md) => md.getEntries()
            .then((entries) => entries.mutate()
              .then((mut) => {
                mut.insert('firstname', user.firstname)
                  .then(() => mut.insert('middlename', user.middlename)
                    .then(() => mut.insert('lastname', user.lastname)
                      .then(() => mut.insert('street', user.street)
                        .then(() => mut.insert('nr', user.nr)
                          .then(() => mut.insert('ext', user.ext)
                            .then(() => mut.insert('zip', user.zip)
                              .then(() => mut.insert('town', user.town)
                                .then(() => mut.insert('avatar', user.avatar)
                                  .then(() => md.applyEntriesMutation(mut))
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
              }
              )
            )
          ))
        .then(() => {
          console.log("profile registered");
          props.profileSaved(user);
        })

    }
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
