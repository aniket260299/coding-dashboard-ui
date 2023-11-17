import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from 'react-router-dom'
import SheetService from "./SheetService";
import Utils from "../Utils";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

const ListSheet = () => {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const sheetService = new SheetService();
    const gridRef = useRef();

    useEffect(() => {
        setLoading(true);
        if (Utils.authenticated()) {
            sheetService.getSheetsByUserName().then(response => {
                setRowData(response.data);
                setLoading(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const remove = async (param) => {
        setLoading(true);
        await sheetService.deleteSheet(param.data.id);
        let updatedList = [...rowData].filter(a => a.id !== param.data.id);
        setRowData(updatedList);
        setLoading(false);
    };

    const addDummyRecord = () => {
        let newSheet = [...rowData].sort((a, b) => a.position - b.position);
        if (newSheet.length - 1 >= 0 && !newSheet[newSheet.length - 1].id) return;
        const record = {
            id: undefined,
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
        const response = data.id ? sheetService.updateSheet(data) : sheetService.addSheet(data);
        response.then(res => {
            if (data.id) {
                updatedList[Utils.findIndexFromId(data.id, rowData)] = res.data;
            } else {
                updatedList[rowData.length - 1] = res.data;
            }
            setRowData(updatedList);
            setLoading(false);
            setEditing(false);
        });
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
        return <>
            <Link onClick={() => remove(param)} style={{ textDecoration: 'none', color: 'green' }}> Open </Link>
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
                    <button onClick={addDummyRecord} className="float-end" style={{ textDecoration: 'none', color: 'black', paddingLeft: '10px' }}>Add Record</button>
                    {editing &&
                        <button onClick={stopEdititng} className="float-end" style={{ textDecoration: 'none', color: 'blue' }}>Stop Editing</button>}
                    <strong>Sheets</strong>
                    <hr size="4" color="grey" />
                </>

                <div className="ag-theme-material" style={{ height: 600 }}>
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