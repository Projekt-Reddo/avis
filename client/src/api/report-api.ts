import axios from "api/api-instance";

const apiRoute = "/reports";

// export const viewReportApi = async () => {
//     const res = await axios.get(apiRoute);

//     return res.data;
// };

export const createReportApi = async (reportCreate: ReportCreate) => {
    const res = await axios.post(apiRoute, reportCreate);

    return res.data;
};
