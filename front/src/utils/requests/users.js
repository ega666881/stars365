import axios from '../axios';

export const getUsersReq = async(params) => {
  try {
    const response = await axios.get('/users/get-users', {
        params: params
    });
    return response;

  } catch (err) {
    return err.response;
  }
};


export const createInvoiceReq = async(userId) => {
    try {
      const response = await axios.post('/users/create-invoice', {
          id: userId
      });
      return response;
  
    } catch (err) {
      return err.response;
    }
};

export const takeDayRewardReq = async(userId) => {
    try {
      const response = await axios.post('/users/take-day-reward', {
          id: userId
      });
      return response;
  
    } catch (err) {
      return err.response;
    }
};

export const getBetsValuesReq = async() => {
  try {
    const response = await axios.get('/users/get-bets-values');
    return response;

  } catch (err) {
    return err.response;
  }
};

export const makeBetReq = async(userId, betId) => {
  try {
    const response = await axios.post('/users/bet', {userId: userId, betId: betId});
    return response;

  } catch (err) {
    return err.response;
  }
};

export const getSettingsReq = async() => {
  try {
    const response = await axios.get('/users/get-settings');
    return response;

  } catch (err) {
    return err.response;
  }
};

export const getEveryDayRewardReq = async() => {
  try {
    const response = await axios.get('/users/get-every-day-reward');
    return response;

  } catch (err) {
    return err.response;
  }
};

export const updateUserAvatarReq = async(userId, photo_url) => {
  try {
    const response = await axios.put('/users/update-user-avatar', {
      id: userId,
      photo_url: photo_url
    });
    return response;

  } catch (err) {
    return err.response;
  }
};

export const takeReferalRewardReq = async(userId) => {
  try {
    const response = await axios.post('/users/take-referal-reward', {
      id: userId,
    });
    return response;

  } catch (err) {
    return err.response;
  }
};

export const getTasksReq = async(userId) => {
  try {
    const response = await axios.get(`/users/get-task-user/${userId}`);
    return response;

  } catch (err) {
    return err.response;
  }
};

export const checkTaskUserReq = async(userId, taskId) => {
  try {
    const response = await axios.post(`/users/check-task-user/`, {
      userId: userId,
      taskId: taskId
    });
    return response;

  } catch (err) {
    return err.response;
  }
};

