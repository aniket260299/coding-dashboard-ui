import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'reactstrap';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-chrome';

function ViewDashboard() {
    const { data } = useLocation().state;

    return (
        <div>
            <div className="float-end">
                <Button color="secondary" tag={Link} to="/dashboards">Back</Button>
            </div>
            <h2 className="text">View Dashboard</h2>
            <br></br>
            <label> Title: </label>
            <div> {data.title}</div>
            <label> Solution: </label>
            <div>
                <AceEditor
                    mode="java"
                    theme="chrome"
                    value={data.solution}
                    readOnly="true"
                    width="100%"
                    height="320px"
                />
            </div>
            <label> Difficulty: </label>
            <div> {data.difficulty}</div>
        </div>
    );
}

export default ViewDashboard;