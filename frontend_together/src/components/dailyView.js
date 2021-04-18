import React,  { Component }  from "react"
import { Link } from "react-router-dom";

export default class DailyView extends Component {

    onClickToMonthly = () => {
        this.props.history.push('/monthlyView');
    };

     render() {
        return (
        <div>
            Daily View Page
        <div>
            <Link to={'/weeklyView'}>
                Back to Weekly View
            </Link>
        </div>
        <Link to={'/monthlyView'}>
            Back to Monthly View
        </Link>
        </div>
        )

    }

}