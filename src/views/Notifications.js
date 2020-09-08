import axios from 'axios';
import Button from "components/CustomButton/CustomButton.js";
import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import sharedVariables from '../shared/sharedVariables';

class Notifications extends Component {
  constructor() {
    super();
    this.state = {
      userType: 'user_id',
      selectedUserId: null,
      multiSelectedUserIds: [],
      notificationType: 'patang_message',
      notificationData: {}
    }
    this.notificationTypes = {
      patang_message: ['title', 'body', 'userId', 'image'],
      open_profile: ['userId', 'profileId'],
      open_post: ['userId', 'postId'],
      open_link: ['userId', 'link', 'body'],
      open_personal_store: ['userId', 'productId', 'productImage'],
    }

  }

  async submit() {
    console.log(this.state.notificationType, this.notificationTypes[this.state.notificationType], this.state.userType, this.state.notificationData)

    let arrayOfRequiredFields = this.notificationTypes[this.state.notificationType];

    let filteredArray = []

    if (!this.state.notificationData) {
      alert('Wrong Data');
      return;
    }

    if (this.state.userType === 'user_id' && !this.state.notificationData['userId']) {
      alert('Pass userId or change the delivery group');
      return;
    } else if (this.state.userType !== 'user_id') {
      arrayOfRequiredFields.splice(arrayOfRequiredFields.indexOf('userId'), 1);
    }

    console.log(this.state.notificationType, this.notificationTypes[this.state.notificationType], this.state.userType, this.state.notificationData)


    filteredArray = arrayOfRequiredFields.filter(fieldName => this.state.notificationData[fieldName] && this.state.notificationData[fieldName].trim().length > 0)

    if (filteredArray.length >= arrayOfRequiredFields.length) {
      alert('Sending Notification');
      // console.log(this.state.userType)
      await this.setState({ notificationData: { ...this.state.notificationData, userType: this.state.userType } })
      // console.log(this.state.notificationType, this.state.notificationData)
      let res = null;
      if (this.state.userType === 'user_id') {
        res = await axios.post(`${sharedVariables.notificationServerUrl}/send-notification`, { notificationData: this.state.notificationData, notificationType: this.state.notificationType });
      } else {
        res = await axios.post(`${sharedVariables.notificationServerUrl}/send-bulk-notification`, { notificationData: this.state.notificationData, notificationType: this.state.notificationType });
      }

      if (!res) {
        console.log('return some isssue')
        alert('some issue in back, dont retry unless you are sure');

      } else {
        console.log('done')
        alert('Successfully Updated');
      }
      // console.log()
    } else {
      console.log(filteredArray, arrayOfRequiredFields)
      alert('Pass All Required Fields')
      return;
    }

  }
  render() {
    return (
      <div className="content">
        <Container fluid>
          <div className="card">


            <div className="header">
              <h4 className="title">Notifications</h4>
              <Row>
                <Col md={6} l={6}>
                  <h4>Select User</h4>
                  <select
                    style={styles.selectBox}
                    name='select-user' title={'Select User'}
                    value={this.state.userType}
                    onChange={(e) => {
                      this.setState({ userType: e.target.value })
                      this.setState({ notificationData: {} })
                    }}>
                    <option value={'user_id'}>User By ID</option>
                    <option value={'male'}>Male</option>
                    <option value={'female'}>Female</option>
                    <option value={'all'}>All</option>
                  </select>
                </Col>
                <Col md={6} l={6}>
                  <h4>Select Notification Type</h4>

                  <select
                    style={styles.selectBox}

                    name='notification-type'
                    title={'Select Notification Type'}
                    value={this.state.notificationType}

                    onChange={(e) => {
                      this.setState({ notificationType: e.target.value })
                      // this.setState({ notificationData: {} })
                    }}>
                    <option value={'open_profile'}>open_profile</option>
                    <option value={'open_post'}>open_post</option>
                    <option value={'patang_message'}>patang_message</option>
                    <option value={'open_link'}>open_link</option>
                    <option value={'open_personal_store'}>open_personal_store</option>
                  </select>
                </Col>
                <Col md={12} l={12}>
                  <div style={{ textAlign: 'center' }}>
                    <h4>Selected Type: <strong>{this.state.notificationType}</strong></h4>
                  </div>
                  <Row>

                    {Object.entries({ [this.state.notificationType]: this.notificationTypes[this.state.notificationType] }).map(entry => {
                      return entry[1].map(entryName => {
                        return (
                          <Col>
                            {((this.state.userType === 'user_id' && entryName === 'userId') || entryName !== 'userId') && <input style={styles.inputStyle} type="text" placeholder={entryName} id={entryName}
                              value={this.state.notificationData[entryName] || ''}
                              onChange={(e) => {
                                console.log(e.target.value)
                                this.setState({ notificationData: { ...this.state.notificationData, [entryName]: e.target.value } }, () => {
                                  console.log('updated', this.state.notificationData)
                                })
                              }} />}
                          </Col>)
                      })
                    })
                    }

                  </Row>
                  <Row style={{ display: 'block', justifyContent: 'center', textAlign: 'center' }} >
                    <Button className={'btn-fill'} onClick={() => this.submit()}>Submit</Button>
                  </Row>
                </Col>
              </Row>
            </div>

          </div>
        </Container>
      </div>
    );
  }
}

export default Notifications;

const styles = {
  inputStyle: {
    padding: 7,
    margin: 5
  },
  selectBox: {
    padding: 10,
    borderColor: '#eee',
    backgroundColor: '#fff',
    color: '#888'
  }
}