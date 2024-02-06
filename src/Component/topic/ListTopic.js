import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getTopicsBySheetId, deleteTopic, updateTopic, addTopic } from "./TopicService"
import { AgGridReact } from "ag-grid-react";
import { authenticated, decodeEscapeCharaters, encodeEscapeCharaters, findIndexFromId } from "../common/Utils";
import { setSessionStorage, getSessionStorage, updateSessionStorage } from "../common/DataCacheUtil";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const ListTopic = () => {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const { sheetId, sheet } = useParams();
    const gridRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        !sheetId && navigate("/");
        if (authenticated()) {
            if (getSessionStorage('topics:' + sheetId)) {
                setRowData(getSessionStorage('topics:' + sheetId));
            } else {
                setLoading(true);
                getTopicsBySheetId(sheetId).then(response => {
                    setSessionStorage('topics:' + sheetId, response.data);
                    setRowData(response.data);
                    setLoading(false);
                }).catch(err => {
                    console.log("error while fetching topics: " + err);
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
        let updatedList = [...rowData].filter(a => a.id !== param.data.id);
        if (!param.data.id) {
            setRowData(updatedList);
            return;
        }

        setLoading(true);
        deleteTopic(param.data.id).then(() => {
            updateSessionStorage('topics:' + sheetId, updatedList);
            setRowData(updatedList);
            setLoading(false);
        }).catch(err => {
            console.log("error while deleting topic from DB: " + err);
            setLoading(false);
        });
    };

    const addDummyRecord = () => {
        let newList = [...rowData].sort((a, b) => a.position - b.position);
        if (newList.length - 1 >= 0 && !newList[newList.length - 1].id) return;
        const record = {
            position: newList.length > 0 ? newList[newList.length - 1].position + 1 : 1,
            topic: '',
            sheetId: sheetId
        }
        newList.push(record);
        setRowData(newList);
    };

    const addOrUpdate = (data) => {
        setLoading(true);
        let updatedList = [...rowData];
        if (data.id) {
            updateTopic(data).then(res => {
                updatedList[findIndexFromId(data.id, rowData)] = res.data;
                updateSessionStorage('topics:' + sheetId, updatedList);
                setRowData(updatedList);
                setLoading(false);
                setEditing(false);
            }).catch(err => {
                setLoading(false);
                setEditing(false);
                console.log("error while updating topic" + err);
            });
        } else {
            addTopic(data).then(res => {
                updatedList[rowData.length - 1] = res.data;
                updateSessionStorage('topics:' + sheetId, updatedList);
                setRowData(updatedList);
                setLoading(false);
                setEditing(false);
            }).catch(err => {
                setLoading(false);
                setEditing(false);
                console.log("error while adding topic" + err);
            });
        }
    }

    // Below Code is for AG-Grid
    const getRowId = useMemo(() => {
        return (params) => {
            return params.data.position;
        };
    }, []);

    const onRowValueChanged = (event) => {
        addOrUpdate(event.data);
    };

    const startEditButton = (data) => {
        gridRef.current.api.setFocusedCell(data.node.rowIndex, 'position');
        gridRef.current.api.startEditingCell({
            rowIndex: data.node.rowIndex,
            colKey: 'position',
        });
    };

    const stopEdititng = () => {
        gridRef.current.api.stopEditing();
        setEditing(false);
    };

    const startEditing = () => {
        setEditing(true);
    };

    const Action = (param) => {
        const openURL = param?.data?.id ? "/problem/" + sheetId + "/" + param.data.id + "/" + sheet + "/" + encodeEscapeCharaters(param.data.topic) : "/";
        return <>
            <Link to={openURL} style={{ textDecoration: 'none', color: 'green' }}> Open </Link>
            <Link onClick={() => startEditButton(param)} style={{ textDecoration: 'none', color: 'blue', padding: '10%' }}> Edit </Link>
            <Link onClick={() => remove(param)} style={{ textDecoration: 'none', color: 'red' }}> Delete </Link>
        </>
    }

    const gridOptions = {
        columnDefs: [
            { headerName: '#', field: 'position', sort: 'asc' },
            { field: 'topic', flex: 1 },
            {
                headerName: 'Action',
                cellRenderer: Action,
                editable: false
            }
        ],

        defaultColDef: {
            suppressMovable: true,
            resizable: true,
            editable: true,
        }
    }

    return (<>
        {loading ? <div className="loading-spinner"></div> :
            <>
                <>
                    <Link onClick={addDummyRecord} className="float-end" style={{ textDecoration: 'none', color: 'black', paddingLeft: '10px' }}>Add Record</Link>
                    <Link to="/" className="float-end" style={{ textDecoration: 'none', color: 'black', paddingLeft: '10px' }}>Sheets</Link>
                    {editing &&
                        <Link onClick={stopEdititng} className="float-end" style={{ textDecoration: 'none', color: 'blue' }}>Stop Editing</Link>}
                    <strong>{decodeEscapeCharaters(sheet)}</strong>
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
                        editType={'fullRow'}
                        onRowValueChanged={onRowValueChanged}
                        onCellEditingStarted={startEditing}
                    />
                </div>
            </>
        }</>
    );
}

export default ListTopic;