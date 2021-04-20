import http from '../http-common';

class TaskService {
    findTodayTask(date) {
        return http.get(`task/date?date=${date}`);
        // return http.get(`task?date=${date}`);
    }

    findWeeklyTasks(startDate, endDate) {
        return http.get(`task/weeklyTasks?start=${startDate}&end=${endDate}`);
    }

    findMonthlyTasks(startDate, endDate) {
        return http.get(`task/monthlyTasks?start=${startDate}&end=${endDate}`);
    }
}

export default new TaskService();
