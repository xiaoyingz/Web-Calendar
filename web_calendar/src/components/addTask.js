import React, { Component } from "react";
import TaskService from "../services/task-service";
import Dropdown from "react-bootstrap/Dropdown";
import { DropdownButton } from "react-bootstrap";

//new packages
// import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import { isThisISOWeek } from "date-fns";

// const taskTypes = [
//   'work', 'life', 'study', 'other'
// ];

const idx_map = {
    'life': 0,
    'work': 1,
    'study': 2,
    'other': 3
}

const options = [
    'life', 'work', 'study', 'other'
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
    this.onChangeType = this.onChangeType.bind(this);

    this.state = {
        _id: null,
        title: "",
        description: "",
        selectedDate: new Date(),
        type: "work",
        finish: 0,
        delay: 0,
        message: ''
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

  onChangeType(eventKey) {
    this.setState({
        type: eventKey
      });
  }

  /**
   * save the new task data
   */
  async saveTask() {
    const date = this.state.selectedDate.toISOString().slice(0, 10);
    console.log(String(date));
    const data = {
            _id: this.state._id,
            date: String(date),
            title: this.state.title,
            description: this.state.description,
            type: this.state.type,
            finish: this.state.finish,
            delay: this.state.delay
        };
        console.log(data);
        try {
            let response = await TaskService.postTask(data);
            this.setState({
                message: response.data
            });
        } catch(err) {
            console.log(err);
            this.setState({
                message: "Failed to add task."
            });
    }
  }

  /**
   * create a new task 
   */
  newTask() {
    this.setState({
        _id: null,
        title: "",
        description: "",
        selectedDate: new Date(),
        type: "work",
        finish: 0,
        delay: 0,
        message: ''
    });
  }

  render() {
    const optionsCopy = JSON.parse(JSON.stringify(options));
    optionsCopy.splice(idx_map[this.state.type], 1);
    return (
      <div className="submit-form">
        {this.state.message ? (
          //submit successfully
          <div>
            <h4>{this.state.message}</h4>
            <button className="btn btn-outline-danger" onClick={this.newTask}>
              Back to add
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
              <DropdownButton 
                    id="dropdown-item-button"
                    title={this.state.type}
                    variant="outline-secondary"
                    onSelect={this.onChangeType}
                >
                    <Dropdown.Item eventKey={optionsCopy[0]}>
                        {optionsCopy[0]}
                    </Dropdown.Item>
                    <Dropdown.Item eventKey={optionsCopy[1]}>
                        {optionsCopy[1]}
                    </Dropdown.Item>
                    <Dropdown.Item eventKey={optionsCopy[2]}>
                        {optionsCopy[2]}
                    </Dropdown.Item>
                </DropdownButton>

            </div>

            <button onClick={this.saveTask} className="btn btn-success mr-2">
              Submit
            </button>
            <button onClick={this.props.history.goBack} className='btn btn-outline-danger mr-2'>
                Back
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default AddTask;