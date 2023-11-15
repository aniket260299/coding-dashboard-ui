import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-chrome';
import { Table } from 'reactstrap';
import Utils from './Utils';

function ViewDashboard() {
    const { index } = useParams();
    const navigate = useNavigate();
    let data = JSON.parse(localStorage.getItem("dashboardList"))[index];

    useEffect(() => {
        if (!Utils.authenticated()) {
            navigate("/auth");
        }
    }, []);

    const getColorByDifficulty = () => {
        const level = data.difficulty;
        let color;

        if (level === 1) color = 'green';
        else if (level === 2) color = 'orange';
        else color = 'red'

        return color;
    }

    return (
        <>
            {data && <>
                <>
                    <Link to="/dashboards" className="float-end"
                        style={{ textDecoration: 'none', color: 'grey' }}> [ Back ]
                    </Link>
                    <strong>View Dashboard</strong>
                    <hr size="4" color="grey" />
                </>

                <div style={{ width: '50%', float: 'right' }}>
                    <AceEditor
                        mode="java"
                        theme="chrome"
                        value={data.solution}
                        readOnly={true}
                        width="100%"
                        height="600px"
                    />
                </div>

                <div style={{ width: '50%', float: 'left', paddingRight: '20px' }}>
                    <Table height='600px' bordered>
                        <tbody>
                            <tr>
                                <th><p style={{ color: getColorByDifficulty() }}>Title:</p></th>
                                <td>{data.title}</td>
                            </tr>

                            <tr>
                                <th>Links:</th>
                                <td>
                                    {data.link.split(/\r?\n/).map((link, index) =>
                                        <>
                                            <a style={{ textDecoration: 'none', color: '#808000' }}
                                                href={link} target="_blank">{'Link' + (index + 1) + ' '}</a>
                                        </>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <th>Hint:</th>
                                <td>
                                    {data.hint.split(/\r?\n/).map((hint) =>
                                        <>
                                            {hint}
                                            <br></br>
                                        </>
                                    )}</td>
                            </tr>

                            <tr>
                                <th>Notes:</th>
                                <td>
                                    {data.notes.split(/\r?\n/).map((note) =>
                                        <>
                                            {note}
                                            <br></br>
                                        </>
                                    )}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </>}
        </>
    );
}

export default ViewDashboard;