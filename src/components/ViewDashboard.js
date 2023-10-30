import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-chrome';
import { Table } from 'reactstrap';

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

    const [hideItems, setHideItems] = useState(true);
    const toggleHideItems = () => setHideItems(!hideItems);

    return (
        <> {data && <>
            <>
                <Link to="/dashboards" className="float-end"
                    style={{ textDecoration: 'none', color: 'grey' }}> [ Back ]
                </Link>
                <Link className="float-end" onClick={toggleHideItems}
                    style={{ textDecoration: 'none', color: 'black' }}> [ {hideItems ? 'Show Items' : 'Hide Items'} ]
                </Link>
                <strong>View Dashboard</strong>
                <hr size="4" color="grey" />
            </>

            <div style={{ width: '50%', float: 'right' }}>
                <AceEditor
                    mode="java"
                    theme="chrome"
                    value={hideItems ? 'HIDDEN' : data.solution}
                    readOnly={true}
                    width="100%"
                    height="600px"
                />
            </div>

            <div style={{ width: '50%', float: 'left', paddingRight: '20px' }}>
                <Table height='600px' bordered>
                    <tr>
                        <th>Title:</th>
                        <td>{data.title}</td>
                    </tr>

                    <tr>
                        <th>Difficulty:</th>
                        <td>{" " + data.difficulty}</td>
                    </tr>

                    <tr>
                        <th>Links:</th>
                        <td>
                            {data.link.split(/\r?\n/).map((link) =>
                                <>
                                    <a style={{ textDecoration: 'none', color: '#808000' }}
                                        href={link} target="_blank">{link}</a>
                                    <br></br>
                                </>
                            )}
                        </td>
                    </tr>

                    <tr>
                        <th>Notes:</th>
                        <td>
                            {hideItems ? 'HIDDEN' : data.notes.split(/\r?\n/).map((note) =>
                                <>
                                    {note}
                                    <br></br>
                                </>
                            )}</td>
                    </tr>

                    <tr>
                        <th>Hint:</th>
                        <td>
                            {hideItems ? 'HIDDEN' : data.hint.split(/\r?\n/).map((hint) =>
                                <>
                                    {hint}
                                    <br></br>
                                </>
                            )}</td>
                    </tr>

                    <tr>
                        <th>Tags:</th>
                        <td>{data.tags.split(",").map(tag => <>{tag + " "}</>)}</td>
                    </tr>

                    <tr>
                        <th>Date Updated:</th>
                        <td>{new Date(data.date_updated).toLocaleString('en-US', dateFormat)}</td>
                    </tr>

                    <tr>
                        <th>Date Created:</th>
                        <td>{new Date(data.date_created).toLocaleString('en-US', dateFormat)}</td>
                    </tr>

                </Table>
            </div>
        </>}
        </>
    );
}

export default ViewDashboard;