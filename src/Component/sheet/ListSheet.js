import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { getSheetsByUserName, deleteSheet, updateSheet, addSheet, importData, exportData } from "./SheetService";
import { AgGridReact } from "ag-grid-react";
import { authenticated, findIndexFromId } from "../common/Utils";
import { setSessionStorage, getSessionStorage, updateSessionStorage } from "../common/DataCacheUtil";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const ListSheet = () => {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const gridRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (authenticated()) {
            if (getSessionStorage('sheets:' + localStorage.getItem("username"))) {
                const cachedData = getSessionStorage('sheets:' + localStorage.getItem("username"));
                setRowData(cachedData);
            } else {
                setLoading(true);
                getSheetsByUserName().then(response => {
                    setSessionStorage('sheets:' + localStorage.getItem("username"), response.data);
                    setRowData(response.data);
                    setLoading(false);
                }).catch(err => {
                    console.log("error while fetching sheets: " + err);
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
        deleteSheet(param.data.id).then(() => {
            updateSessionStorage('sheets:' + localStorage.getItem("username"), updatedList);
            setRowData(updatedList);
            setLoading(false);
        }).catch(err => {
            console.log("error while deleting data from DB: " + err);
            setLoading(false);
        });
    };

    const addDummyRecord = () => {
        let newSheet = [...rowData].sort((a, b) => a.position - b.position);
        if (newSheet.length - 1 >= 0 && !newSheet[newSheet.length - 1].id) return;
        const record = {
            position: newSheet.length > 0 ? newSheet[newSheet.length - 1].position + 1 : 1,
            sheet: '',
            username: localStorage.getItem("username")
        }
        newSheet.push(record);
        setRowData(newSheet);
    };

    const addOrUpdate = (data) => {
        setLoading(true);
        let updatedList = [...rowData];
        if (data.id) {
            updateSheet(data).then(res => {
                updatedList[findIndexFromId(data.id, rowData)] = res.data;
                updateSessionStorage('sheets:' + localStorage.getItem("username"), updatedList);
                setRowData(updatedList);
                setLoading(false);
                setEditing(false);
            }).catch(err => {
                setLoading(false);
                setEditing(false);
                console.log("error while updating sheet" + err);
            });
        } else {
            addSheet(data).then(res => {
                updatedList[rowData.length - 1] = res.data;
                updateSessionStorage('sheets:' + localStorage.getItem("username"), updatedList);
                setRowData(updatedList);
                setLoading(false);
                setEditing(false);
            }).catch(err => {
                setLoading(false);
                setEditing(false);
                console.log("error while adding sheet" + err);
            })
        }
    }

    const exportList = () => {
        setLoading(true);
        exportData().then(response => {
            console.log(response.data);
            const file = new Blob([JSON.stringify(response.data)], { type: "text/json;charset=utf-8" });
            const element = document.createElement("a");
            element.href = window.URL.createObjectURL(file);
            element.download = "coding_dashboard_export.txt";
            document.body.appendChild(element);
            element.click();
            setLoading(false);
        }).catch(err => {
            console.log("Error while exporting data: " + err);
            setLoading(false);
        });
    }

    const inputFile = useRef(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files && event.target.files[0];
        setLoading(true);
        file.text().then(text => {
            importData(JSON.parse(text)).then(response => {
                setLoading(false);
                if (response.data === 'imported successfully') {
                    getSheetsByUserName().then(response => {
                        setSessionStorage('sheets:' + localStorage.getItem("username"), response.data);
                        setRowData(response.data);
                        setLoading(false);
                    }).catch(err => {
                        console.log("error while fetching sheets: " + err);
                        setLoading(false);
                    });
                }
            }).catch(err => {
                setLoading(false)
                console.log("error while importing data: " + err);
            });
        }).catch(err => {
            setLoading(false)
            console.log("error while convertingFile to text at handleFileUpload: " + err);
        });
    }

    const importList = () => {
        inputFile.current.click();
    };

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
        const openURL = param?.data?.id ? "/topic/" + param.data.id + "/" + param.data.sheet : "/";
        return <>
            <Link to={openURL} style={{ textDecoration: 'none', color: 'green' }}> Open </Link>
            <Link onClick={() => startEditButton(param)} style={{ textDecoration: 'none', color: 'blue', padding: '10%' }}> Edit </Link>
            <Link onClick={() => remove(param)} style={{ textDecoration: 'none', color: 'red' }}> Delete </Link>
        </>
    }

    const gridOptions = {
        columnDefs: [
            { headerName: '#', field: 'position', sort: 'asc' },
            { field: 'sheet', flex: 1 },
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
                    {editing && <Link onClick={stopEdititng} className="float-end" style={{ textDecoration: 'none', color: 'blue', paddingLeft: '10px' }}>Stop Editing</Link>}
                    <Link onClick={exportList} className="float-end" style={{ textDecoration: 'none', color: 'grey', paddingLeft: '10px' }}>Export</Link>
                    <input style={{ display: "none" }} ref={inputFile} onChange={handleFileUpload} type="file" />
                    <Link onClick={importList} className="float-end" style={{ textDecoration: 'none', color: 'grey', paddingLeft: '10px' }}> Import</Link>
                    <strong>Sheets</strong>
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

export default ListSheet;