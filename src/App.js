import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'
import Header from './Component/Header';
import ListSheet from './Component/sheet/ListSheet';
import ListTopic from './Component/topic/ListTopic';
import ListProblem from './Component/problem/ListProblem';
import OpenProblem from './Component/problem/OpenDashboard';
import EditProblem from './Component/problem/EditProblem';
import Auth from './Component/auth/Auth';
import { authenticated, isAlive } from './Component/common/Utils';
import './App.css';

const App = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        isAlive().then(response => {
            if (response?.data && authenticated()) {
                sessionStorage.clear();
                setLoading(false);
            } else {
                navigate('/auth');
                setLoading(false);
            }
        }).catch(err => {
            console.log("error in isAlive: " + err);
            setLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (loading ? <div className="loading-spinner"></div> : <>
        <Header />
        <div style={{ padding: '20px 30px' }}>
            <Routes>
                <Route path="/" element={<ListSheet />} />
                <Route path="/topic/:sheetId/:sheet" element={<ListTopic />} />
                <Route path="/problem/:sheetId/:topicId/:sheet/:topic" element={<ListProblem />} />
                <Route path="/problem/open/:sheetId/:topicId/:problemId/:sheet/:topic" element={<OpenProblem />} />
                <Route path="/problem/edit/:sheetId/:topicId/:problemId/:sheet/:topic" element={<EditProblem />} />
                <Route path='/auth' element={<Auth />} />
            </Routes>
        </div>
    </>
    );
}

export default App;
