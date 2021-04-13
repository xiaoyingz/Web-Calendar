import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import sadImg from '../images/sad.png';
import happyImg from '../images/happy.png';
import angryImg from '../images/angry.png';
import goodImg from '../images/good.png';

const TODOS = [
{
    _id: 0,
    title: 'abc',
    description: 'abcd',
    type: 'life',
    isFinished: false,
    isDelay: false
},
{
    _id: 1,
    title: 'def',
    description: 'defg',
    type: 'life',
    isFinished: true,
    isDelay: false
},
{
    _id: 2,
    title: 'hhhh',
    description: 'iiiii',
    type: 'work',
    isFinished: true,
    isDelay: false
},
{
    _id: 3,
    title: 'game',
    description: 'monster hunter',
    type: 'life',
    isFinished: false,
    isDelay: false
}
]

const SUMMARY = {
    _id: '2021-04-14',
    content: 'After I woke up this morning, I made the regrettable decision of waking up. ' +
        'I tried to go back to sleep, but I could not even relax. Today was one of those days where either ' +
        'I get up, or I get up. I then decided to go outside, but because it was raining, I got wet.',
    mood: 'sad'
}
/**
 * Component for rendering daily view, which contains that day's to-do list and summary
 */
export default class DailyView extends Component {
    /**
     * Represents a daily view
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        this.setCurrentTask = this.setCurrentTask.bind(this);

        this.state = {
            currentTask: null,
            currentIdx: ''
        }
    }

    /**
     * Store task selected by user in component's state
     * @param {Object} task - task selected by user
     */
    setCurrentTask(task) {
        this.setState({
            currentTask: task,
            currentIdx: task._id
        });
    }

    /**
     * Render DailyView component
     */
    render() {
        const currentTask = this.state.currentTask;
        const date = this.props.match.params.date;
        const today = new Date().toISOString().slice(0, 10);
        const moodPath = (SUMMARY.mood === '') ? null : 'frontend/web-calendar/src/images/sad.png';
        console.log(moodPath);
        return (
            <div>
                <div style={{marginBottom: '1rem'}}>
                    <h3>{date === undefined ? String(today) : date}</h3>
                </div>
                <div className='list row'>
                    <div className='col-md-6' style={{marginBottom: '2rem'}}>
                        <div>
                            <h4>To-do List</h4>
                            <Link
                                to={'/task/add'}
                                className='badge badge-info mr-2'
                            >
                                Add
                            </Link>
                        </div>
                        <div>
                            <ul className='list-group'>
                                {TODOS &&
                                TODOS.map((task) => (
                                    <li
                                        className={
                                            'list-group-item ' +
                                            (task._id === this.state.currentIdx ? 'active' : '')
                                        }
                                        style={task.isFinished ? {color: "gray"} : {color: "black"}}
                                        onClick={() => this.setCurrentTask(task)}
                                        key={task._id}
                                    >
                                        {task.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='col-md-6'>
                        {currentTask ? (
                            <div>
                                <h4>Task</h4>
                                <div>
                                    <label>
                                        <strong>title:</strong>
                                    </label>{' '}
                                    {currentTask.title}
                                </div>
                                <div>
                                    <label>
                                        <strong>description:</strong>
                                    </label>{' '}
                                    {currentTask.description}
                                </div>
                                <div>
                                    <label>
                                        <strong>type:</strong>
                                    </label>{' '}
                                    {currentTask.type}
                                </div>
                                <div
                                    style={currentTask.isFinished ? {color: "darkgreen"}:{color: "darkred"}}
                                >
                                    <label>
                                        <strong>{currentTask.isFinished ? 'Finished' : 'Unfinished'}</strong>
                                    </label>
                                </div>
                                <Link
                                    to={'/task/' + currentTask._id}
                                    className='badge badge-warning'
                                >
                                    Edit
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <br />
                                <p>Please click on a task...</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className='list row'>
                    <div className='col-md-6'>
                        <div>
                            <div className='list row'>
                                <div className='col-md-6'>
                                    <h4>Today's Summary</h4>
                                </div>
                                <div className='col-md-6'>
                                    <img src={EMO_MAP[SUMMARY.mood]}
                                         alt='mood of summary'
                                         className='photo'
                                         style={styles["image_style"]}
                                    />
                                </div>
                            </div>
                            <div>
                                {SUMMARY.content}
                            </div>
                            <Link
                                to={'/summary/' + SUMMARY._id}
                                className='badge badge-warning'
                            >
                                Edit
                            </Link>
                        </div>
                    </div>
                </div>
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
    }
}
