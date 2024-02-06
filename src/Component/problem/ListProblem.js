import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProblemsByTopicId, deleteProblem } from "./ProblemService"
import { AgGridReact } from "ag-grid-react";
import { authenticated, decodeEscapeCharaters, getNextPosition } from "../common/Utils";
import { setSessionStorage, getSessionStorage, updateSessionStorage } from "../common/DataCacheUtil";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const ListProblem = () => {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { sheetId, topicId, sheet, topic } = useParams();
    const gridRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (authenticated()) {
            if (getSessionStorage('problems:' + topicId)) {
                setRowData(getSessionStorage('problems:' + topicId));
            } else {
                setLoading(true);
                getProblemsByTopicId(topicId).then(response => {
                    setRowData(response.data);
                    setSessionStorage('problems:' + topicId, response.data);
                    setLoading(false);
                }).catch(err => {
                    console.log("error while fetching problems: " + err);
                    setLoading(false);
                });
            }
        } else {
            navigate('/auth');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const remove = (param) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (!confirmDelete) return;
        setLoading(true);
        deleteProblem(param.data.id).then(() => {
            const updatedList = [...rowData].filter(a => a.id !== param.data.id);
            setRowData(updatedList);
            updateSessionStorage('problems:' + topicId, updatedList);
            setLoading(false);
        }).catch(err => {
            console.log("error while deleting problem from DB: " + err);
            setLoading(false);
        });
    };

    // Below Code is for AG-Grid
    const getRowId = useMemo(() => {
        return (params) => {
            return params.data.position;
        };
    }, []);

    const Action = (param) => {
        const suffix = sheetId + "/" + topicId + "/" + param.data.id + "/" + sheet + "/" + topic;
        return <>
            <Link to={"/problem/open/" + suffix} style={{ textDecoration: 'none', color: 'green' }}> Open </Link>
            <Link to={"/problem/edit/" + suffix} style={{ textDecoration: 'none', color: 'blue', padding: '10%' }}> Edit </Link>
            <Link onClick={() => remove(param)} style={{ textDecoration: 'none', color: 'red' }}> Delete </Link>
        </>
    }

    const Title = (item) => {
        return (
            <a style={{ textDecoration: 'none', color: '#36454F' }}
                href={item.data.link.split(/\r?\n/)[0]} target="_blank">{item.data.title}</a>
        );
    }

    const Difficulty = (item) => {
        const level = item.data.difficulty;
        let difficulty, color;
        if (level === 1) {
            difficulty = 'Easy';
            color = '#33CCCC';
        }
        else if (level === 2) {
            difficulty = 'Medium';
            color = 'orange';
        }
        else {
            difficulty = 'Hard'
            color = 'red'
        }

        return <>
            <p style={{ color: color }}>{difficulty}</p >
        </>
    }

    const gridOptions = {
        columnDefs: [
            { headerName: '#', field: 'position', sort: 'asc' },
            { headerName: 'Title', cellRenderer: Title, flex: 1 },
            { headerName: 'Difficulty', cellRenderer: Difficulty },
            {
                headerName: 'Action',
                cellRenderer: Action,
                editable: false
            }
        ],

        defaultColDef: {
            suppressMovable: true,
            resizable: true,
        }
    }

    return (<>
        {loading ? <div className="loading-spinner"></div> :
            <>
                <>
                    <Link to={"/problem/edit/" + sheetId + "/" + topicId + "/" + (0 - getNextPosition(rowData)) + "/" + sheet + "/" + topic} className="float-end" style={{ textDecoration: 'none', color: 'black', paddingLeft: '10px' }}>Add Record</Link>
                    <Link to={"/topic/" + sheetId + "/" + sheet} className="float-end" style={{ textDecoration: 'none', color: 'black', paddingLeft: '10px' }}>Topics</Link>
                    <Link to="/" className="float-end" style={{ textDecoration: 'none', color: 'black', paddingLeft: '10px' }}>Sheets</Link>
                    <strong>{decodeEscapeCharaters(sheet) + " / " + decodeEscapeCharaters(topic)}</strong>
                    <hr size="4" color="grey" />
                </>

                <div className="ag-theme-alpine" style={{ height: 600 }}>
                    <AgGridReact
                        ref={gridRef}
                        popupParent={document.body}
                        rowData={rowData}
                        columnDefs={gridOptions.columnDefs}
                        defaultColDef={gridOptions.defaultColDef}
                        suppressMenuHide={true}
                        animateRows={true}
                        getRowId={getRowId}
                    />
                </div>
            </>
        }</>
    );
}

export default ListProblem;