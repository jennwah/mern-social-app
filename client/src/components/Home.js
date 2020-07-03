import React, { Component } from 'react';
import NavBar from './NavBar';
import {Container, Row, Col} from 'reactstrap';
import SuggestFollow from './SuggestFollow';
import CreatePostAtHome from './CreatePostAtHome';
import Posts from './Posts';

import {withRouter} from 'react-router-dom';
class Home extends Component {

    

    render() {
        return (
            <div>
                <NavBar/>
                <div className="container">
                    <Container>
                        <Row>
                            <Col xs="9">
                                <CreatePostAtHome />
                                <Posts />
                            </Col>
                            <Col xs="3">
                                <SuggestFollow />
                            </Col>
                        </Row>
                    </Container>

                </div>
            </div>
        );
    }
}

export default withRouter(Home);