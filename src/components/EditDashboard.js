import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import DashboardService from '../service/DashboardService';
import Utils from './Utils';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-chrome';

const EditDashboard = () => {
    const initialFormState = {
        id: '',
        title: '',
        solution: '',
        hint: '',
        notes: Utils.getRevisionNotes(),
        link: '',
        difficulty: '',
        tags: Utils.getTags(),
        date_created: '',
        date_updated: '',
        username: localStorage.getItem("username")
    };

    const [dashboard, setDashboard] = useState(initialFormState);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { index } = useParams();
    const dashboardList = JSON.parse(localStorage.getItem("dashboardList"));
    let token = localStorage.getItem("jwt-token");

    useEffect(() => {
        if (Utils.authenticated()) {
            index === '-1' ? setDashboard(initialFormState) : setDashboard(dashboardList[index]);
        } else {
            navigate("/auth");
        }
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target
        setDashboard({ ...dashboard, [name]: value })
    }

    const validateForm = () => {
        const tags = dashboard.tags.split(',');
        if (isNaN(dashboard.difficulty) || dashboard.difficulty < 1 || dashboard.difficulty > 3) {
            alert('Please enter difficulty in integer between [1-3]');
            setDashboard({ ...dashboard, difficulty: '' });
            return false;
        } else if (tags.length != 3 || isNaN(tags[2]) || tags[2] <= 0) {
            alert('Please enter tags like "sheet,topic,no." and no. > 0');
            return false;
        }
        return true;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            let currentTime = new Date().getTime();
            dashboard.date_updated = currentTime;
            dashboard.id ? dashboard.date_updated = currentTime : dashboard.date_created = currentTime;
            const response = dashboard.id ? DashboardService.updateDashboard(dashboard, token) : DashboardService.addDashboard(dashboard, token);
            setLoading(true);
            response.then(result => {
                setDashboard(initialFormState);
                index === "-1" ? dashboardList.push(result.data) : dashboardList[index] = result.data;
                localStorage.setItem("dashboardList", JSON.stringify(dashboardList));
                setLoading(false);
                navigate('/dashboards/');
            });
        }
    }

    const title = <strong>{index === '-1' ? 'Add Dashboard' : 'Edit Dashboard'}</strong>;

    if (loading) {
        return (
            <div className="loading-spinner"></div>
        );
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Link to="/dashboards" className="float-end"
                    style={{ textDecoration: 'none', color: 'grey' }}> [ Back ]
                </Link>
                <FormGroup>
                    <button className="float-end" type="submit">[ Save ]</button>
                </FormGroup>
                {title}
                <hr size="4" color="grey" />

                <div style={{ width: '50%', float: 'right' }}>
                    <FormGroup>
                        <Label for="solution">Solution</Label>
                        <AceEditor
                            mode="java"
                            theme="chrome"
                            id="solution"
                            value={dashboard.solution || ''}
                            onChange={data => handleChange({ target: { value: data, name: 'solution' } })}
                            name="solution"
                            autoComplete="solution"
                            editorProps={{ $blockScrolling: true }}
                            width="100%"
                            height="560px"
                        />
                    </FormGroup>
                </div>

                <div style={{ width: '50%', float: 'left', paddingRight: '20px' }}>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input type="textarea" placeholder="Please enter question's title" name="title" id="title" value={dashboard.title || ''}
                            onChange={handleChange} autoComplete="title" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="difficulty">Difficulty</Label>
                        <Input type="text" placeholder="Please enter difficulty in integer between [1-3]" name="difficulty" id="difficulty" value={dashboard.difficulty || ''}
                            onChange={handleChange} autoComplete="difficulty" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="link">Link</Label>
                        <Input type="textarea" placeholder="Please enter link. Multiple links can be added in new line." name="link" id="link" value={dashboard.link || ''}
                            onChange={handleChange} autoComplete="link" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="notes">Notes</Label>
                        <Input type="textarea" placeholder="Please enter notes." name="notes" id="notes" value={dashboard.notes || ''}
                            onChange={handleChange} autoComplete="notes" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="hint">Hint</Label>
                        <Input type="textarea" placeholder="Please enter hints." name="hint" id="hint" value={dashboard.hint || ''}
                            onChange={handleChange} autoComplete="hint" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="tags">Tags</Label>
                        <Input type="text" placeholder="Please enter tags like 'sheet,topic,no.' eg: GFG Sheet,Linked List,1" name="tags" id="tags" value={dashboard.tags || ''}
                            onChange={handleChange} autoComplete="tags" />
                    </FormGroup>
                </div>
            </Form>
        </div>
    )
};

export default EditDashboard;