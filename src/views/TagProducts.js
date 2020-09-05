import axios from 'axios';
import React, { Component } from "react";
import { Button, Card, Spinner } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ReactStars from "react-rating-stars-component";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import sharedVariables from '../shared/sharedVariables';
import { fetchPostById, fetchPostByPageNo, fetchTextuallySimilarProducts, fetchVisuallySimilarProducts, submitTaggedProducts } from './../actions/index';
import { style } from './../shared/Variables';


const colorsArray = [["#136a8a", "#267871"], ["#7b4397", "#dc2430"], ["#e53935", "#e35d5b"], ["#005c97", "#363795"], ["#673ab7", "#512da8"]]

const getRandomColor = () => '"' + 'linear-gradient(' + colorsArray[Math.floor(Math.random() * 5)] + ')' + '"'

// console.log(getRandomColor())
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
      productSelected: null,
      currentlyTaggedProducts: [],
      currentPostId: null,
      searchQuery: '',
      similarProducts: [],
      cloudinaryUploading: false,
      postRating: 0,
      postTags: []
    };
    this.state = { ...this.initialState };

    this.searchProducts = this.searchProducts.bind(this);
    this.searchQueryChange = this.searchQueryChange.bind(this);
    this.ratingChange = this.ratingChange.bind(this);
    this.addTag = this.addTag.bind(this);
  };

  componentDidMount() {

    // console.log(this.props.location.pathname.includes('tag-product-id'))
    if (this.props.location.pathname.includes('tag-product-id')) {
      // Fetch products based on productId
      this.props.fetchPostById(this.props.match.params.postId);
    } else {
      // Finding PageNo From RouteParams (default is 1) and setting it in local state
      this.props.fetchPostByPageNo(Number(this.props.match.params.pageNo) || 1);
      this.props.history.push(`/admin/tag-products/${Number(this.props.match.params.pageNo) || 1}`);
    }

  };

  fetchNextPagePost() {
    this.props.history.push(`/admin/tag-products/${Number(this.props.match.params.pageNo) + 1}`);
    this.setState({ ...this.initialState });
    this.props.fetchPostByPageNo(Number(this.props.match.params.pageNo) + 1);
  };

  async fetchProductsButtonClicked() {
    if (this.props.posts[0]._source.mediaType === 'video') {
      this.setState({ cloudinaryUploading: true })
      let response = await axios.post('https://api.cloudinary.com/v1_1/patang1/image/upload', {
        file: this.state.src,
        upload_preset: sharedVariables.upload_preset
      }).catch(e => {
        console.log(e);
        this.setState({ cloudinaryUploading: false })
      });

      this.setState({
        src: response.data.secure_url.replace('.png', '.jpg'), cloudinaryUploading: false
      })
    }
    this.props.fetchVisuallySimilarProducts(this.state.src, this.state.bbCordinates);
  };

  searchProducts(event) {
    if (event.charCode === 13) {
      // console.log(this.state.query)
      this.props.fetchTextuallySimilarProducts(this.state.searchQuery);
    }
  }

  searchQueryChange(event) {
    this.setState({ searchQuery: event.target.value })
  }

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
    this.setState({ currentPostId: this.props.posts[0]._id, src: image.src, postTags: this.props.posts[0]._source.tags, postRating: this.props.posts[0]._source.rating });
    this.setState({
      currentlyTaggedProducts: this.props.posts[0]._source.taggedProducts
    })

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



  async tagProduct(product) {
    let currentlyTaggedProducts = this.state.currentlyTaggedProducts;
    let removed;
    let productId = product.productId;
    let title = product.title;

    currentlyTaggedProducts.forEach((ele) => {
      if (ele.productId === productId) {
        removed = true;
        this.removeProductFromTagging(productId);
      }
    });


    // The request is for tagging a product(not for removal)
    if (!removed) {
      currentlyTaggedProducts.push(product);
      this.setState({ currentlyTaggedProducts: currentlyTaggedProducts, productSelected: productId });

      // let response = await axios.get(`${sharedVariables.baseUrl}/product/check-product-availability?productId=${product.productId}`).catch(e => { })
      // if (response && response.data.available === true) {
      //   currentlyTaggedProducts.push(product);
      //   this.setState({ currentlyTaggedProducts: currentlyTaggedProducts, productSelected: productId });
      // } else {
      //   // alert('Out of stock')
      //   if (window.confirm('Out of stock want to check similar?')) {
      //     this.removeProductFromTagging(productId);
      //     let response = await axios.get(`${sharedVariables.baseUrl}/product/fetch-updated-similar-products?query=${title}`).catch(e => { })
      //     let products = this.state.similarProducts;
      //     products = [...response.data.products, ...products];
      //     this.setState({ similarProducts: products })
      //   } else {
      //     // Do nothing!
      //     this.removeProductFromTagging(productId);
      //     console.log('Thing was not saved to the database.');
      //   }

      // }
    }
    console.log('hh', currentlyTaggedProducts)
  };

  removeProductFromTagging(productId) {
    let currentlyTaggedProducts = this.state.currentlyTaggedProducts;
    currentlyTaggedProducts = currentlyTaggedProducts.filter(product => product.productId !== productId);
    this.setState({ currentlyTaggedProducts: currentlyTaggedProducts });
    if (document.querySelector(`#${productId}`)) {
      document.querySelector(`#${productId}`).checked = false;

    }
  };

  submitCompleteTagging(postId, productIdArray) {
    if (productIdArray.length === 0) {
      let confirmation = window.confirm('There is no product tagged, are you sure?');
      if (!confirmation) {
        return;
      }
    }

    this.props.submitTaggedProducts(postId, productIdArray);
  };

  onVideoMetaDataLoadingCompletion() {
    let video = this.refs.video;
    let canvas = this.refs.canvasOfSS;
    console.log(this.props.posts[0]._source.rating)
    this.setState({
      canvas, video, currentlyTaggedProducts: this.props.posts[0]._source.taggedProducts, currentPostId: this.props.posts[0]._id, postTags: this.props.posts[0]._source.tags, postRating: this.props.posts[0]._source.rating
    })



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


  async ratingChange(rating) {
    await axios.post(`${sharedVariables.baseUrl}/admin/update-rating-tags`, { postId: this.state.currentPostId, rating }, { headers: sharedVariables.headers })
    alert('Updated')
  }

  async addTag(tag) {
    await axios.post(`${sharedVariables.baseUrl}/admin/update-rating-tags`, { postId: this.state.currentPostId, tag }, { headers: sharedVariables.headers })
    alert('Updated')

  }

  renderVideoPost() {
    if (this.props.posts[0] && this.props.posts[0]._source.mediaType === 'video') {
      return (
        <div>
          <video crossOrigin="Anonymous" style={{ maxHeight: '400px' }} ref="video" controls onLoadedMetadata={() => { this.onVideoMetaDataLoadingCompletion() }} className="img-responsive" loop onPause={(data) => { this.takeSSFromVideo(); }}>
            <source type="video/mp4" src={this.props.posts[0]._source.bucketUrl} ></source>
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

  renderPostDetails() {
    if (this.props.posts[0]) {
      return (
        <div>
          <span>{this.props.posts[0]._id}</span>
        </div>
      )
    }
  }
  renderSearchBar() {
    return (
      <input style={styles.inputSearchStyle}
        className="shadow p-3 mb-5 bg-white"
        placeholder="Ex: Women Blue jeans under 1000" type="text" value={this.state.searchQuery} onChange={(e) => this.searchQueryChange(e)} onKeyPress={(e) => { this.searchProducts(e) }} />

    )
  }

  renderChips() {
    console.log(this.state.postTags)
    return <div style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', display: 'flex-inline' }}>{['music', 'fashion', 'beauty', 'funny', 'lipsync', 'dance'].map(e => {
      return (<button style={{ ...styles.chipStyle, backgroundColor: (this.state.postTags || []).indexOf(e) != -1 ? 'yellow' : 'white' }} onClick={() => this.addTag(e)} >{e}</button>)
    })}
    </div>
  }

  renderRating() {
    console.log(this.state.postRating)
    return <div style={{ marginTop: -30 }}>
      <ReactStars
        count={5}
        value={this.state.postRating}
        onChange={this.ratingChange}
        size={24}
        activeColor="#ffd700"
      />
    </div>
  }
  renderActionButtonsAndSearchbar() {
    return (
      <div>
        <div>
          {this.renderSearchBar()}
          <Button
            variant="danger"
            // disabled={this.state.productSelected ? false : true}
            style={{ margin: '5px 15px', float: 'right' }}
            onClick={() => {
              this.submitCompleteTagging(this.state.currentPostId, this.state.currentlyTaggedProducts.map(product => {
                return {
                  ...product
                }
              }
              ))
            }}
          >
            Submit
        </Button>
          <Button
            variant="success"
            style={{ margin: '5px 15px', float: 'right' }}
            onClick={() => { this.fetchNextPagePost() }}>
            Next Post
      </Button>
          {this.state.postTags && this.renderChips()}
          {!this.state.postTags && this.renderChips()}
          {this.state.postRating && this.renderRating()}
          {!this.state.postRating && this.renderRating()}

        </div>

        <div style={{ justifyContent: 'center' }}>{(this.state.cloudinaryUploading || this.props.loading || this.props.productsLoading) && this.renderLoadingSpinner()}</div>

      </div>
    );
  };

  renderCandidateProducts() {
    if (this.props.posts[0]) {
      // console.log(this.props.posts[0])
      let hashMap = {};
      (this.props.posts[0]._source.tempProducts || []).forEach(product => { hashMap[product.productId] = product; });
      let uniqueTempProducts = Object.values(hashMap);
      return uniqueTempProducts.map((product, index) => this.generalProductCard(product, index));
    } else {
      return [];
    }
  }

  renderProducts() {
    if (this.props.products.length > 0) {
      let products = this.props.products.map((product, index) => this.generalProductCard(product, index));
      return products;
    } else {
      return [];
    }
  }
  renderSimilarProducts() {
    if (this.state.similarProducts.length > 0) {
      let products = this.state.similarProducts.map((product, index) => this.generalProductCard(product, index));
      return products;
    } else {
      return [];
    }
  }
  generalProductCard(product, index) {
    let backgroundColor = null;
    if (!product.stockAvailability) {
      backgroundColor = 'yellow'
    } else {
      backgroundColor = (product.stockAvailability && (product.updationTime > 1594492200)) ? 'green' : 'red';
    }

    return (
      <div key={index} style={{ height: '280px', padding: 2 }} className="col-lg-3 ">
        <Card style={{ maxWidth: "100%", maxHeight: '260px', position: "relative" }} className="shadow p-3 mb-5 bg-white rounded">
          <Card.Img style={{ height: '200px' }} variant="top" src={product.image || product.imagesArray[0]} />
          <span style={{ position: 'absolute', borderRadius: 10, height: 10, width: 10, background: backgroundColor, right: 5, top: 10 }}></span>
          <div style={{ position: 'absolute', top: '200px', right: '0px' }}>
            <label className="custom-control custom-checkbox">
              <input type="checkbox" style={{ ...style.LargeCheckbox, ...style.pointer }} onChange={() => { this.tagProduct(product); }} label="" id={product.productId} />
            </label>
          </div>
          <div style={styles.titleAndBrand}>
            <strong>{product.brandName}</strong> {product.ecommerce} - Rs.{product.price}

          </div>
        </Card>
      </div>
    );
  }
  renderAlreadySelectedProducts() {
    return this.state.currentlyTaggedProducts.map((product, index) => {
      return (
        <div key={index} className="col-lg-3" style={{ position: 'relative' }}>
          <img alt='' className="img-fluid" src={product.image || product.imagesArray[0]} />
          <i
            onClick={() => { this.removeProductFromTagging(product.productId) }}
            className='fa fa-times'
            style={{ position: 'absolute', marginTop: '0px', ...style.pointer, fontSize: '1.3em' }}>

          </i>
        </div>
      )
    });
  };
  renderLoadingSpinner() {
    return (
      <Spinner animation="border" role="status" className="text-center" style={{ marginTop: "30px" }}>
        <span className="sr-only">Loading...</span>
      </Spinner>
    )
  };


  render() {

    const { cropDone } = this.state;
    return (
      <div className="row" >
        <div className="col-lg-3 text-center">

          {this.renderPostDetails()}
          {this.renderImagePost()}
          {cropDone && <div><button onClick={() => { this.fetchProductsButtonClicked() }} className="mx-auto btn btn-small btn-primary" >Crop & Search Similar</button>  <br></br><br></br> <br></br></div>}

          {this.renderVideoPost()}

          {this.props.loading && this.renderLoadingSpinner()}
        </div>
        <div>
        </div>
        <div className="col-lg-9 text-center">

          <div className="row">
            <div className="col-lg-12">
              {this.renderActionButtonsAndSearchbar()}
            </div>
          </div>

          <div className="col-lg-11">
            <div className="row">
              {this.renderAlreadySelectedProducts()}

            </div>
            <div className="row">


              {this.renderSimilarProducts()}
              {this.renderProducts()}
              {this.renderCandidateProducts()}
            </div>
          </div>


        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    posts: state.postsTaggingReducer.posts,
    pageNo: state.postsTaggingReducer.pageNo,
    products: state.postsTaggingReducer.products,
    productsLoading: state.postsTaggingReducer.productsLoading,
    loading: state.postsTaggingReducer.loading
  }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchPostByPageNo, fetchPostById, fetchVisuallySimilarProducts, submitTaggedProducts, fetchTextuallySimilarProducts }, dispatch);
};

const styles = {
  inputSearchStyle: {
    width: '65%',
    borderRadius: 5,
    borderColor: '#eee',
    borderWidth: 0,
    height: 45,
    justifyContent: 'left',
    padding: 5
  },
  titleAndBrand: {
    fontSize: 12
  },
  chipStyle: {
    borderRadius: 15,
    fontSize: 12,
    cursor: 'pointer',
    border: '1px solid grey',
    backgroundColor: getRandomColor(),
    textTransform: 'uppercase',
    padding: 5,
    margin: 2,
    display: 'inline-flex'
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TagProducts);
