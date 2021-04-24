import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { DropdownButton } from 'react-bootstrap';

// new packages
import 'react-dropdown/style.css';

import Datepicker from 'react-datepicker';
import TaskService from '../services/task-service';
import 'react-datepicker/dist/react-datepicker.css';

const idxMap = {
    life: 0,
    work: 1,
    study: 2,
    other: 3,
};

const options = [
    'life', 'work', 'study', 'other',
];

/**
 * Component for rendering adding new task page.
 */
class AddTask extends Component {

    /**
     * Represent an AddTask component.
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.saveTask = this.saveTask.bind(this);
        this.newTask = this.newTask.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeType = this.onChangeType.bind(this);

        this.state = {
            title: '',
            description: '',
            selectedDate: new Date(),
            type: 'work',
            finish: 0,
            delay: 0,
            message: '',
        };
    }

    /**
     * Change the title of the task.
     * @param {Object} e - the input text
     */
    onChangeTitle(e) {
        this.setState({
            title: e.target.value,
        });
    }

    /**
     * Change the date of the task.
     * @param {Object} e - the input text
     */
    onChangeDate(e) {
        this.setState({
            selectedDate: e.target.value,
        });
    }

    /**
     * Change the description of the task.
     * @param {Object} e - the input text
     */
    onChangeDescription(e) {
        this.setState({
            description: e.target.value,
        });
    }

    /**
     * Change the type of the task.
     * @param {String} eventKey 
     */
    onChangeType(eventKey) {
        this.setState({
            type: eventKey,
        });
    }

    /**
     * save the new task data.
     */
    async saveTask() {
        const date = this.state.selectedDate.toISOString().slice(0, 10);
        console.log(String(date));
        const data = {
            date: String(date),
            title: this.state.title,
            description: this.state.description,
            type: this.state.type,
            finish: this.state.finish,
            delay: this.state.delay,
        };
        console.log(data);
        try {
            const response = await TaskService.postTask(data);
            this.setState({
                message: response.data,
            });
        } catch (err) {
            console.log(err);
            this.setState({
                message: 'Failed to add task.',
            });
        }
    }

    /**
     * create a new task.
     */
    newTask() {
        this.setState({
            title: '',
            description: '',
            selectedDate: new Date(),
            type: 'work',
            finish: 0,
            delay: 0,
            message: '',
        });
    }

    /**
     * Render AddTask component.
     */
    render() {
        const optionsCopy = JSON.parse(JSON.stringify(options));
        optionsCopy.splice(idxMap[this.state.type], 1);
        return (
            <div className="submit-form">
                {this.state.message ? (
                // submit successfully
                    <div>
                        <h4>{this.state.message}</h4>
                        <button type="button" className="btn btn-outline-danger" onClick={this.newTask}>
                            Back to add
                        </button>
                    </div>
                ) : (
                // creating task oage
                    <div>
                        <div className="form-group">
                            Date
                            <div>
                                <Datepicker
                                    selected={this.state.selectedDate}
                                    onChange={(date) => this.setState({ selectedDate: date })}
                                    dateFormat="yyyy-MM-dd"
                                    minDate={new Date()}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            Title
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
                            Description
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
                            Type
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

                        <button type="button" onClick={this.saveTask} className="btn btn-success mr-2">
                            Submit
                        </button>
                        <button type="button" onClick={this.props.history.goBack} className="btn btn-outline-danger mr-2">
                            Back
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default AddTask;
