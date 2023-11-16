import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from 'react-router-dom'
import SheetService from "./SheetService";
import Utils from "../Utils";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const ListSheet = () => {
    const [sheets, setSheets] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (Utils.authenticated()) {
            new SheetService().getSheetsByUserName().then(response => {
                setSheets(response.data);
                setLoading(false);
            });
        }
    }, []);

    const addOrUpdateRecord = useCallback((row) => {
        let newSheet = [...sheets].sort((a, b) => a.position - b.position);
        if (row) {
            const record = {
                id: '',
                position: newSheet.length > 0 ? newSheet[newSheet.length - 1].position + 1 : 1,
                sheet: '',
                username: localStorage.getItem("username")
            }
            newSheet.push(record);
        } else {

        }
        setSheets(newSheet);
    });

    const remove = (id) => {

    }

    const gridOptions = {
        columnDefs: [
            { headerName: '#', field: 'position', sort: 'asc' },
            { field: 'sheet', flex: 1 },
            {
                headerName: 'Action',
                cellRenderer: (row) => {
                    return (<>
                        <Link to={"/sheet/view/" + row.data.id} style={{ textDecoration: 'none', color: 'green' }}> Open</Link>
                        <Link to={"/sheet/edit/" + row.data.id} style={{ textDecoration: 'none', color: 'blue', padding: "10%" }}> Edit </Link>
                        <Link onClick={() => remove(row.data.id)} style={{ textDecoration: 'none', color: 'red' }}> Delete </Link>
                    </>);
                }
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
                    <button onClick={addOrUpdateRecord} className="float-end" style={{ textDecoration: 'none', color: 'black' }}>Add Record</button>
                    <strong>Sheets</strong>
                    <hr size="4" color="grey" />
                </>

                <div className="ag-theme-alpine" style={{ height: 600 }}>
                    <AgGridReact
                        popupParent={document.body}
                        rowData={sheets}
                        columnDefs={gridOptions.columnDefs}
                        defaultColDef={gridOptions.defaultColDef}
                        suppressMenuHide={true}
                    />
                </div>
            </>
        }</>
    );
}

export default ListSheet;