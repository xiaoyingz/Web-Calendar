
import React from "react";
import {withRouter} from 'react-router-dom';
import {format, startOfWeek, addDays, 
    isSameDay, subWeeks, addWeeks, parse} from "date-fns";
import { Link } from "react-router-dom";

/**
 * Component for rendering weekly overview page.
 */
class WeeklyView extends React.Component {
    state = {
      selectedDate: new Date(),
      currentWeek: new Date()
    };
  
    /**
     * Rendering the header, including prev & next month buttons,
     * and the year-month information.
     */
    renderHeader() {
        const dateFormat = "yyyy-MM Io";
    
        return (
          <div className="header row flex-middle">
            <div className="col col-start">
              <div className="icon" onClick={this.prevWeek}>
                chevron_left
              </div>
            </div>
            <div className="col col-center">
              <span>{format(this.state.currentWeek, dateFormat) + " Week"}</span>
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
        const rows = [];

        let days = [];
        let day = weekStart;
        let formattedDate = "";

        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, dateFormat);
            const cloneDay = day;
            days.push(
                <div
                className={`col cell_week ${
                    isSameDay(day, selectedDate) ? "selected" : ""
                }`}
                key={day}
                onClick={this.onDateClick}
                >
                <span className="number">{formattedDate}</span>
                <div> task1 </div>
                <div> task2 </div>
                <div> task3 </div>
                <div> task4 </div>
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
    //TODO:
    onDateClick = () => {
        this.props.history.push('/dailyView');
    };

    /**
     * Move on to the next week.
     */
    nextWeek = () => {
        this.setState({
            currentWeek: addWeeks(this.state.currentWeek, 1)
        });
    };

    /**
     * Move on to the last week.
     */
    prevWeek = () => {
        this.setState({
            currentWeek: subWeeks(this.state.currentWeek, 1)
        });
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