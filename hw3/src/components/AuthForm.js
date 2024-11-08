// src/components/AuthForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AuthForm() {
  const [isRegister, setIsRegister] = useState(true); // 用于切换注册和登录表单
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 切换注册和登录模式
  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  // 提交表单处理函数
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/register' : '/login';
    try {
      const response = await axios.post(endpoint, { username, password });
      // 假设后端返回一个token或用户信息
      console.log('Success:', response.data);
      // 登陆成功后导航到主页
      navigate('/hw3');
    } catch (error) {
      console.error('Error:', error);
      alert('操作失败，请重试');
    }
  };

  return (
    <div className="auth-form">
      <h2>{isRegister ? '注册' : '登录'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>用户名：</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>密码：</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isRegister ? '注册' : '登录'}</button>
      </form>
      <button onClick={toggleForm}>
        {isRegister ? '已有账号？点击登录' : '没有账号？点击注册'}
      </button>
    </div>
  );
}

export default AuthForm;
/*
import React, { useState } from "react";
import './AuthForm.css'; // 引入CSS文件

function AuthForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [gender, setGender] = useState("male");
    const [subjects, setSubjects] = useState({
        english: true,
        maths: false,
        physics: false,
    });
    const [resume, setResume] = useState("");
    const [url, setUrl] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [about, setAbout] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(
            firstName,
            lastName,
            email,
            contact,
            gender,
            selectedOption,
            subjects,
            resume,
            url,
            about
        );
        // Add your form submission logic here
    };

    const handleSubjectChange = (sub) => {
        setSubjects((prev) => ({
            ...prev,
            [sub]: !prev[sub],
        }));
    };

    const handleReset = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setContact("");
        setGender("male");
        setSubjects({
            english: true,
            maths: false,
            physics: false,
        });
        setResume("");
        setUrl("");
        setSelectedOption("");
        setAbout("");
    };

    return (
        <div className="AuthForm">
            <h1>註冊</h1>
            <fieldset>
                <form action="#" method="get">
                    <label htmlFor="firstname">First Name*</label>
                    <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter First Name"
                        required
                    />
                    <label htmlFor="lastname">Last Name*</label>
                    <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter Last Name"
                        required
                    />
                    <label htmlFor="email">Enter Email* </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                    />
                    <label htmlFor="tel">Contact*</label>
                    <input
                        type="tel"
                        name="contact"
                        id="contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Enter Mobile number"
                        required
                    />
                    <label htmlFor="gender">Gender*</label>
                    <input
                        type="radio"
                        name="gender"
                        value="male"
                        id="male"
                        checked={gender === "male"}
                        onChange={(e) => setGender(e.target.value)}
                    />
                    Male
                    <input
                        type="radio"
                        name="gender"
                        value="female"
                        id="female"
                        checked={gender === "female"}
                        onChange={(e) => setGender(e.target.value)}
                    />
                    Female
                    <input
                        type="radio"
                        name="gender"
                        value="other"
                        id="other"
                        checked={gender === "other"}
                        onChange={(e) => setGender(e.target.value)}
                    />
                    Other
                    <label htmlFor="lang">Your best Subject</label>
                    <input
                        type="checkbox"
                        name="lang"
                        id="english"
                        checked={subjects.english === true}
                        onChange={() => handleSubjectChange("english")}
                    />
                    English
                    <input
                        type="checkbox"
                        name="lang"
                        id="maths"
                        checked={subjects.maths === true}
                        onChange={() => handleSubjectChange("maths")}
                    />
                    Maths
                    <input
                        type="checkbox"
                        name="lang"
                        id="physics"
                        checked={subjects.physics === true}
                        onChange={() => handleSubjectChange("physics")}
                    />
                    Physics
                    <label htmlFor="file">Upload Resume*</label>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        onChange={(e) => setResume(e.target.files[0])}
                        placeholder="Enter Upload File"
                        required
                    />
                    <label htmlFor="url">Enter URL*</label>
                    <input
                        type="url"
                        name="url"
                        id="url"
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter url"
                        required
                    />
                    <label>Select your choice</label>
                    <select
                        name="select"
                        id="select"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    >
                        <option value="" disabled selected={selectedOption === ""}>
                            Select your Ans
                        </option>
                        <optgroup label="Beginers">
                            <option value="1">HTML</option>
                            <option value="2">CSS</option>
                            <option value="3">JavaScript</option>
                        </optgroup>
                        <optgroup label="Advance">
                            <option value="4">React</option>
                            <option value="5">Node</option>
                            <option value="6">Express</option>
                            <option value="t">MongoDB</option>
                        </optgroup>
                    </select>
                    <label htmlFor="about">About</label>
                    <textarea
                        name="about"
                        id="about"
                        cols="30"
                        rows="10"
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="About your self"
                        required
                    ></textarea>
                    <button type="reset" value="reset" onClick={handleReset}>
                        Reset
                    </button>
                    <button type="submit" value="Submit" onClick={handleSubmit}>
                        Submit
                    </button>
                </form>
            </fieldset>
        </div>
    );
}

export default AuthForm;
*/