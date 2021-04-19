import http from '../http-common';

class TaskService {
    findTodayTask(date) {
        return http.get(`task?date=${date}`);
    }
}

export default new TaskService();