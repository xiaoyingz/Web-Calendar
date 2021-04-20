import React, { Component } from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import { DropdownButton } from "react-bootstrap";
import TaskService from "../services/task-service";

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
 * Component for displaying information of a task, and 
 * input box and buttons for user to update this task.
 */
export default class EditTask extends Component {

    /**
     * Represents an EditTask component.
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.retrieveCurrentTask = this.retrieveCurrentTask.bind(this);
        this.onClickMark = this.onClickMark.bind(this);
        this.updateTask = this.updateTask.bind(this);

        this.state = {
            currentTask: {
                id: null,
                title: '',
                description: '',
                type: '',
                finish: 0,
                delay: 0
            },
            message: ''
        };
    }

    /**
     * Get information of current task immediately after
     * this component is mounted.
     */
    componentDidMount() {
        this.retrieveCurrentTask();
    }


    async retrieveCurrentTask() {
        try {
            let response = await TaskService.findTaskById(this.props.match.params.id);
            this.setState({
                currentTask: response.data
            })
        } catch(err) {
            console.log(err);
        }
    }

    /**
     * Track user's input in the box for title, and store 
     * the title in component's state.
     * @param {string} e 
     */
    onChangeTitle(e) {
        const title = e.target.value;
        this.setState(prevState => ({
            currentTask: {
                ...prevState.currentTask,
                title: title
            }
        }));
    }

    /**
     * Track user's input in the box for description, and store 
     * the description in component's state.
     * @param {string} e 
     */
    onChangeDescription(e) {
        const description = e.target.value;
        this.setState(prevState => ({
            currentTask: {
                ...prevState.currentTask,
                description: description
            }
        }));
    }

    /**
     * Track user's choice in the dropdown, and store the choice 
     * in component's state
     * @param {string} eventKey 
     */
    onChangeType(eventKey) {
        this.setState(prevState => ({
            currentTask: {
                ...prevState.currentTask,
                type: eventKey
            }
        }));
    }

    onClickMark(status) {
        const data = {
            finish: status
        }
        this.updateTask(data);
    }

    async updateTask(data) {
        try {
            let response = await TaskService.putTaskById(this.props.match.params.id, data);
            this.setState({
                message: response.data
            });
            this.retrieveCurrentTask();
        } catch(err) {
            console.log(err);
            this.setState({
                message: 'Failed to update task.'
            })
        }
    }

    /**
     * Render EditTask component.
     */
    render() {
        const currentTask = this.state.currentTask;
        const optionsCopy = JSON.parse(JSON.stringify(options));
        optionsCopy.splice(idx_map[currentTask.type], 1);
        return (
            <div>
                {currentTask ? (
                    <div className='edit-form'>
                        <h4>Task</h4>
                        {this.state.message &&
                            <div style={{color: 'darkred'}}>
                                {this.state.message}
                            </div>
                        }
                        <form>
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    value={currentTask.title}
                                    onChange={this.onChangeTitle}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="description"
                                    value={currentTask.description}
                                    onChange={this.onChangeDescription}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="isFinished"
                                    style={currentTask.finish === 1 ? {color: 'darkgreen'} : {color: "darkred"}}
                                >
                                    <strong>{currentTask.finish === 1 ? 'Finished':'Unfinished'}</strong>
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="type">Type</label>
                                <DropdownButton id="dropdown-item-button"
                                                title={currentTask.type}
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
                        </form>
                        <div>
                            <button onClick={()=>this.updateTask(this.state.currentTask)} className='btn btn-info mr-2'>
                                Update
                            </button>
                            <button onClick={()=>this.onClickMark(Math.abs(this.state.currentTask.finish - 1))} className='btn btn-outline-secondary mr-2'>
                                {'Mark as '.concat((currentTask.finish === 1) ? 'Unfinished':'finished')}
                            </button>
                            <button onClick={this.props.history.goBack} className='btn btn-outline-danger mr-2'>
                                Back
                            </button>
                        </div>
                    </div>
                ):(
                    <div>
                        invalid task id
                    </div>
                )}
            </div>
        );
    }
}
