import configuredAxios from '@/config/axios';

const patchHandler = async (URL: string, formData: object, type: string = 'application/json') => {
  const headers = {
    'Content-Type': type,
  };

  const response: any = {
    status: 0,
    data: {},
    statusCode: 400,
  };

  await configuredAxios
    .patch(URL, formData, { headers })
    .then(res => {
      response.status = 1;
      response.data = res.data;
      response.statusCode = res.status;
    })
    .catch(err => {
      response.status = 0;
      response.data = err.response?.data || '';
      response.statusCode = 500;
    });
  return response;
};

export default patchHandler;
