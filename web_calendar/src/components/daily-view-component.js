import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import sadImg from '../images/sad.png';
import happyImg from '../images/happy.png';
import angryImg from '../images/angry.png';
import goodImg from '../images/good.png';

import TaskService from '../services/task-service';
import SummaryService from '../services/summary-service';


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
        this.getDate = this.getDate.bind(this);
        this.retrieveTasks = this.retrieveTasks.bind(this);
        this.retrieveSummary = this.retrieveSummary.bind(this);

        this.state = {
            currentTask: null,
            currentIdx: '',
            tasks: [],
            summary: {
                id: '',
                content: "init",
                mood: '',
                year: 0,
                month: 0,
                day: 0,
                date: ''
            },
            date: 'init',
            taskMessage: '',
            summaryMessage: ''
        }
    }

    componentDidMount() {
        const date = this.getDate();
        this.setState({
            date: date
        })
        console.log('this'+date);
        this.retrieveSummary(date);
        this.retrieveTasks(date);
        console.log(this.state.summary)
    }

    async retrieveTasks(date) {
        try {
            let response = await TaskService.findTodayTask(date);
            let tasks = await response.data;
            console.log(tasks);
            this.setState({
                tasks: tasks
            })
        } catch(err) {
            console.log(err);
            this.setState({
                taskMessage: 'Click add to create a new task.'
            })
        }
    }

    async retrieveSummary(date) {
        try {
            let response = await SummaryService.findTodaySummary(date);
            this.setState({
                summary: response.data
            })
            console.log(this.state.summary);
        } catch(err) {
            this.setState({
                summaryMessage: "Click new to write today's summary"
            })
            console.log(err);
        }
    }

    getDate() {
        var date = this.props.match.params.date;
        const today = new Date().toISOString().slice(0, 10);
        date = (date === undefined) ? String(today) : date;
        return date;
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
        const summary = this.state.summary;
        const tasks = this.state.tasks;
        console.log('render')
        console.log(summary)
        console.log(summary.content)
        return (
            <div className='list row'>
                <div style={{marginBottom: '1rem'}}>
                    <h3>{this.state.date}</h3>
                </div>
                <div className='list row'>
                    <div className='col-md-6' style={{marginBottom: '2rem'}}>
                        <div>
                            <h4>To-do List</h4>
                            <Link
                                to={'/addTask'}
                                className='badge badge-info mr-2'
                            >
                                Add
                            </Link>
                        </div>
                        {this.state.taskMessage === '' ? (
                            <div>
                            <ul className='list-group'>
                                {tasks &&
                                tasks.map((task) => (
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
                        ):(
                            <div>
                                {this.state.taskMessage}
                            </div>
                        )}
                        
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
                        <div className='list row'>
                            <div>
                                <h4>Today's Summary</h4>
                            </div>
                            <div className='col-md-3'>
                                {summary.mood && 
                                    <div>
                                        <img src={EMO_MAP[summary.mood]}
                                            alt='mood of summary'
                                            className='photo'
                                            style={styles["image_style"]}
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                        {this.state.summaryMessage === '' ? (
                            <div>
                                {summary.content}
                                <div>
                                <Link
                                    to={'/summary/' + this.state.date}
                                    className='badge badge-warning'
                                >
                                    Edit
                                </Link>
                                </div>
                            </div>
                        ):(
                            <div>
                                {this.state.summaryMessage}
                                <div>
                                <Link
                                    to={'/addSummary/' + this.state.date}
                                    className='badge badge-info'
                                >
                                    New
                                </Link>
                                </div>
                            </div>
                        )}
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
