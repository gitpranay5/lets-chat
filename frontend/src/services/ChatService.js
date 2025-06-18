import axios from "axios";
import auth from "../config/firebase";
import { io } from "socket.io-client";

const baseURL = "http://10.224.0.5:30080/api";

const getUserToken = async () => {
  const user = auth.currentUser;
  const token = user && (await user.getIdToken());
  console.log("🔍 User Token:", token);  // ✅ Debugging log
  return token;
};

export const initiateSocketConnection = async () => {
  const token = await getUserToken();
  console.log("🔍 WebSocket Token:", token);  // ✅ Debugging log

  const socket = io("http://10.224.0.5:30080", { auth: { token } });

  socket.on("connect", () => {
    console.log("✅ WebSocket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ WebSocket connection error:", err.message);
  });

  return socket;
};

const createHeader = async () => {
  const token = await getUserToken();

  const payloadHeader = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  console.log("🔍 Header Object:", payloadHeader);  // ✅ Debugging log
  return payloadHeader;
};

export const getAllUsers = async () => {
  const header = await createHeader();

  try {
    const res = await axios.get(`${baseURL}/user`, header);
    console.log("🔍 API Response (Users):", res.data);  // ✅ Debugging log
    return res.data;
  } catch (e) {
    console.error("❌ API Error (getAllUsers):", e);
  }
};

export const getUser = async (userId) => {
  const header = await createHeader();
  try {
    const res = await axios.get(`${baseURL}/user/${userId}`, header);
    console.log("🔍 API Response (User):", res.data);  // ✅ Debugging log
    return res.data;
  } catch (e) {
    console.error("❌ API Error (getUser):", e);
  }
};

export const getUsers = async (users) => {
  const header = await createHeader();
  try {
    console.log("🔍 Request Data (getUsers):", users);  // ✅ Debugging log
    const res = await axios.get(`${baseURL}/user/users`, users, header);
    console.log("🔍 API Response (Users):", res.data);  // ✅ Debugging log
    return res.data;
  } catch (e) {
    console.error("❌ API Error (getUsers):", e);
  }
};

export const getChatRooms = async (userId) => {
  const header = await createHeader();
  try {
    const res = await axios.get(`${baseURL}/room/${userId}`, header);
    console.log("🔍 API Response (ChatRooms):", res.data);  // ✅ Debugging log
    return res.data;
  } catch (e) {
    console.error("❌ API Error (getChatRooms):", e);
  }
};

export const getChatRoomOfUsers = async (firstUserId, secondUserId) => {
  const header = await createHeader();
  try {
    const res = await axios.get(
      `${baseURL}/room/${firstUserId}/${secondUserId}`,
      header
    );
    console.log("🔍 API Response (ChatRoomOfUsers):", res.data);  // ✅ Debugging log
    return res.data;
  } catch (e) {
    console.error("❌ API Error (getChatRoomOfUsers):", e);
  }
};

export const createChatRoom = async (members) => {
  const header = await createHeader();
  try {
    console.log("🔍 Request Data (createChatRoom):", members);  // ✅ Debugging log
    const res = await axios.post(`${baseURL}/room`, members, header);
    console.log("🔍 API Response (createChatRoom):", res.data);  // ✅ Debugging log
    return res.data;
  } catch (e) {
    console.error("❌ API Error (createChatRoom):", e);
  }
};

export const getMessagesOfChatRoom = async (chatRoomId) => {
  const header = await createHeader();
  try {
    const res = await axios.get(`${baseURL}/message/${chatRoomId}`, header);
    console.log("🔍 API Response (MessagesOfChatRoom):", res.data);  // ✅ Debugging log for messages
    return res.data || [];  // ✅ Ensure fallback to empty array
  } catch (e) {
    console.error("❌ API Error (getMessagesOfChatRoom):", e);
    return []; // ✅ Prevents undefined errors
  }
};

export const sendMessage = async (messageBody) => {
  const header = await createHeader();

  try {
    console.log("🔍 Request Data (sendMessage):", messageBody);  // ✅ Debugging log
    const res = await axios.post(`${baseURL}/message`, messageBody, header);
    console.log("🔍 API Response (sendMessage):", res.data);  // ✅ Debugging log
    return res.data;
  } catch (e) {
    console.error("❌ API Error (sendMessage):", e);
  }
};
