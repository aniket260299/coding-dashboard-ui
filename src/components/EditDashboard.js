import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import DashboardService from '../service/DashboardService';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-chrome';

const EditDashboard = () => {
    const initialFormState = {
        id: '',
        title: '',
        solution: '',
        hint: '',
        notes: '',
        link: '',
        difficulty: '',
        tags: '',
        date_created: '',
        date_updated: '',
        username: ''
    };

    const [dashboard, setDashboard] = useState(initialFormState);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { index } = useParams();
    const dashboardList = JSON.parse(localStorage.getItem("dashboardList"));

    useEffect(() => {
        index === '-1' ? setDashboard(initialFormState) : setDashboard(dashboardList[index]);
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target
        setDashboard({ ...dashboard, [name]: value })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let currentTime = new Date().getTime();
        dashboard.date_updated = currentTime;
        dashboard.id ? dashboard.date_updated = currentTime : dashboard.date_created = currentTime;
        const response = dashboard.id ? DashboardService.updateDashboard(dashboard) : DashboardService.addDashboard(dashboard);
        setLoading(true);
        response.then(result => {
            setDashboard(initialFormState);
            index === "-1" ? dashboardList.push(result.data) : dashboardList[index] = result.data;
            localStorage.setItem("dashboardList", JSON.stringify(dashboardList));
            setLoading(false);
            navigate('/dashboards/');
        });
    }

    const title = <h2>{index === '-1' ? 'Add Dashboard' : 'Edit Dashboard'}</h2>;

    if (loading) {
        return (
            <div className="loading-spinner"></div>
        );
    }

    return (
        <div>
            <div className="float-end">
                <Button color="secondary" tag={Link} to="/dashboards">Back</Button>
            </div>
            {title}
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="title">Title</Label>
                    <Input type="textarea" name="title" id="title" value={dashboard.title || ''}
                        onChange={handleChange} autoComplete="title" />
                </FormGroup>
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
                        height="320px"
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="hint">Hint</Label>
                    <Input type="textarea" name="hint" id="hint" value={dashboard.hint || ''}
                        onChange={handleChange} autoComplete="hint" />
                </FormGroup>
                <FormGroup>
                    <Label for="notes">Notes</Label>
                    <Input type="textarea" name="notes" id="notes" value={dashboard.notes || ''}
                        onChange={handleChange} autoComplete="notes" />
                </FormGroup>
                <FormGroup>
                    <Label for="link">Link</Label>
                    <Input type="textarea" name="link" id="link" value={dashboard.link || ''}
                        onChange={handleChange} autoComplete="link" />
                </FormGroup>
                <FormGroup>
                    <Label for="difficulty">Difficulty</Label>
                    <Input type="text" name="difficulty" id="difficulty" value={dashboard.difficulty || ''}
                        onChange={handleChange} autoComplete="difficulty" />
                </FormGroup>
                <FormGroup>
                    <Label for="tags">Tags</Label>
                    <Input type="textarea" name="tags" id="tags" value={dashboard.tags || ''}
                        onChange={handleChange} autoComplete="tags" />
                </FormGroup>
                <FormGroup>
                    <Button color="primary" type="submit">Save</Button>{' '}
                    <Button color="secondary" tag={Link} to="/dashboards">Cancel</Button>
                </FormGroup>
            </Form>
        </div>
    )
};

export default EditDashboard;