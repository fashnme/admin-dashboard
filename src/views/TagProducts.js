import React, { Component } from "react";
import { Card, Spinner } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchPostForProductTagging, fetchVisuallySimilarProducts, submitTaggedProducts } from './../actions/index';
import { style } from './../shared/Variables';

class TagProducts extends Component {

  constructor() {

    super();

    this.initialState = {
      src: '',
      croppedImageUrl: '',
      crop: {
        unit: 'px',
      },
      bbCordinates: [0, 0, 0, 0],
      cropDone: false,
      vsProductsLoading: false,
      productSelected: null,
      currentlyTaggedProducts: [],
      currentPostId: null
    };
    this.state = { ...this.initialState };
  };

  componentDidMount() {

    // Finding PageNo From RouteParams (default is 1) and setting it in local state
    this.props.fetchPostForProductTagging(Number(this.props.match.params.pageNo) || 1);
    this.props.history.push(`/admin/tag-products/${Number(this.props.match.params.pageNo) || 1}`);

  };

  fetchNextPagePost() {
    this.props.history.push(`/admin/tag-products/${Number(this.props.match.params.pageNo) + 1}`);
    this.setState({ ...this.initialState });
    this.props.fetchPostForProductTagging(Number(this.props.match.params.pageNo) + 1);
  };

  fetchProductsButtonClicked() {
    this.props.fetchVisuallySimilarProducts(this.state.src, this.state.bbCordinates);
  };



  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );
      this.setState({ croppedImageUrl });
    }
  };


  getCroppedImg(image, crop) {

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve, reject) => {
      this.setState({ croppedImageUrl: canvas.toDataURL() })
      resolve();
    });

  };

  onImageLoaded = image => {
    this.imageRef = image;
    this.setState({ currentPostId: this.props.posts[0]._id, src: image.src });
  };


  onCropComplete = crop => {
    this.setState({ cropDone: true });
  };

  onCropChange = (crop) => {
    const image = this.imageRef;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    let x1 = (crop.x) * scaleX;
    let y1 = (crop.y) * scaleY;
    let x2 = x1 + crop.width * scaleX;
    let y2 = y1 + crop.height * scaleY;

    this.setState({ crop: crop, bbCordinates: [x1, y1, x2, y2] });
  };



  tagProduct(product) {

    let currentlyTaggedProducts = this.state.currentlyTaggedProducts;
    let removed;

    currentlyTaggedProducts.forEach((ele) => {
      if (ele.productId === product.productId) {
        removed = true;
        this.removeProductFromTagging(product.productId);
      }
    });

    if (!removed) {
      currentlyTaggedProducts.push(product);
      this.setState({ currentlyTaggedProducts: currentlyTaggedProducts, productSelected: product.productId });
    }
  };

  removeProductFromTagging(productId) {
    let currentlyTaggedProducts = this.state.currentlyTaggedProducts;
    currentlyTaggedProducts = currentlyTaggedProducts.filter(product => product.productId !== productId);
    this.setState({ currentlyTaggedProducts: currentlyTaggedProducts });
  };

  submitCompleteTagging(postId, productIdArray) {
    this.props.submitTaggedProducts(postId, productIdArray);
  };

  onVideoMetaDataLoadingCompletion() {
    let video = this.refs.video;
    let canvas = this.refs.canvasOfSS;


    this.setState({
      canvas, video

    });

  };

  takeSSFromVideo() {

    let { canvas, video } = this.state;
    let context = canvas.getContext('2d');
    let ratio, h, w;
    ratio = video.videoWidth / video.videoHeight;
    w = video.videoWidth - 100;
    h = parseInt(w / ratio, 10);
    canvas.width = w;
    canvas.height = h;
    canvas.crossorigin = "Anonymous";

    context.fillRect(0, 0, w, h);
    context.drawImage(this.refs.video, 0, 0, w, h);
    let b64 = canvas.toDataURL();

    this.setState({ src: b64 });
  };

  renderVideoPost() {
    if (this.props.posts[0] && this.props.posts[0]._source.mediaType === 'video') {
      return (
        <div>

          <video crossOrigin="Anonymous" style={{ maxHeight: '400px' }} ref="video" controls onLoadedMetadata={() => { this.onVideoMetaDataLoadingCompletion() }} className="img-responsive" loop onPause={(data) => { this.takeSSFromVideo(); }}>
            <source type="video/mp4" src={this.props.posts[0]._source.uploadUrl} ></source>
          </video>
          <canvas style={{ display: 'none' }} crossOrigin="Anonymous" ref="canvasOfSS" id="canvas"></canvas>
        </div>
      );
    }
  };

  renderImagePost() {
    const { crop, src } = this.state;

    if (src) {
      return (
        <ReactCrop
          src={src}
          crop={crop}
          ruleOfThirds
          onChange={this.onCropChange}
          onComplete={this.onCropComplete}
          onImageLoaded={this.onImageLoaded}
        />
      );

    } else if (this.props.posts[0] && this.props.posts[0]._source.mediaType === 'image') {
      return (
        <ReactCrop
          src={this.props.posts[0]._source.uploadUrl}
          crop={crop}
          ruleOfThirds
          onChange={this.onCropChange}
          onComplete={this.onCropComplete}
          onImageLoaded={this.onImageLoaded}
        />
      );
    }
  };


  renderActionButtons() {
    return (
      <div className="shadow  bg-grey rounded">
        <button
          disabled={this.state.productSelected ? false : true}
          className=" btn mx-auto btn"
          style={{ margin: '5px 15px', float: 'right' }}
          onClick={() => { this.submitCompleteTagging(this.state.currentPostId, this.state.currentlyTaggedProducts.map(ele => ele.productId)) }}>
          Submit
        </button>
        <button
          className=" btn mx-auto btn"
          style={{ margin: '5px 15px', float: 'right' }}
          onClick={() => { this.fetchNextPagePost() }}>
          Next Post
      </button>


      </div>
    );
  }; page

  renderProducts() {
    if (this.props.vsProducts.length > 0) {
      let products = this.props.vsProducts.map((product) => {
        return (
          <div className="col-lg-3 shadow p-3 mb-5 bg-white rounded" style={{ height: '280px' }} key={product.productId}>
            <Card style={{ maxWidth: "100%", maxHeight: '260px', position: "relative" }}>
              <Card.Img style={{ height: '200px' }} variant="top" src={product.imageUrl} />
              <div style={{ position: 'absolute', top: '180px', right: '0px' }} className="mb-3">
                <label className="custom-control custom-checkbox">
                  <input type="checkbox" style={{ ...style.LargeCheckbox, ...style.pointer }} onChange={() => { this.tagProduct(product); }} label="" id={product.productId} />
                </label>
              </div>
              <strong>{product.brandName}</strong> {product.ecommerce} - Rs.{product.price}
            </Card>
          </div>
        );
      });
      return products;
    } else {
      return [];
    }
  }

  renderLoadingSpinner() {
    return (
      <Spinner animation="border" role="status" className="text-center" style={{ marginTop: "30px" }}>
        <span className="sr-only">Loading...</span>
      </Spinner>
    )
  };

  renderAlreadySelectedProducts() {
    return this.state.currentlyTaggedProducts.map((product, index) => {
      return (
        <div key={index} className="col-lg-3" style={{ position: 'relative' }}>
          <img alt='' className="img-fluid" src={product.imageUrl} />
          <i
            onClick={() => { this.removeProductFromTagging(product.productId) }}
            className='fa fa-times'
            style={{ position: 'absolute', marginTop: '0px', ...style.pointer, fontSize: '1.3em' }}>

          </i>
        </div>
      )
    });
  };


  render() {
    const { cropDone, crop } = this.state;
    return (
      <div className="row" >
        <div className="col-lg-3 text-center">
          {this.renderImagePost()}
          {cropDone && <button onClick={() => { this.fetchProductsButtonClicked() }} className="mx-auto btn" >Crop & Search Similar</button>}

          {this.renderVideoPost()}

          {this.props.loading && this.renderLoadingSpinner()}
        </div>
        <div>
        </div>
        <div className="col-lg-8 text-center">
          <div className="row">
            {this.renderAlreadySelectedProducts()}
          </div>
          <div className="row text-center">
            <div className="col-lg-10">
              {!this.props.vsLoading && this.renderActionButtons()}
            </div>
            {this.renderProducts()}
          </div>
          {this.props.vsLoading && this.renderLoadingSpinner()}
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    posts: state.postsTaggingReducer.posts,
    pageNo: state.postsTaggingReducer.pageNo,
    vsProducts: state.postsTaggingReducer.vsProducts,
    vsLoading: state.postsTaggingReducer.vsLoading,
    loading: state.postsTaggingReducer.loading
  }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchPostForProductTagging, fetchVisuallySimilarProducts, submitTaggedProducts }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TagProducts);