import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchPostForProductTagging, fetchVisuallySimilarProducts } from './../actions/index';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import  Spinner  from 'react-bootstrap/Spinner';

export default class Test extends Component {



  render() {

    return (
        <div >helo</div>

    );
  }
};

