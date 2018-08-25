import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
//import actions from action creators file
import * as actions from '../actions/actions';
//import child components

const mapStateToProps = store => ({
  userInput: store.searches.userInput,
  locations: store.searches.locations
});

const mapDispatchToProps = dispatch => ({
  addSearch: userInput => dispatch(actions.addSearch(userInput)),
  addLocations: locations => dispatch(actions.addLocations(locations))
});

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  // make a post request to extract actual address from google maps through the backend
  handleSearch(event) {
    event.preventDefault();    
    const input = this.props.userInput;
    const result= {};
    // check first element of input to distinguish from address, city, or zipcode
    // if first element of the userinput is not a number, it's a city
    console.log('parsing a', parseInt('a'));
    if(isNaN(parseInt(input.charAt(0)))) {
      // grab city
      result.city = input;
    }else {
      // check the length of the userInput to distinguish zipcode or street address
      // if > 5, street address
      if(input.length > 5) {
        // grab address
        result.address = input;
      }else {
        // grab zipcode
        result.zip = Number(input);
      }
    }

    console.log('result inside client side', result);

    fetch('/searchAddress', 
      {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(result)
      })
      .then(response => {
          // I should be getting back some result of an object, empty, array of objects?
          console.log('getting the response back from server', response.data);
          return response.data;
        })
      .then(response => {
          this.props.addLocations(response.data);
        })
      .catch(err => {
        return err;
      })
  }
      
  // set the state for the user's input from the search bar
  handleChange(event) {
    console.log(`input ${event.target.value}`);
    this.props.addSearch(event.target.value);
    console.log(`username hererereer ${this.props.userInput}`)
  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleSearch}>
          <TextField 
              label='Driveway'
              onChange={this.handleChange} 
              margin='normal'/>
          <input type='submit' value='Search'/>
        </form>
      </div>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);