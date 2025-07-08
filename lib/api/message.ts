
import { Message, MessagePayload } from '@/types/Message';

export const API_BASE_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://localhost:5000';

export const createMessage = async (messageData: MessagePayload): Promise<Message> => {
  const response = await fetch(`${API_BASE_URL}/message/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`, // Add authentication if needed
    },
    body: JSON.stringify(messageData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to send message');
  }

  const data = await response.json();
  return data.message; // Assuming the backend returns the created message object
};

export const getMessagesBetweenUsers = async (user1Id: string, user2Id: string): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/message/messages/between/${user1Id}/${user2Id}`, {
    headers: {
      // 'Authorization': `Bearer ${token}`, // Add authentication if needed
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch messages');
  }

  const data = await response.json();
  return data;
};

export const getMessagesForJob = async (jobId: string): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/message/messages/job/${jobId}`, {
    headers: {
      // 'Authorization': `Bearer ${token}`, // Add authentication if needed
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch messages for job');
  }

  const data = await response.json();
  return data;
};