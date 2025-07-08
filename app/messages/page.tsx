'use client';

import { useEffect, useState } from 'react';
import { createMessage, getMessagesBetweenUsers } from '@/lib/api/message'; // Assuming these API calls will be implemented
import { Message } from '@/types/Message'; // Assuming this type will be defined

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Placeholder user IDs - replace with actual user IDs from auth context
  const currentUser = 'USER_ID_1'; 
  const otherUser = 'USER_ID_2'; 

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessagesBetweenUsers(currentUser, otherUser);
        setMessages(data);
      } catch (err) {
        setError('Failed to fetch messages');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUser, otherUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messagePayload = {
        sender_id: currentUser,
        receiver_id: otherUser,
        job_id: null, // Or a specific job ID if contextually relevant
        content: newMessage,
      };
      const createdMessage = await createMessage(messagePayload);
      setMessages((prevMessages) => [...prevMessages, createdMessage]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading messages...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <p>No messages yet. Start a conversation!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`mb-2 ${msg.sender_id === currentUser ? 'text-right' : 'text-left'}`}>
              <span className="inline-block bg-gray-200 rounded-lg px-3 py-1">
                {msg.content}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.created_at).toLocaleString()} - {msg.sender_id === currentUser ? 'You' : 'Other User'}
              </p>
            </div>
          ))
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow border rounded-lg p-2 mr-2"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagesPage;