import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';

import {withRouter, Link} from 'react-router-dom';
import axios from 'axios';
import {isAuthenticated} from  '../helpers/index';



class NavBar extends Component {
   state = {
     isOpen: false,
     currentUser: {}
   }

    componentDidMount() {
      if(isAuthenticated()) {
          this.setState({currentUser : isAuthenticated().user})
      } else {
          this.props.history.push('/login')
      }
  }
   

   toggle = () => {
     this.setState({ isOpen: !this.state.isOpen});
   }

   handleSignOut = (e) => {
      e.preventDefault();
      if (typeof window !== "undefined") localStorage.removeItem("jwt")
      axios.get('/api/auth/logout')
        .then(response => {
          console.log(response.data)
          this.props.history.push('/login')
        })
        .catch(err => console.log(err))
   }


    render() {
        const {isOpen, currentUser} = this.state
        return (
            <div>
                <Navbar color="light" light expand="md">
                  <NavbarBrand href="/">MERN social </NavbarBrand>
                  <NavbarToggler onClick={this.toggle} />
                  <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                      <NavItem>
                        <NavLink href="/bookmark">Collection</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink href="" onClick={this.handleSignOut}>Sign Out</NavLink>
                      </NavItem>
                      <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                          Options
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem>
                            Option 1
                          </DropdownItem>
                          <DropdownItem>
                            Option 2
                          </DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>
                            Reset
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Nav>
                    <NavLink href="" onClick={this.handleSignOut}></NavLink>
                    <p>Welcome <Link to={`/user/${currentUser._id}`}>{currentUser.name}</Link></p>
                  </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default withRouter(NavBar);