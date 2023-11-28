import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
import { getRevisionNotes, authenticated } from '../common/Utils';
import { getProblemById, addProblem, updateProblem } from './ProblemService';
import { getSessionStorage, updateSessionStorage } from '../common/DataCacheUtil';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-chrome';

const EditProblem = () => {
    const { sheetId, topicId, problemId, sheet, topic } = useParams();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState();
    const navigate = useNavigate();

    const initialFormState = {
        position: 0 - problemId,
        title: '',
        difficulty: '',
        link: '',
        hint: '',
        notes: getRevisionNotes(),
        solution: '',
        topicId: topicId
    };

    useEffect(() => {
        !authenticated() && navigate("/auth");
        if (problemId <= 0) {
            setForm(initialFormState);
        } else {
            if (getSessionStorage('problems:' + topicId)) {
                const cachedData = getSessionStorage('problems:' + topicId).filter(a => a.id === Number(problemId));
                setForm(cachedData[0]);
            } else {
                setLoading(true);
                getProblemById(problemId).then(response => {
                    setForm(response.data);
                    setLoading(false);
                }).catch(err => {
                    console.log("error while fetching problem: " + err);
                    setLoading(false);
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm({ ...form, [name]: value })
    }

    const validateForm = () => {
        if (isNaN(form.difficulty) || form.difficulty < 1 || form.difficulty > 3) {
            alert('Please enter difficulty in integer between [1-3]');
            setForm({ ...form, difficulty: '' });
            return false;
        }
        return true;
    }

    const processBackendResponse = (id, data) => {
        if (getSessionStorage('problems:' + topicId)) {
            let problems = getSessionStorage('problems:' + topicId).filter(a => a.id !== id);
            problems.push(data);
            updateSessionStorage('problems:' + topicId, problems);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            setLoading(true);
            if (form.id) {
                setLoading(true);
                updateProblem(form).then((response) => {
                    processBackendResponse(form.id, response.data);
                    setLoading(false);
                    navigate("/problem/" + sheetId + "/" + topicId + "/" + sheet + "/" + topic);
                }).catch(err => {
                    setLoading(false);
                    console.log("error while updating problem: " + err);
                });
            } else {
                setLoading(true);
                addProblem(form).then((response) => {
                    processBackendResponse(-1, response.data);
                    setLoading(false);
                    navigate("/problem/" + sheetId + "/" + topicId + "/" + sheet + "/" + topic);
                }).catch(err => {
                    setLoading(false);
                    console.log("error while updating problem: " + err);
                });
            }
        }
    }

    const title = <strong>{problemId === '-1' ? 'Add Problem' : 'Edit Problem'}</strong>;

    return (loading ? <div className="loading-spinner"></div> : form &&
        <div>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Button className="float-end" type="submit">Save</Button>
                </FormGroup>
                <Link to={"/problem/" + sheetId + "/" + topicId + "/" + sheet + "/" + topic} className="float-end" style={{ textDecoration: 'none', color: 'black', paddingRight: '10px', paddingLeft: '10px' }}>Problems</Link>
                <Link to={"/topic/" + sheetId + "/" + sheet} className="float-end" style={{ textDecoration: 'none', color: 'black', paddingLeft: '10px' }}>Topics</Link>
                <Link to="/" className="float-end" style={{ textDecoration: 'none', color: 'black', paddingLeft: '10px' }}>Sheets</Link>
                {title}
                <hr size="4" color="grey" />
                <div style={{ width: '50%', float: 'right' }}>
                    <FormGroup>
                        <Label for="solution">Solution</Label>
                        <AceEditor
                            mode="java"
                            theme="chrome"
                            id="solution"
                            value={form.solution || ''}
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
                        <Input type="text" placeholder="Please enter question's title" name="title" id="title" value={form.title || ''}
                            onChange={handleChange} autoComplete="title" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="link">Link</Label>
                        <Input type="textarea" placeholder="Please enter link. Multiple links can be added in new line." name="link" id="link" value={form.link || ''}
                            onChange={handleChange} autoComplete="link" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="hint">Hint</Label>
                        <Input type="textarea" placeholder="Please enter hints." name="hint" id="hint" value={form.hint || ''}
                            onChange={handleChange} autoComplete="hint" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="difficulty">Difficulty</Label>
                        <Input type="text" placeholder="Please enter difficulty in integer between [1-3]" name="difficulty" id="difficulty" value={form.difficulty || ''}
                            onChange={handleChange} autoComplete="difficulty" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="notes">Notes</Label>
                        <Input type="textarea" placeholder="Please enter notes." name="notes" id="notes" value={form.notes || ''}
                            onChange={handleChange} autoComplete="notes" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="position">Position</Label>
                        <Input type="text" placeholder="Please enter position" name="position" id="position" value={form.position || ''}
                            onChange={handleChange} autoComplete="position" />
                    </FormGroup>
                </div>
            </Form>
        </div>
    )
};

export default EditProblem;