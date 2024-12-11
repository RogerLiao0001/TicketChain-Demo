// src/components/AdminDashboard.js
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserProvider, Contract } from 'ethers';
import contractAbi from './utils/abi.json';
const contractAddress = "0xf38cf078b51DF1e5091b78A8c1997059aD5e5Fd2";

function AdminDashboard({ isAuthenticated }) {
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState('');
  const [seatsCount, setSeatsCount] = useState(20);
  const [eventName, setEventName] = useState('測試活動');
  const [winners, setWinners] = useState([]);
  

  const handleCreateEvent = async () => {
    if (!eventId || !eventName) {
      alert('請輸入 eventId 與 eventName');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post('/api/createEventIfNotExists', {
        eventId, eventName, seatsCount
      });
      if (res.data.success) {
        alert(res.data.message);
      } else {
        alert('建立或查詢Event失敗:' + res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('建立或查詢Event時發生錯誤:' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncParticipants = async () => {
    if (!eventId) {
      alert('請先輸入 eventId');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post('/api/syncParticipantsFromStakes', { eventId });
      if (res.data.success) {
        alert(res.data.message);
      } else {
        alert('同步失敗:' + res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('同步參加者時發生錯誤:' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStartDraw = async () => {
    try {
      if (!eventId) {
        alert('請輸入 eventId');
        return;
      }

      setLoading(true);
      const res = await axios.get(`/api/getParticipantsData?eventId=${eventId}`);
      if (!res.data.success) {
        alert('取得參與者資料失敗');
        setLoading(false);
        return;
      }
      const { addresses, points } = res.data;
      
      if (addresses.length === 0) {
        alert('此場次無人投注或尚未同步參加者');
        setLoading(false);
        return;
      }

      if (!window.ethereum) {
        alert('請安裝MetaMask');
        setLoading(false);
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractAbi, signer);

      // startDraw交易
      const tx = await contract.startDraw(addresses, points);
      await tx.wait();
      alert('抽選交易已送出，請稍後2-3分鐘再查看結果。');
    } catch (error) {
      console.error(error);
      alert('開始抽選過程發生錯誤: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckWinners = async () => {
    try {
      if (!eventId) {
        alert('請先輸入 eventId');
        return;
      }

      setLoading(true);
      if (!window.ethereum) {
        alert('請安裝MetaMask');
        setLoading(false);
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractAbi, signer);

      // getResults 回傳 BigInt要轉換
      const results = await contract.getResults();
      const addressesResult = results[0];
      const pointsResult = results[1].map(x => Number(x));
      const ordersResult = results[2].map(x => Number(x));

      const saveRes = await axios.post('/api/saveDrawResult', {
        eventId,
        result: {
          addresses: addressesResult,
          points: pointsResult,
          orders: ordersResult
        }
      });

      if (saveRes.data.success) {
        alert('結果已儲存到資料庫！');
        setWinners(saveRes.data.winners);
      } else {
        alert('儲存結果失敗:' + saveRes.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('取得結果時發生錯誤:' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGetWinnersFromDB = async () => {
    try {
      if (!eventId) {
        alert('請先輸入 eventId');
        return;
      }

      const res = await axios.get(`/api/getDrawWinners?eventId=${eventId}`);
      if (res.data.success) {
        alert('成功取得贏家列表');
        setWinners(res.data.winners);
      } else {
        alert('取得贏家列表失敗:' + res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('取得贏家列表錯誤:' + (error.message || ''));
    }
  };

  return (
    <div>
      <h2>管理員控制台</h2>
      <div>
        <input 
          type="text" 
          placeholder="輸入Event ID" 
          value={eventId} 
          onChange={e => setEventId(e.target.value)} 
        />
        <input
          type="text"
          placeholder="輸入Event Name"
          value={eventName}
          onChange={e => setEventName(e.target.value)}
        />
        <input
          type="number"
          placeholder="輸入座位數"
          value={seatsCount}
          onChange={e => setSeatsCount(Number(e.target.value))}
        />
        <button onClick={handleCreateEvent} disabled={loading}>
          {loading ? '執行中...' : '建立/確認Event'}
        </button>
        <button onClick={handleSyncParticipants} disabled={loading}>
          {loading ? '執行中...' : '同步參加者'}
        </button>
        <button onClick={handleStartDraw} disabled={loading}>
          {loading ? '執行中...' : '開始抽選'}
        </button>
        <button onClick={handleCheckWinners} disabled={loading}>
          {loading ? '執行中...' : '查看結果(區塊鏈)'}
        </button>
        
        <button onClick={handleGetWinnersFromDB} disabled={loading}>
          {loading ? '執行中...' : '從資料庫取得贏家列表'}
        </button>
      </div>

      {winners.length > 0 && (
        <div>
          <h3>贏家列表</h3>
          <ul>
            {winners.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
