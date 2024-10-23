import React, { useState } from 'react';
import { sendMessage } from '../services/api';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async () => {
    try {
      const response = await sendMessage(to, message);
      setStatus(response.message);
    } catch (err) {
      setStatus('Failed to send message');
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Recipient ID" />
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
      <button onClick={handleSend}>Send</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Chat;
