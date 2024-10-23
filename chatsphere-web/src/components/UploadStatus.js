import React, { useState } from 'react';
import { uploadStatus } from '../services/api';

const UploadStatus = () => {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);
    
    try {
      const response = await uploadStatus(formData);
      setStatus(response.message);
    } catch (err) {
      setStatus('Failed to upload image');
    }
  };

  return (
    <div>
      <h2>Upload Status</h2>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default UploadStatus;
