import React, { Component } from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import { DropdownButton } from "react-bootstrap";
import sadImg from '../images/sad.png';
import happyImg from '../images/happy.png';
import angryImg from '../images/angry.png';
import goodImg from '../images/good.png';

const currentSummary = {
    _id: '2021-04-14',
    content: 'After I woke up this morning, I made the regrettable decision of waking up. ' +
        'I tried to go back to sleep, but I could not even relax. Today was one of those days where either ' +
        'I get up, or I get up. I then decided to go outside, but because it was raining, I got wet.',
    mood: 'sad'
}

const idx_map = {
    'angry': 0,
    'sad': 1,
    'happy': 2,
    'good': 3
}

const options = [
    'angry', 'sad', 'happy', 'good'
];

export default class EditSummary extends Component {
    constructor(props) {
        super(props);

        this.onChangeContent = this.onChangeContent.bind(this);
        this.onChangeMood = this.onChangeMood.bind(this);

        this.state = {
            currentSummary: {
                _id: '',
                content: '',
                mood: ''
            }
        };
    }

    componentDidMount() {
        this.setState({
            currentSummary: currentSummary
        });
    }

    onChangeContent(e) {
        const content = e.target.value;
        this.setState(prevState => ({
            currentTask: {
                ...prevState.currentTask,
                content: content
            }
        }));
    }

    onChangeMood(eventKey) {
        this.setState(prevState => ({
            currentSummary: {
                ...prevState.currentSummary,
                mood: eventKey
            }
        }));
    }

    render() {
        const currentSummary = this.state.currentSummary;
        const optionsCopy = JSON.parse(JSON.stringify(options));
        optionsCopy.splice(idx_map[currentSummary.mood], 1);
        return (
            <div>
                {currentSummary ? (
                    <div className='edit-form'>
                        <div className='list row'>
                            <div className='col-md-2'>
                                <h4>Summary</h4>
                            </div>
                            <div className='col-md-6'>
                                <img src={EMO_MAP[currentSummary.mood]}
                                     alt='mood of summary'
                                     className='photo'
                                     style={styles["image_style"]}
                                />
                            </div>
                        </div>
                        <h5
                            style={{color: "darkgray"}}
                        >{currentSummary._id}</h5>
                        <form>
                            <div className="form-group">
                                <label htmlFor="mood">Mood</label>
                                <DropdownButton id="dropdown-item-button"
                                                title={currentSummary.mood}
                                                variant="outline-secondary"
                                                onSelect={this.onChangeMood}
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
                            <div className="form-group">
                                <label htmlFor="content">Content</label>
                                <div>
                                    <textarea
                                        style={styles.textarea_style}
                                        value={currentSummary.content}
                                        onChange={this.onChangeContent}
                                    >
                                </textarea>
                                </div>
                            </div>

                        </form>
                        <div>
                            <button className='btn btn-info mr-2'>
                                Submit
                            </button>
                            <button onClick={this.props.history.goBack} className='btn btn-outline-danger mr-2'>
                                Back
                            </button>
                        </div>

                    </div>
                ):(
                    <div>
                        Invalid summary
                    </div>
                )}
            </div>
        );
    }
}

const EMO_MAP = {
    'sad': sadImg,
    'angry': angryImg,
    'good': goodImg,
    'happy': happyImg
}

const styles = {
    image_style : {
        flex: 1,
        height: '30px',
        width: '30px',
        justifyContent: 'left'
    },
    textarea_style: {
        width: '800px',
        height: '200px'
    }
}
