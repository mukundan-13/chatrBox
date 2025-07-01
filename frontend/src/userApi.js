import axiosInstance from "./axiosInstance";

export const registerUser = async (data) => {
  try {
    const response = await axiosInstance.post("/api/auth/register", data);
    return response.data;
  } catch (error) {
    console.error(
      "Registration API Error:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : error;
  }
};

export const sendOtp = async (data) => {
  try {
    const response = await axiosInstance.post("/api/auth/send-otp", data);
    return response.data;
  } catch (error) {
    console.error(
      "Otp Sending API Error:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : error;
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await axiosInstance.post("/api/auth/verify-otp", data);
    return response.data;
  } catch (error) {
    console.error(
      "Otp Verification API Error:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : error;
  }
};

export const updateUser = async (data) => {
  try {
    const response = await axiosInstance.put("/api/users/profile", data);
    return response.data;
  } catch (error) {
    console.error(
      "Profile Update API Error:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : error;
  }
};

export const getChatRooms = async () => {
  try {
    const response = await axiosInstance.get("/api/chat/rooms");
    return response.data;
  } catch (error) {
    console.error(
      "Chat Rooms Fetching API Error:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : error;
  }
};

export const getUserByPhoneNumber = async (phoneNumber) => {
  try {
    const response = await axiosInstance.get(
      `/api/users/by-phone/${phoneNumber}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Get User By Phone Number API Error for ${phoneNumber}:`,
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : error;
  }
};

export const createChatRoom = async (data) => {
  try {
    const response = await axiosInstance.post("/api/chat/rooms", data);
    return response.data;
  } catch (error) {
    console.error(
      "Chat Rooms Creating API Error:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : error;
  }
};

export const getChatMessages = async (chatId) => {
  try {
    const response = await axiosInstance.get(
      `/api/chat/rooms/${chatId}/messages`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Chat Room Message Getting API Error:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : error;
  }
};

export const getLatestChat = async (chatId) => {
  try {
    const response = await axiosInstance.get(
      `/api/chat/rooms/${chatId}/latest`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Chat Room Latest Message Getting API Error:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : error;
  }
};
