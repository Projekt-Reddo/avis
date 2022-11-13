import axios from "api/api-instance";

const apiRoute = "/reports";

export const getReportApi = async (filter: ReportFilter) => {
    const res = await axios.post(`${apiRoute}/filter`, filter);

    return res.data;
};

export const createReportApi = async (reportCreate: ReportCreate) => {
    const res = await axios.post(apiRoute, reportCreate);

    return res.data;
};

export const confirmReportsApi = async (reportConfirm: ReportConfirm) => {
    const res = await axios.put(apiRoute, reportConfirm);

    return res.data;
};

export const getReportDetailApi = async (id: string) => {
    const res = await axios.post(`${apiRoute}/${id}`);

    return res.data;
};
