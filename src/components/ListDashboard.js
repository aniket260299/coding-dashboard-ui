import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Button, Table } from 'reactstrap';
import DashboardService from '../service/DashboardService';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function ListDashboard() {
    const [dashboards, setdashboards] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    let token = localStorage.getItem("jwt-token");

    const authenticated = () => {
        if (token) {
            const now = new Date();
            const expiry = new Date(Number(localStorage.getItem("jwt-token-expiry")));
            if (expiry > now) return true;
        }
        localStorage.clear();
        return false;
    }

    useEffect(() => {
        if (authenticated()) {
            setdashboards(JSON.parse(localStorage.getItem("dashboardList")));
        } else {
            navigate("/auth");
        }
    }, []);


    const remove = async (index) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (confirmDelete) {
            let list = JSON.parse(localStorage.getItem("dashboardList"));
            const id = list[index].id;
            setLoading(true);
            await DashboardService.deleteDashboard(id, token).then(() => {
                list.splice(index, 1);
                localStorage.setItem("dashboardList", JSON.stringify(list));
                setdashboards(list);
                setLoading(false);
            });
        }
    }

    const Action = (data) => {
        return <>
            <Link to={"/dashboard/view/" + data.node.rowIndex}>
                <Button color="info">View </Button>
            </Link>
            <Link to={"/dashboard/edit/" + data.node.rowIndex}>
                <Button color="primary" style={{ marginLeft: "10px" }}>Edit </Button>
            </Link>
            <Button color="danger" style={{ marginLeft: "10px" }} onClick={() => remove(data.node.rowIndex)}>Delete</Button>
        </>
    }

    const columnDefs = useMemo(() => ([
        { field: 'title' },
        {
            headerName: 'Tags',
            valueGetter: p => {
                return p.data.tags.split(',').join(' ')
            },
            filter: 'agTextColumnFilter',
        },
        { headerName: 'Level', field: 'difficulty' },
        { headerName: 'Action', cellRenderer: Action }
    ]), []);

    const defaultColDef = useMemo(() => ({
        flex: 1,
        resizable: true,
        sortable: true
    }), []);

    return (
        <>
            {loading ? <div className="loading-spinner"></div> :
                <>
                    <div className="float-end">
                        <Link to="/dashboard/edit/-1">
                            <Button color="success">Add Record</Button>
                        </Link>
                    </div>
                    <h2 className="text">Dashboard List</h2>
                    <br></br>
                    {dashboards.length !== 0 &&
                        <div className="ag-theme-alpine" style={{ height: 600 }}>
                            <AgGridReact rowData={dashboards} columnDefs={columnDefs} defaultColDef={defaultColDef}></AgGridReact>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default ListDashboard;