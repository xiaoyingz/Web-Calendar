import http from '../http-common';

class SummaryService {
    findTodaySummary(date) {
        return http.get(`/summary/id?id=${date}`);
    }
}

export default new SummaryService();