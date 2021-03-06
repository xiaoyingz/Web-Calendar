import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import sadImg from '../images/sad.png';
import happyImg from '../images/happy.png';
import angryImg from '../images/angry.png';
import goodImg from '../images/good.png';

import TaskService from '../services/task-service';
import SummaryService from '../services/summary-service';
import WeatherSerive from '../services/weather-service';

const EMO_MAP = {
    sad: sadImg,
    angry: angryImg,
    good: goodImg,
    happy: happyImg,
};

const styles = {
    image_style: {
        flex: 1,
        height: '30px',
        width: '30px',
        justifyContent: 'left',
    },
    weather_style: {
        flex: 1,
        height: '60px',
        width: '60px',
        justifyContent: 'left',
    },
};

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
        this.onClickDelete = this.onClickDelete.bind(this);
        this.retrieveWeather = this.retrieveWeather.bind(this);

        this.state = {
            currentTask: null,
            currentIdx: '',
            tasks: [],
            summary: {
                id: '',
                content: 'init',
                mood: '',
                year: 0,
                month: 0,
                day: 0,
                date: '',
            },
            date: 'init',
            taskMessage: '',
            summaryMessage: '',
            deleteMessage: '',
            isToday: false,
            weather: {
                "weather": [
                {
                    "id": 800,
                    "main": '',
                    "description": '',
                    "icon": ''
                }
            ],},
        };
    }

    /**
     * Get desired data i.e. date, tasks, summary, and weather once
     * this component is mounted.
     */
    componentDidMount() {
        const date = this.getDate();
        const today = new Date().toISOString().slice(0, 10);
        if (date == today) {
            console.log("isToday");
            this.setState({
                isToday: true,
            });
            this.retrieveWeather();
        }
        this.setState({
            date,
        });
        this.retrieveSummary(date);
        this.retrieveTasks(date);
    }

    /**
     * Button Listener for Delete, call controller to delete a task by id.
     */
    async onClickDelete() {
        try {
            const { currentIdx, date } = this.state;
            const response = await TaskService.deleteTaskById(currentIdx);
            this.setState({
                deleteMessage: response.data,
                currentIdx: '',
                currentTask: null,
            });
            this.retrieveTasks(date);
        } catch (err) {
            console.log(err);
            this.setState({
                deleteMessage: 'Failed to delete this task.',
            });
        }
    }

    /**
     * Helper to parse url to get date, if url is '/', return today's date.
     * @returns String in the format of "YY-MM-DD"
     */
    getDate() {
        const paramDate = this.props.match.params.date;
        const today = new Date().toISOString().slice(0, 10);
        const date = (paramDate === undefined) ? String(today) : paramDate;
        return date;
    }

    /**
     * Store task selected by user in component's state
     * @param {Object} task - task selected by user
     */
    setCurrentTask(task) {
        this.setState({
            currentTask: task,
            currentIdx: task._id,
        });
    }

    /**
     * Call controller to get tasks by date, and store the data in the state.
     * @param {String} date 
     */
    async retrieveTasks(date) {
        try {
            const response = await TaskService.findTodayTask(date);
            const tasks = await response.data;
            console.log(tasks);
            this.setState({
                tasks,
            });
        } catch (err) {
            console.log(err);
            this.setState({
                taskMessage: 'Click add to create a new task.',
            });
        }
    }

    /**
     * Call controller to get summary by id, and store the data in the state.
     * @param {String} date 
     */
    async retrieveSummary(date) {
        try {
            const response = await SummaryService.findTodaySummary(date);
            this.setState({
                summary: response.data,
            });
        } catch (err) {
            this.setState({
                summaryMessage: "Click new to write today's summary",
            });
            console.log(err);
        }
    }

    /**
     * Helper to get weather information from openweathermap.org.
     */
    async retrieveWeather() {
        try {
            const response = await WeatherSerive.getWeather();
            this.setState({
                weather: response.data,
            })
        } catch(err) {
            console.log(err);
        }
    }

    /**
     * Render DailyView component
     */
    render() {
        const {
            currentTask, summary, tasks, date, deleteMessage,
            summaryMessage, taskMessage, currentIdx, weather, isToday,
        } = this.state;
        return (
            <div>
                <div className="list row">
                    <div className="col-md-6">
                        <h1>{date}</h1>
                    </div>
                    <div className="col-md-3">
                        {isToday === true ? (
                            <div>
                                <div>
                                    <img
                                        src={"http://openweathermap.org/img/w/"+weather['weather'][0]['icon']+".png"}
                                        alt="weather icon"
                                        className="photo"
                                        title={weather['weather'][0]['main']+": "+weather['weather'][0]['description']}
                                        style={styles.weather_style}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
                <div className="list row">
                    <div className="col-md-6" style={{ marginBottom: '2rem' }}>
                        <div>
                            <h4>To-do List</h4>
                            {deleteMessage
                            && (
                                <div style={{ color: 'darkred' }}>
                                    {deleteMessage}
                                </div>
                            )}
                            <Link
                                to="/addTask"
                                className="badge badge-info mr-2"
                            >
                                Add
                            </Link>
                        </div>
                        {taskMessage === '' ? (
                            <div>
                                <Link
                                    to={"/pie/"+date}
                                    className="badge badge-info mr-2"
                                >
                                    Visualization
                                </Link>
                                <ul className="list-group">
                                    {tasks
                                    && tasks.map((task) => (
                                        <li
                                            className={
                                                `list-group-item ${
                                                    task._id === currentIdx ? 'active' : ''}`
                                            }
                                            style={task.finish === 1 ? { color: 'gray' } : { color: 'black' }}
                                            onClick={() => this.setCurrentTask(task)}
                                            key={task._id}
                                        >
                                            {task.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div>
                                {taskMessage}
                            </div>
                        )}
                    </div>
                    <div className="col-md-6">
                        {currentTask ? (
                            <div>
                                <h4>Task</h4>
                                <div>
                                    <button type="button" onClick={this.onClickDelete} className="btn btn-outline-danger mr-2">
                                        Delete
                                    </button>
                                </div>
                                <div>
                                    <strong>title:</strong>
                                    {' '}
                                    {currentTask.title}
                                </div>
                                <div>
                                    <strong>description:</strong>
                                    {' '}
                                    {currentTask.description}
                                </div>
                                <div>
                                    <strong>type:</strong>
                                    {' '}
                                    {currentTask.type}
                                </div>
                                <div
                                    style={currentTask.finish === 1 ? { color: 'darkgreen' } : { color: 'darkred' }}
                                >
                                    <strong>{currentTask.finish === 1 ? 'Finished' : 'Unfinished'}</strong>
                                </div>
                                <Link
                                    to={`/task/${currentTask._id}`}
                                    className="badge badge-warning mr-2"
                                >
                                    Edit
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <p>Please click on a task...</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="list row">
                    <div className="col-md-6">
                        <div className="list row">
                            <div>
                                <h4>Today&apos;s Summary</h4>
                            </div>
                            <div className="col-md-3">
                                {summary.mood
                                    && (
                                        <div>
                                            <img
                                                src={EMO_MAP[summary.mood]}
                                                alt="mood of summary"
                                                className="photo"
                                                style={styles.image_style}
                                                title={summary.mood}
                                            />
                                        </div>
                                    )}
                            </div>
                        </div>
                        {summaryMessage === '' ? (
                            <div>
                                {summary.content}
                                <div>
                                    <Link
                                        to={`/summary/${date}`}
                                        className="badge badge-warning"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {summaryMessage}
                                <div>
                                    <Link
                                        to={`/addSummary/${date}`}
                                        className="badge badge-info"
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
