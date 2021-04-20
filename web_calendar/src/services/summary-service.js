import http from '../http-common';

class SummaryService {
    findTodaySummary(date) {
        return http.get(`/summary/id?id=${date}`);
    }

    editSummary(id, data) {
        return http.put(`/summary?id=${id}`, data);
    }

    createSummary(data) {
        return http.post(`/summary`, data);
    }
}

export default new SummaryService();