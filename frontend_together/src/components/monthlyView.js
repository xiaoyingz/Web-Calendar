
import React from "react";
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
      selectedDate: new Date()
    };
  
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

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                let tempDate=""
                formattedDate = format(day, dateFormat);
                tempDate = format(day, tempDateFormate);
                const cloneDay = day;
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
                    <div >tasks</div>
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

    //TODO:
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
    };

    /**
     * Back to the last month.
     */
    prevMonth = () => {
        this.setState({
            currentMonth: subMonths(this.state.currentMonth, 1)
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
  
  export default MonthlyView;