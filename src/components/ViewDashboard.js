import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-chrome';

function ViewDashboard() {
    const { index } = useParams();
    const navigate = useNavigate();
    let token = localStorage.getItem("jwt-token");
    let data = JSON.parse(localStorage.getItem("dashboardList"))[index];

    useEffect(() => {
        if (!authenticated()) {
            navigate("/auth");
        }
    }, []);

    const authenticated = () => {
        if (token) {
            const now = new Date();
            const expiry = new Date(Number(localStorage.getItem("jwt-token-expiry")));
            if (expiry > now) return true;
        }
        localStorage.clear();
        return false;
    }

    const dateFormat = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };

    return (
        <> {data &&
            <div style={{ wordBreak: 'break-all' }}>
                <div className="float-end">
                    <Button color="secondary" tag={Link} to="/dashboards">Back</Button>
                </div>
                <h2 className="text">View Dashboard</h2>
                <br></br>

                <div><strong>Title: </strong>{data.title}</div>
                <br></br>

                <div><strong> Links: </strong><br></br>
                    {data.link.split(/\r?\n/).map((link) =>
                        <>
                            <a href={link} target="_blank">{link}</a>
                            <br></br>
                        </>
                    )}</div>
                <br></br>

                <div><strong> Difficulty: </strong>{data.difficulty}</div>
                <br></br>

                <div><strong> Tags: </strong>{data.tags}</div>
                <br></br>

                <label> <strong>Solution:</strong></label>
                <div>
                    <AceEditor
                        mode="java"
                        theme="chrome"
                        value={data.solution}
                        readOnly={true}
                        width="100%"
                        height="320px"
                    />
                </div>
                <br></br>

                <div><strong> Date Created: </strong>{new Date(data.date_created).toLocaleString('en-US', dateFormat)}</div>
                <br></br>

                <div><strong> Date Updated: </strong>{new Date(data.date_updated).toLocaleString('en-US', dateFormat)}</div>
                <br></br>

                <div><strong> Notes: </strong><pre>{data.notes}</pre></div>
                <br></br>

                <div><strong> Hint: </strong><pre>{data.hint}</pre></div>
                <br></br>
            </div>}
        </>
    );
}

export default ViewDashboard;