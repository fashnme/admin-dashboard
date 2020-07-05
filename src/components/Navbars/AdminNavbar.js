import React, { Component } from "react";
import { Navbar, Button } from "react-bootstrap";
import { style } from './../../shared/Variables';

import AdminNavbarLinks from "./AdminNavbarLinks.js";

class Header extends Component {
    constructor(props) {
        super(props);
        this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
        this.state = {
            sidebarExists: false
        };
    }
    mobileSidebarToggle(e) {
        if (this.state.sidebarExists === false) {
            this.setState({
                sidebarExists: true
            });
        }
        e.preventDefault();
        document.documentElement.classList.toggle("nav-open");
        var node = document.createElement("div");
        node.id = "bodyClick";
        node.onclick = function () {
            this.parentElement.removeChild(this);
            document.documentElement.classList.toggle("nav-open");
        };
        document.body.appendChild(node);
    }
    render() {
        return (
            // <Navbar fluid>
            //   <NavbarBrand>
            //     <a href="#pablo"></a>
            //   </NavbarBrand>
            //   <Navbar.Toggle onClick={this.mobileSidebarToggle} />
            //   <Navbar.Collapse>
            //     <AdminNavbarLinks />
            //   </Navbar.Collapse>
            // </Navbar>

            <Navbar>
                <Navbar.Brand href="#pablo">{this.props.brandText}</Navbar.Brand>
                <Button style={style.toggleButton}  className="d-block d-sm-none" onClick={this.mobileSidebarToggle}>
                    <i className="pe-7s-menu lg"></i>
                    </Button>
                <Navbar.Collapse id="basic-navbar-nav">
                    <AdminNavbarLinks />
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Header;
