
import React from "react";
import TaskService from '../services/task-service';

//new package
import {format, startOfWeek, addDays, 
    startOfMonth, endOfMonth, endOfWeek,
    isSameMonth, isSameDay, parse, addMonths, subMonths} from "date-fns";

/**
 * Component for rendering monthly overview page.
 */
class MonthlyView extends React.Component {
    state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      tasksDayByDay: [],
      moodDayByDay: {}
    };

    /**
     * Fetch all the tasks within the week from databse.
     * @param {string} date - the date to derive the entire month
     */
    async retrieveTasks(date) {
        try {
            console.log(date);
            let dateFormat = "yyyy-MM-dd";
            let startDate = startOfMonth(date);
            startDate = format(startDate, dateFormat);
            let endDate = endOfMonth(date);
            endDate = format(endDate, dateFormat);
            console.log(startDate);
            console.log(endDate);
            let response = await TaskService.findMonthlyTasks(startDate, endDate);
            let tasks = await response.data;
            console.log(tasks);
            this.setState({
                tasksDayByDay: tasks
            })
        } catch(err) {
            console.log(err);
            this.setState({
                taskMessage: 'Click add to create a new task.'
            })
        }
    }

    /**
     * Get the number of tasks for a specific date
     * @param {string} date - the current date
     */
    findTasksAmount(date) {
        return this.state.tasksDayByDay[date];
    }

    componentDidMount() {
        this.retrieveTasks(this.state.currentMonth);
    }

  
    /**
     * Rendering the header, including prev & next month buttons,
     * and the year-month information.
     */
    renderHeader() {
        const dateFormat = "yyyy-MM";
    
        return (
          <div className="header row flex-middle">
            <div className="col col-start">
              <div className="icon" onClick={this.prevMonth}>
                chevron_left
              </div>
            </div>
            <div className="col col-center">
              <span>{format(this.state.currentMonth, dateFormat)}</span>
            </div>
            <div className="col col-end" onClick={this.nextMonth}>
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

        let startDate = startOfWeek(this.state.currentMonth);

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
     * number of tasks and mood.
     */
    renderCells() {
        const { currentMonth, selectedDate } = this.state;
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const tempDateFormate = "yyyy-MM-dd";
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";

        console.log("this is the data");
        console.log(this.state.tasksDayByDay);
        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                let tempDate=""
                formattedDate = format(day, dateFormat);
                tempDate = format(day, tempDateFormate);
                const cloneDay = day;

                let amount = 0;
                amount = this.findTasksAmount(tempDate);
                days.push(
                    <div
                    className={`col cell ${
                        !isSameMonth(day, monthStart)
                        ? "disabled"
                        : isSameDay(day, selectedDate) ? "selected" : ""
                    }`}
                    key={day}
                    onClick={() => this.onDateClick(tempDate)}
                    >
                    <span className="number">{formattedDate}</span>
                    <div >tasks: {amount}</div>
                    <div >mood</div>
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
            days = [];
        }
        return <div className="body">{rows}</div>;
    }

    /**
     * Redirect to the daily view
     * @param {string} tempDate - the day to redirect
     */
    onDateClick = (tempDate) => {
        this.props.history.push('/dailyView/' + tempDate);
    };

    /**
     * Move on to the next month.
     */
    nextMonth = () => {
        this.setState({
            currentMonth: addMonths(this.state.currentMonth, 1)
        });
        this.retrieveTasks(addMonths(this.state.currentMonth, 1));
    };

    /**
     * Back to the last month.
     */
    prevMonth = () => {
        this.setState({
            currentMonth: subMonths(this.state.currentMonth, 1)
        });
        this.retrieveTasks(subMonths(this.state.currentMonth, 1));
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
  
  export default MonthlyView;