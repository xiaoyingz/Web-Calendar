import http from '../http-common';

class TaskService {
    findTodayTask(date) {
        return http.get(`/task?date=${date}`);
    }

    findTaskById(id) {
        return http.get(`/task/id?id=${id}`);
    }

    putTaskById(id, data) {
        return http.put(`/task?id=${id}`, data);
    }

    postTask(data) {
        return http.post(`/task`, data);
    }
}

export default new TaskService();