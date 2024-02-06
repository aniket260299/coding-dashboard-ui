import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-chrome';
import { Table } from 'reactstrap';
import { authenticated, decodeEscapeCharaters } from '../common/Utils';
import { getProblemById } from './ProblemService';
import { getSessionStorage } from '../common/DataCacheUtil';

function OpenProblem() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const { sheetId, topicId, problemId, sheet, topic } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        !authenticated() && navigate("/auth");
        if (getSessionStorage('problems:' + topicId)) {
            const cachedData = getSessionStorage('problems:' + topicId).filter(a => a.id === Number(problemId));
            setData(cachedData[0]);
        } else {
            setLoading(true);
            getProblemById(problemId).then(response => {
                setLoading(false);
                setData(response.data);
            }).catch(err => {
                console.log("error while fetching problem: " + err);
                setLoading(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getColorByDifficulty = () => {
        const level = data.difficulty;
        let color;

        if (level === 1) color = '#33CCCC';
        else if (level === 2) color = 'orange';
        else color = 'red'

        return color;
    }

    return (loading ? <div className="loading-spinner"></div> :
        <>
            {data && <>
                <Link to="/" style={{ textDecoration: 'none', color: 'blue' }}><strong>Sheets</strong></Link>
                <Link to={"/topic/" + sheetId + "/" + sheet} style={{ textDecoration: 'none', color: 'blue' }}><strong>{" / " + decodeEscapeCharaters(sheet)}</strong></Link>
                <Link to={"/problem/" + sheetId + "/" + topicId + "/" + sheet + "/" + topic} style={{ textDecoration: 'none', color: 'blue' }}><strong>{" / " + decodeEscapeCharaters(topic)}</strong></Link> /
                <strong style={{ color: getColorByDifficulty() }}>{(" " + data.title) || (data.title.length === 0 && ' null')}</strong>
                <hr size="4" color="grey" />
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
                        </tbody>
                    </Table>
                </div>
            </>}
        </>
    );
}

export default OpenProblem;