import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [receivedKudos, setReceivedKudos] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [remaining, setRemaining] = useState(3);

  useEffect(() => {
    API.get('/user/me/').then(res => setUser(res.data));
    API.get('/user/').then(res => setUsers(res.data));
    API.get('/kudos/remaining/').then(res => setRemaining(res.data.remaining));
    API.get('/kudos/received/').then(res => setReceivedKudos(res.data));
  }, []);

  const giveKudos = async () => {
    try {
      await API.post('/kudos/', { receiver_id: receiverId, message });
      alert('Kudos given!');
      setReceiverId('');
      setMessage('');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || 'Error giving kudos.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div className="bg-gray-100 p-4 rounded shadow">
        <p><strong>Logged in as:</strong> {user?.username}</p>
        <p><strong>Organization:</strong> {user?.organization?.name}</p>
        <p><strong>Kudos Remaining:</strong> {remaining}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-2">Give Kudos</h3>
        <select className="border p-2 w-full mb-2" value={receiverId} onChange={e => setReceiverId(e.target.value)}>
          <option value="">-- Select a user --</option>
          {users.filter(u => u.id !== user?.id).map(u => (
            <option key={u.id} value={u.id}>{u.username}</option>
          ))}
        </select>
        <textarea className="border p-2 w-full mb-2" placeholder="Why are you giving kudos?" value={message} onChange={e => setMessage(e.target.value)} />
        <button onClick={giveKudos} disabled={!receiverId || !message || remaining <= 0} className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50">Give Kudos</button>
      </div>

      {/* <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-2">Kudos You've Received</h3>
        {receivedKudos.length === 0 ? <p>No kudos received yet.</p> : receivedKudos.map(k => (
          <div key={k.id} className="border-b py-2">
            <p><strong>From:</strong> {k.sender.username}</p>
            <p><em>{k.message}</em></p>
          </div>
        ))}
      </div> */}

      <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Kudos You've Received</h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {receivedKudos.length === 0 ? (
          <p className="text-gray-500">No kudos yet!</p>
        ) : (
            receivedKudos.map(kudo => (
            <div
              key={kudo.id}
              className="bg-white shadow rounded-lg p-4 border border-gray-100"
            >
              <p className="text-sm text-gray-500">From: <strong>{kudo.sender.username}</strong></p>
              <p className="mt-2 text-gray-800">{kudo.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(kudo.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
    
    </div>
  );
}
