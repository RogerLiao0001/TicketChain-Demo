// src/components/CoinStake.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const initialEvents = [
  { eventId: 101, eventName: '五月天演唱會', date: '2025-01-10', location: '台北小巨蛋' },
  { eventId: 102, eventName: 'BLACKPINK演唱會', date: '2025-01-15', location: '高雄巨蛋' },
  { eventId: 103, eventName: '張惠妹演唱會', date: '2025-02-01', location: '台中市圓滿戶外劇場' }
];

function CoinStake({ isAuthenticated }) {
  const [userData, setUserData] = useState(null);
  const [userStakes, setUserStakes] = useState([]);
  const [eventInputs, setEventInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 存各個eventId的抽選結果 { [eventId]: {seatsCount, totalParticipants, orderNumber, gotTicket, message} }
  const [drawResults, setDrawResults] = useState({});
  // 存各個eventId的投注狀態 { [eventId]: {participantCount, seatsCount, minimalWinPoints} }
  const [stakeInfo, setStakeInfo] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('未登入');

      const userRes = await axios.get('/api/user-data', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (userRes.data.success) {
        setUserData(userRes.data.user);
      } else {
        throw new Error(userRes.data.message);
      }

      // 取得用戶投注資料
      const stakeRes = await axios.get('/api/user-stakes', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (stakeRes.data.success) {
        setUserStakes(stakeRes.data.stakedEvents);
      } else {
        throw new Error(stakeRes.data.message);
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    } else {
      setLoading(false);
      setError('未登入');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const inputs = {};
    initialEvents.forEach(ev => {
      const stake = userStakes.find(s => s.eventId === ev.eventId);
      inputs[ev.eventId] = stake ? stake.stakedPoints : '';
    });
    setEventInputs(inputs);
  }, [userStakes]);

  const handleChange = (eventId, value) => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) return; 
    if (userData && numericValue > userData.points) {
      alert('投注量不可超過目前持有點數');
      return;
    }

    setEventInputs(prev => ({ ...prev, [eventId]: numericValue }));
  };

  const handleStake = async (eventInfo) => {
    if (!userData) {
      alert('尚未登入');
      return;
    }
    const { eventId, eventName } = eventInfo;
    const amount = eventInputs[eventId];

    if (amount === '' || amount == null) {
      alert('請輸入投注點數');
      return;
    }

    if (amount < 0) {
      alert('投注點數不可小於0');
      return;
    }

    const confirmMsg = `您確定要對「${eventName}」投注 ${amount} 點嗎？`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/stake', {
        eventId,
        eventName,
        amount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('投注成功');
      await fetchUserData();
    } catch (err) {
      console.error(err);
      alert(err.message || '投注失敗');
    }
  };

  // 查看抽選結果
  const handleCheckDrawResult = async (eventInfo) => {
    const { eventId } = eventInfo;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/getUserDrawResult?eventId=${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const dr = res.data.drawResult;
        if (!dr || dr.orderNumber == null) {
          alert(res.data.message || '抽選尚未完成或您未參與');
          setDrawResults(prev => ({ ...prev, [eventId]: null }));
        } else {
          const message = `總開放人數: ${dr.seatsCount} 抽選順位: ${dr.orderNumber} 是否獲得票券: ${dr.gotTicket ? '是' : '否'}`;
          setDrawResults(prev => ({ ...prev, [eventId]: { ...dr, message } }));
          alert('已取得抽選結果');
        }
      } else {
        alert(res.data.message || '取得抽選結果失敗');
      }
    } catch (err) {
      console.error(err);
      alert('取得抽選結果失敗:' + (err.message || ''));
    }
  };

  // 查看目前投注狀態
  const handleCheckStakeInfo = async (eventInfo) => {
    const { eventId } = eventInfo;
    try {
      const res = await axios.get(`/api/getEventStakeInfo?eventId=${eventId}`);
      if (res.data.success) {
        const { participantCount, seatsCount, minimalWinPoints } = res.data;
        setStakeInfo({ eventId, participantCount, seatsCount, minimalWinPoints });
        alert(`總投注人數: ${participantCount}, 座位數: ${seatsCount}, 最低可中選點數: ${minimalWinPoints}`);
      } else {
        alert(res.data.message || '取得投注狀態失敗');
      }
    } catch (err) {
      console.error(err);
      alert('取得投注狀態錯誤:' + (err.message || ''));
    }
  };

  if (loading) return <div>載入中...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="coinstake-container">
      <h2>投注演唱會</h2>
      <p>您的點數: {userData?.points}</p>
      <div className="events-list">
        {initialEvents.map(ev => (
          <div key={ev.eventId} className="event-item">
            <h3>{ev.eventName}</h3>
            <p>日期: {ev.date}</p>
            <p>地點: {ev.location}</p>
            <div className="stake-input">
              <label>
                投注點數:
                <input 
                  type="number"
                  value={eventInputs[ev.eventId] ?? ''}
                  onChange={(e) => handleChange(ev.eventId, e.target.value)}
                  placeholder="輸入投注點數"
                />
              </label>
              <button onClick={() => handleStake(ev)}>確認投注</button>
              <button onClick={() => handleCheckDrawResult(ev)}>查看抽選結果</button>
              <button onClick={() => handleCheckStakeInfo(ev)}>查看目前投注狀態</button>
            </div>

            {drawResults[ev.eventId] && (
              <div className="draw-result">
                <h4>抽選結果</h4>
                <p>{drawResults[ev.eventId].message}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {stakeInfo && (
        <div className="stake-info">
          <h3>投注狀態</h3>
          <p>事件ID: {stakeInfo.eventId}</p>
          <p>總投注人數: {stakeInfo.participantCount}</p>
          <p>座位數: {stakeInfo.seatsCount}</p>
          <p>最低可中選點數: {stakeInfo.minimalWinPoints}</p>
        </div>
      )}
    </div>
  );
}

export default CoinStake;
