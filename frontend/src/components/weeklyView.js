
import React from "react";
import {format, startOfWeek, addDays, 
    isSameDay, subWeeks, addWeeks, endOfWeek} from "date-fns";
import TaskService from '../services/task-service';

// test data
// const TASKS = [
//     {
//         _id: 0,
//         date: "2021-04-28",
//         title: 'chill',
//         type: 'life',
//         finish: 0,
//     },
//     {
//         _id: 1,
//         date: "2021-04-25",
//         title: 'workout',
//         type: 'life',
//         finish: 1,
//     },
//     {
//         _id: 0,
//         date: "2021-04-20",
//         title: 'eat beef',
//         type: 'life',
//         finish: 0,
//     },
//     {
//         _id: 0,
//         date: "2021-04-21",
//         title: 'watch a movie',
//         type: 'life',
//         finish: 1,
//     }
//     ]

/**
 * Component for rendering weekly overview page.
 */
class WeeklyView extends React.Component {
    state = {
      selectedDate: new Date(),
      currentWeek: new Date(),
      taskData: []
    };

    /**
     * Fetch all the tasks within the week from databse.
     * @param {string} date - a day which we can derive the entire week
     */
    async retrieveTasks(date) {
        try {
            console.log(date);
            let dateFormat = "yyyy-MM-dd";
            let startDate = startOfWeek(date);
            startDate = format(startDate, dateFormat);
            let endDate = endOfWeek(date);
            endDate = format(endDate, dateFormat);
            console.log(startDate);
            console.log(endDate);
            let response = await TaskService.findWeeklyTasks(startDate, endDate);
            let tasks = await response.data;
            console.log(tasks);
            this.setState({
                taskData: tasks
            })
        } catch(err) {
            console.log(err);
            this.setState({
                taskMessage: 'Click add to create a new task.'
            })
        }
    }

    /**
     * Update the tasks upon the user hit the prev/next button
     */
    componentDidMount() {
        this.retrieveTasks(this.state.currentWeek);
    }
    
    /**
     * Find all the tasks for a specific day
     * @param {string} tempDate - user's choice for a day
     */
    findTasks(tempDate) {

        let result = [];
        for (var i = 0; i < this.state.taskData.length; i++) {
            if (this.state.taskData[i]["date"] === tempDate) {
                result.push(this.state.taskData[i]);
            }
        }
        return result;
    };

    //TODO: can split the tasks into finished and unfinished
    selectTitlesFromTasks = (tempDate, result) => {
        // let result = this.findTasks(tempDate);
        let taskTitles = [];
        for (var i = 0; i < result.length; i++) {
            taskTitles.push(
                <div
                style={result[i].finish ? {color: "green"} : {color: "red"}}
                > {result[i]["title"]} </div>
            )
        }
        
        // for (var i = 0; i < this.state.taskData.length; i++) {
        //     taskTitles.push(
        //         <div> {this.state.taskData[i]["title"]} </div>
        //     )
        // }


        return taskTitles;
    }
  
    /**
     * Rendering the header, including prev & next month buttons,
     * and the year-month information.
     */
    renderHeader() {
        // const dateFormat = "yyyy-MM Io";
        const dateFormat = "yyyy-MM";
        //week ?
    
        return (
          <div className="header row flex-middle">
            <div className="col col-start">
              <div className="icon" onClick={this.prevWeek}>
                chevron_left
              </div>
            </div>
            <div className="col col-center">
              <span>{format(this.state.currentWeek, dateFormat)}</span>
            </div>
            <div className="col col-end" onClick={this.nextWeek}>
              <div className="icon">chevron_right</div>
            </div>
          </div>
        );
      }
    
    /**
     * Rendering days from Sunday to Saturday.
     */
    renderDays() {
        const dateFormat = "EEEE";
        const days = [];

        let startDate = startOfWeek(this.state.currentWeek);

        for (let i = 0; i < 7; i++) {
            days.push(
            <div className="col col-center" key={i}>
                {format(addDays(startDate, i), dateFormat)}
            </div>
            );
        }

        return <div className="days row">{days}</div>;
    }
    
    /**
     * Rendering cells for each day, including the date,
     * tasks for each day.
     */
    renderCells() {
        const { selectedDate, currentWeek } = this.state;
        const weekStart = startOfWeek(currentWeek)

        const dateFormat = "d";
        const tempDateFormate = "yyyy-MM-dd"
        const rows = [];

        let days = [];
        let day = weekStart;
        let formattedDate = "";
        

        for (let i = 0; i < 7; i++) {
            let tempDate=""
            formattedDate = format(day, dateFormat);
            tempDate = format(day, tempDateFormate);
            let tasks = this.selectTitlesFromTasks(tempDate, this.findTasks(tempDate));
          
            days.push(
                <div
                className={`col cell_week ${
                    isSameDay(day, selectedDate) ? "selected" : ""
                }`}
                key={day}
                onClick={() => this.onDateClick(tempDate)}
                >
                <div>----</div>
                <span className="number">{formattedDate}</span>
                <div classname="body">{"\n"}</div>
                {tasks}
                <span className="bg">{formattedDate}</span>
                </div>
            );
            day = addDays(day, 1);
        }

        rows.push(
            <div className="row" key={day}>
                {days}
            </div>
        );
        return <div className="body">{rows}</div>;
    }
    
    /**
     * Track user's choice in the dropdown, and store the choice 
     * in component's state
     * @param {string} tempDate - user's choice for the date
     */
    onDateClick(tempDate) {
        this.props.history.push('/dailyView/' + tempDate);
    };

    /**
     * Move on to the next week.
     */
    nextWeek = () => {
        this.setState({
            currentWeek: addWeeks(this.state.currentWeek, 1)
        });
        console.log("this is the current week");
        console.log(this.state.currentWeek);
        this.retrieveTasks(addWeeks(this.state.currentWeek, 1));

    };

    /**
     * Move on to the last week.
     */
    prevWeek = () => {
        this.setState({
            currentWeek: subWeeks(this.state.currentWeek, 1)
        });
        this.retrieveTasks(subWeeks(this.state.currentWeek, 1));
    };
    
    render() {
        return (
            <div className="calendar">
            {this.renderHeader()}
            {this.renderDays()}
            {this.renderCells()}
            </div>
        );
    }
  }
  
  export default WeeklyView;