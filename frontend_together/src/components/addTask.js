import React, { Component } from "react";
// import TutorialDataService from "../services/tutorial.service";

//new packages
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';

const taskTypes = [
  'work', 'life', 'others'
];

/**
 * Component for rendering adding new task page.
 */
class AddTask extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveTask = this.saveTask.bind(this);
    this.newTask = this.newTask.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "", 
      published: false,

      selectedDate: new Date(),

      submitted: false
    };
  }

  /**
   * Change the title of the task
   * @param {Object} e - the input text
   */
  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  /**
   * Change the date of the task
   * @param {Object} e - the input text
   */
  onChangeDate(e) {
    this.setState({
      selectedDate: e.target.value
    });
  }

  /**
   * Change the description of the task
   * @param {Object} e - the input text
   */
  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  /**
   * save the new task data
   */
  saveTask() {
    var data = {
      title: this.state.title,
      description: this.state.description
    };

    // TutorialDataService.create(data)
    //   .then(response => {
    //     this.setState({
    //       id: response.data.id,
    //       title: response.data.title,
    //       description: response.data.description,
    //       published: response.data.published,

    //       submitted: true
    //     });
    //     console.log(response.data);
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
  }

  /**
   * create a new task 
   */
  newTask() {
    this.setState({
      id: null,
      title: "",
      description: "",
      published: false,
      selectedDate: null,
      submitted: false
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          //submit successfully
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newTask}>
              Add
            </button>
          </div>
        ) : (
          //creating task oage 
          <div>
            <div className="form-group">
            <label htmlFor="title">Date </label>
            <div />
              <Datepicker 
                selected={this.state.selectedDate}
                onChange={(date) => this.setState({ selectedDate: date})}
                dateFormat='yyyy-MM-dd' 
                minDate={new Date()}
                />
            </div>

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeTitle}
                name="title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">Type</label>
              <Dropdown options={taskTypes} 
                onChange={this._onSelect} 
                value={taskTypes[0]} 
                placeholder="Select an option" />
              
            </div>

            <button onClick={this.saveTask} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default AddTask;