import React, { Component } from 'react';
import { Alert, Label, Button, Image, Tooltip, Grid, Row, Col, Panel, PanelGroup, ListGroup, ListGroupItem, InputGroup, Glyphicon, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import keytar from 'keytar';
import Web3 from 'web3';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goPackages: false,
      coinbase: null,
      web3: null,
      originalBalance: null
    };
  }

  componentWillMount() {
    // this.deleteUri();
    console.log("components mounted, getting web3");
    console.log("web3: ", Web3);
    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    console.log(web3);
    var that = this;

    // this.setState({web3 : web3});
    setTimeout(() => {
      web3.eth.getCoinbase()
        .then((cb) => {
          console.log("coinbase: ", cb);
          that.setState({
            web3: web3,
            coinbase: cb
          });
        });

    }, 1000);
  }

  refreshContainer() {
    this.forceUpdate();
  }

  selectFromAC(e) {
    console.log(e.target.value);
    this.setState({ fromAC: e.target.value });
  }

  selectToAC(e) {
    console.log(e.target.value);
    this.setState({ toAC: e.target.value });
  }

  getEthBal() {
    this.state.web3.eth.getBalance(this.state.coinbase)
      .then((bal) => {
        console.log("Balance is: ", bal);
        this.setState({ originalBalance: bal });
      });
  }

  ethTransfer() {
    console.log(this.state.web3);
    this.state.web3.eth.personal.unlockAccount(this.state.fromAC, 'iloveethereum').then(() => {
      this.state.web3.eth.sendTransaction({ from: this.state.fromAC, to: this.state.toAC, value: this.state.ethVal })
        .then((res) => { console.log(res); this.setState({ showAlert: true }); });
    })

  }

  handleInputChange(e) {
    this.setState({
      ethVal: e.target.value
    });
  }

  handleAlertDismiss() {
    this.setState({ showAlert: false });
  }

  deleteUri() {
    keytar.deletePassword('authuri', 'smartjuice');
    console.log('Deleted Stored Auth URI.');
    console.log('Restart App, to get authorized again');
  }

  goPackages() {
    this.setState({ goPackages: !this.state.goPackages });
  }

  render() {
    if (!this.props.user) {
      this.props.fetchUserProfile(this.props);
      return (<div> </div>);
    }
    console.log("Home render => props ", this.props);
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
                  <h1 className="bodytitle">Welcome {this.props.user.firstname} <br /></h1>

                  <div className="upload_picture">
                    <img src={this.props.user.avatar} />
                  </div>

                  <div className="form-body" style={{ marginBottom: '50px' }}>
                    <div className="row">
                      <PanelGroup defaultActiveKey="1" accordion>
                        <Panel header="Account profile" eventKey="1" bsStyle="warning">
                          <div className="page4form">
                            <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '32%', marginRight: '8px' }}>
                              <label id="firstname" className="form-control" placeholder="First Name">{this.props.user.firstname}</label>
                            </div>

                            <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '32%', marginRight: '8px' }}>
                              <label id="middlename" className="form-control" placeholder="Middle Name">{this.props.user.middlename}</label>
                            </div>

                            <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '32%' }}>
                              <label id="lastname" className="form-control" placeholder="Last Name">{this.props.user.lastname}</label>
                            </div>

                          </div>
                          <div className="page4form">
                            <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '45%', marginRight: '8px' }}>
                              <label id="street" className="form-control" placeholder="Street">{this.props.user.street}</label>

                            </div>

                            <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '25%', marginRight: '8px' }}>
                              <label id="nr" className="form-control" placeholder="NR">{this.props.user.nr}</label>
                            </div>

                            <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '25%' }}>
                              <label id="ext" className="form-control" placeholder="EXT">{this.props.user.ext}</label>
                            </div>

                          </div>


                          <div className="page4form">
                            <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '48%', marginRight: '8px' }}>
                              <label id="zip" className="form-control" placeholder="ZIP Code">{this.props.user.zip}</label>

                            </div>

                            <div className="form-group form-md-line-input page4" style={{ float: 'left', width: '48%' }}>
                              <label id="town" className="form-control" placeholder="Town">{this.props.user.town}</label>
                            </div>

                          </div>
                        </Panel>
                        <Panel header="Ethereum Account Info" eventKey="2" bsStyle="danger" onClick={this.getEthBal.bind(this)}>
                          <ListGroup>
                            <ListGroupItem header="My Account" bsStyle="info">{this.state.coinbase ? this.state.coinbase : "..."}</ListGroupItem>
                            <ListGroupItem header="Ethereum Balance" bsStyle="warning"><h3><Label bsStyle="primary">{this.state.originalBalance ? this.state.originalBalance : "..."}</Label></h3></ListGroupItem>
                          </ListGroup>
                        </Panel>
                        <Panel header="Simulate Ethereum Transfer" eventKey="3" bsStyle="info" >
                          <FormGroup>
                            <ControlLabel>From Account</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={this.selectFromAC.bind(this)}>
                              <option>select</option>
                              <option value="0x5DFE021F45f00Ae83B0aA963bE44A1310a782fCC">0x5DFE021F45f00Ae83B0aA963bE44A1310a782fCC         [ ** My Account ** ]</option>
                              <option value="0xFE2b768a23948EDDD7D7Caea55bAa31E39045382">0xFE2b768a23948EDDD7D7Caea55bAa31E39045382 </option>
                              <option value="0xA9a418dA22532Bd1189fF8Be5Cdaf3570bF9da43">0xA9a418dA22532Bd1189fF8Be5Cdaf3570bF9da43 </option>
                              <option value="0x9F3A4BBeD4660F2DCCd6E980e2FaA6d6214E5Dc8">0x9F3A4BBeD4660F2DCCd6E980e2FaA6d6214E5Dc8 </option>
                              <option value="0xc10261166b4699D3c1535Aa30AC29446c755f065">0xc10261166b4699D3c1535Aa30AC29446c755f065 </option>
                              <option value="0xe480219e1904de4500Cd8459C74d388457A3f3Ec">0xe480219e1904de4500Cd8459C74d388457A3f3Ec </option>
                              <option value="0xED7211F84b37B0f62d345462fFeB56b57B787539">0xED7211F84b37B0f62d345462fFeB56b57B787539 </option>
                              <option value="0xCC52165260FB50dA8Fc9fEd714e33884D324f7Dd">0xCC52165260FB50dA8Fc9fEd714e33884D324f7Dd </option>
                              <option value="0x28c36458566E89b3F9F3D5c1Ba52FDF840072598">0x28c36458566E89b3F9F3D5c1Ba52FDF840072598: </option>
                            </FormControl>
                            <ControlLabel>To Account</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={this.selectToAC.bind(this)}>
                              <option>select</option>
                              <option value="0x5DFE021F45f00Ae83B0aA963bE44A1310a782fCC">0x5DFE021F45f00Ae83B0aA963bE44A1310a782fCC         [ ** My Account ** ]</option>
                              <option value="0xFE2b768a23948EDDD7D7Caea55bAa31E39045382">0xFE2b768a23948EDDD7D7Caea55bAa31E39045382 </option>
                              <option value="0xA9a418dA22532Bd1189fF8Be5Cdaf3570bF9da43">0xA9a418dA22532Bd1189fF8Be5Cdaf3570bF9da43 </option>
                              <option value="0x9F3A4BBeD4660F2DCCd6E980e2FaA6d6214E5Dc8">0x9F3A4BBeD4660F2DCCd6E980e2FaA6d6214E5Dc8 </option>
                              <option value="0xc10261166b4699D3c1535Aa30AC29446c755f065">0xc10261166b4699D3c1535Aa30AC29446c755f065 </option>
                              <option value="0xe480219e1904de4500Cd8459C74d388457A3f3Ec">0xe480219e1904de4500Cd8459C74d388457A3f3Ec </option>
                              <option value="0xED7211F84b37B0f62d345462fFeB56b57B787539">0xED7211F84b37B0f62d345462fFeB56b57B787539 </option>
                              <option value="0xCC52165260FB50dA8Fc9fEd714e33884D324f7Dd">0xCC52165260FB50dA8Fc9fEd714e33884D324f7Dd </option>
                              <option value="0x28c36458566E89b3F9F3D5c1Ba52FDF840072598">0x28c36458566E89b3F9F3D5c1Ba52FDF840072598: </option>
                            </FormControl>
                            <p />
                            <ControlLabel>Value of Ethereum To Transfer</ControlLabel>
                            <input type="text" placeholder="enter amount of eth" value={this.state.ethVal} onChange={this.handleInputChange.bind(this)} /><p />
                            <Button block bsStyle="primary" onClick={this.ethTransfer.bind(this)}>Transfer </Button>
                            <p />
                            <div hidden={!this.state.showAlert}><Alert bsStyle="success" onDismiss={this.handleAlertDismiss.bind(this)}> Ethereum Transfer Success ! Please check your current Balance above.</Alert></div>
                          </FormGroup>
                        </Panel>
                      </PanelGroup>
                      <Button bsStyle="success" className="btn mainbtn" onClick={this.goPackages.bind(this)}>Select Package</Button>
                      <br /> <br />
                      <Button bsStyle="warning" onClick={this.refreshContainer.bind(this)} bsSize="xsmall">Refresh Profile</Button>

                      <Button bsStyle="danger" onClick={this.deleteUri.bind(this)} bsSize="xsmall">Delete Key</Button>
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

const mapStateToProps = (state) => {
  return {
    ...state
  };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch);
};


export default connect(mapStateToProps, mapActionsToProps)(Home);
