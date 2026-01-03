import axiosInstance, { endpoints } from '@/lib/axios';

const predictionApi = {
  ping: () => {
    return axiosInstance.get(endpoints.model_predict.health_check);
  },

  predictCPA: (payload) => {
    return axiosInstance.post(endpoints.model_predict.predict_cpa, payload);
  }
};

export default predictionApi;