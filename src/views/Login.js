import axios from 'axios';
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router';
import { isLoggedIn } from '../helpers/login_helper';
import sharedVariables from '../shared/sharedVariables';


export class Login extends Component {

    constructor() {
        super();
        this.state = {
            otpSent: false,
            inputPhone: '',
            otp: ''
        }
    }

    updatePhoneNo(inputPhone) {
        this.setState({
            inputPhone
        })
    }
    updateOTP(otp) {
        this.setState({
            otp
        })
    }
    sendOTP() {
        if (this.state.inputPhone.length !== 10) {
            alert('Use a 10 digit valid phone no');
            return;
        }
        axios.post(`${sharedVariables.baseUrl}/auth/send-otp`, {
            phoneNo: this.state.inputPhone
        }).then(data => {
            this.setState({ otpSent: true })
        }).catch(e => {
        });
    }

    submitOTP() {
        if (this.state.inputPhone.length !== 10 && this.state.otp.length !== 4) {
            alert('Use a 10 digit valid phone no, 4 digit otp');
            return;
        }
        axios.post(`${sharedVariables.baseUrl}/auth/admin/verify-otp`, {
            phoneNo: this.state.inputPhone,
            otp: Number(this.state.otp)
        }).then(response => {
            localStorage.setItem("admin", response.data.admin)
            localStorage.setItem("role", response.data.role)
            localStorage.setItem("lastLoggedin", new Date().getTime())
            window.location.href = '/admin/dashboard'
        }).catch(e => {

        });
    }
    render() {
        if (isLoggedIn()) {
            return <Redirect to="/admin/dashboard" />
        }
        return (
            <div className="row" style={styles.loginCard}>
                <div className="col-lg-12 shadow bg-white rounded ">
                    <h2 style={styles.headerText}>Admin Login</h2>
                    <input style={styles.input} type="text" value={this.state.inputPhone} placeholder="AdminID" onChange={(e) => this.updatePhoneNo(e.target.value)} />
                    {!this.state.otpSent && <Button className="btn" onClick={() => this.sendOTP()} style={styles.button}>SEND OTP</Button>}
                    {this.state.otpSent && <input style={styles.input} type="password" placeholder="password" value={this.state.otp} onChange={(e) => this.updateOTP(e.target.value)} />}
                    {this.state.otpSent && <Button className="btn" onClick={() => this.submitOTP()} style={styles.button}>Submit OTP</Button>}
                </div>
            </div>
        )
    }
}

const styles = {
    loginCard: {
        verticalAlign: 'middle',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
    headerText: {
        fontSize: 30,
        textAlign: 'center',
        margin: 20,
    },
    input: {
        display: 'block',
        textAlign: 'center',
        margin: 10,
        height: 50
    },
    button: {
        height: 50,
        margin: '20%',
        textAlign: 'center',
        display: 'block',
        width: '60%'
    }
}