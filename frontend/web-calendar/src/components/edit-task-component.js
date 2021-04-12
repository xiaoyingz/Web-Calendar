import React, { Component } from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import { DropdownButton } from "react-bootstrap";
import { withRouter } from "react-router-dom";
const testTask = {
    _id: 3,
    title: 'game',
    description: 'monster hunter',
    type: 'life',
    isFinished: true,
    isDelay: false
};

// const idx_map = {
//     'angry': 0,
//     'sad': 1,
//     'happy': 2,
//     'good': 3
// }
//
// const options = [
//   'angry', 'sad', 'happy', 'good'
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

export default class EditTask extends Component {
    constructor(props) {
        super(props);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeType = this.onChangeType.bind(this);

        this.state = {
            currentTask: {
                id: null,
                title: '',
                description: '',
                type: '',
                isFinished: false,
                isDelay: false
            }
        };
    }

    componentDidMount() {
        this.setState({
            currentTask: testTask
        })
    }

    onChangeTitle(e) {
        const title = e.target.value;
        this.setState(prevState => ({
            currentTask: {
                ...prevState.currentTask,
                title: title
            }
        }));
    }

    onChangeDescription(e) {
        const description = e.target.value;
        this.setState(prevState => ({
            currentTask: {
                ...prevState.currentTask,
                description: description
            }
        }));
    }

    onChangeType(eventKey) {
        this.setState(prevState => ({
            currentTask: {
                ...prevState.currentTask,
                type: eventKey
            }
        }));
    }

    render() {
        const currentTask = this.state.currentTask;
        const optionsCopy = JSON.parse(JSON.stringify(options));
        optionsCopy.splice(idx_map[currentTask.type], 1);
        return (
            <div>
                {currentTask ? (
                    <div className='edit-form'>
                        <h4>Task</h4>
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
                                    style={currentTask.isFinished ? {color: 'darkgreen'} : {color: "darkred"}}
                                >
                                    <strong>{currentTask.isFinished ? 'Finished':'Unfinished'}</strong>
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
                            <button className='btn btn-success mr-2'>
                                Update
                            </button>
                            <button className='btn btn-outline-primary mr-2'>
                                {'Mark as '.concat((currentTask.isFinished) ? 'Unfinished':'finished')}
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