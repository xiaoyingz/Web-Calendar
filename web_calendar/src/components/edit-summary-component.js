import React, { Component } from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import { DropdownButton } from "react-bootstrap";
import sadImg from '../images/sad.png';
import happyImg from '../images/happy.png';
import angryImg from '../images/angry.png';
import goodImg from '../images/good.png';
import SummaryService from '../services/summary-service';

const idx_map = {
    'angry': 0,
    'sad': 1,
    'happy': 2,
    'good': 3
}

const options = [
    'angry', 'sad', 'happy', 'good'
];

/**
 * Component for displaying information of a day's summary, and
 * fields allowing user to update the summary.
 */
export default class EditSummary extends Component {

    /**
     * Represents an EditSummary component
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        this.onChangeContent = this.onChangeContent.bind(this);
        this.onChangeMood = this.onChangeMood.bind(this);
        this.retrieveCurrentSummary = this.retrieveCurrentSummary.bind(this);
        this.onClickUpdate = this.onClickUpdate.bind(this);
        this.initSummary = this.initSummary.bind(this);

        this.state = {
            message: '',
            currentSummary: {
                _id: '',
                content: '',
                mood: 'happy'
            }
        };
    }

    /**
     * Get information of current summary immediately
     * this component is mounted
     */
    componentDidMount() {
        this.retrieveCurrentSummary();
    }

    /**
     * Get today's summary and store it in the state
     */
    async retrieveCurrentSummary() {
        const date = this.props.match.params.id;
        try {
            let response = await SummaryService.findTodaySummary(date);
            this.setState({
                currentSummary: response.data
            })
        } catch(err) {
            console.log(err);
        }
    }

    async initSummary(data) {
        try{
            let response = await SummaryService.createSummary(data);
            console.log(response.data);
        } catch(err) {
            console.log(err);
        }
    }

    /**
     * Track user's input in the box for content, and store 
     * the content in component's state.
     * @param {string} e - user's input
     */
    onChangeContent(e) {
        const content = e.target.value;
        this.setState(prevState => ({
            currentSummary: {
                ...prevState.currentSummary,
                content: content
            }
        }));
    }

    /**
     * Track user's choice in the dropdown, and store the choice 
     * in component's state
     * @param {string} eventKey - user's choice for summary's mood
     */
    onChangeMood(eventKey) {
        this.setState(prevState => ({
            currentSummary: {
                ...prevState.currentSummary,
                mood: eventKey
            }
        }));
    }

    async onClickUpdate() {
        try {
            const data = {
                content: this.state.currentSummary.content,
                mood: this.state.currentSummary.mood
            }
            let response = await SummaryService.editSummary(this.props.match.params.id, data);
            this.setState({
                message: response.data
            });
        } catch(err) {
            console.log(err.response.data);
            this.setState({
                message: err.response.data
            })
        }
    }

    /**
     * Render EditSummary component.
     */
    render() {
        const currentSummary = this.state.currentSummary;
        const optionsCopy = JSON.parse(JSON.stringify(options));
        optionsCopy.splice(idx_map[currentSummary.mood], 1);
        return (
            <div>
                {currentSummary ? (
                    <div className='edit-form'>
                        <div className='list row'>
                            <div>
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
                        {this.state.message && 
                            <div style={{color: 'darkred'}}>
                                {this.state.message}
                            </div>
                        }
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
                            <button onClick={this.onClickUpdate} className='btn btn-info mr-2'>
                                Update
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
