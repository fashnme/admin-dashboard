import React, { Component } from "react";
import { Card, Form } from "react-bootstrap";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { orderPageDataFetch, updateOrderProductStatus } from '../actions';

class Order extends Component {


    componentDidMount() {
        this.props.orderPageDataFetch(this.props.match.params.id);
    };

    updateProductStatus(a, b, c) {
        this.props.updateOrderProductStatus(a, b, c);
    }

    renderProducts() {
        if (this.props.orderDetails.products) {
            return this.props.orderDetails.products.map((product, index) => {
                return (
                    <Card className="lg-" style={{ width: '18rem' }} key={index}>
                        <Card.Img variant="top" src={product.imagesArray[0]} />
                        <Card.Body>
                            <Card.Title>Status: {product.status}</Card.Title>
                            <Card.Text>
                                <b>{product.brandName}</b>:{product.title}
                                <br /> Size: {product.size}, Quantity: {product.quantity || 1}
                                <br />Price: {product.price}
                            </Card.Text>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Update Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    defaultValue={product.status}
                                    onChange={(event) => { this.updateProductStatus(this.props.orderDetails.orderId, product.productId, event.target.value); }}
                                >
                                    <option >Select</option>
                                    <option value="placed">Placed</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="dispatched">Dispatched</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="cancelled">Cancelled</option>
                                </Form.Control>
                            </Form.Group>

                        </Card.Body>
                    </Card>
                )

            });
        }
    }

    renderUserRelatedDetails() {
        if (this.props.orderDetails.deliveryDetails) {
            return (
                <Card>
                    <Card.Body>
                        <Card.Text>
                            <b>{this.props.orderDetails.deliveryDetails.name}</b><br />
                            {this.props.orderDetails.deliveryDetails.address} - {this.props.orderDetails.deliveryDetails.pinCode}
                            <br />{this.props.orderDetails.deliveryDetails.city}, {this.props.orderDetails.deliveryDetails.state}
                            Phone: {this.props.orderDetails.deliveryDetails.phoneNo} | {this.props.orderDetails.deliveryDetails.email}

                        </Card.Text>
                    </Card.Body>
                </Card>

            )
        }
    }

    render() {
        return (
            <div>
                <div className="row">
                    {this.renderUserRelatedDetails()}
                </div>

                <div className="row">
                    {this.renderProducts()}
                </div>

            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        orderDetails: state.orderReducer.orderDetails
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ orderPageDataFetch, updateOrderProductStatus }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Order);
