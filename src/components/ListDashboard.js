import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom'
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

    const findIndexFromId = (id) => {
        const list = JSON.parse(localStorage.getItem("dashboardList"));
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                return i;
            }
        }
        return 0;
    }

    const Action = (data) => {
        return <>
            <Link to={"/dashboard/view/" + findIndexFromId(data.data.id)}
                style={{ textDecoration: 'none', color: '#7B5800' }}> [ View ]
            </Link>
            <Link to={"/dashboard/edit/" + findIndexFromId(data.data.id)}
                style={{ textDecoration: 'none', color: '#F5B000', marginLeft: '10px' }}> [ Edit ]
            </Link>
            <Link onClick={() => remove(findIndexFromId(data.data.id))}
                style={{ textDecoration: 'none', color: '#F55500', marginLeft: '10px' }}> [ Delete ]
            </Link>
        </>
    }


    const columnDefs = useMemo(() => ([
        { field: 'title', resizable: true, flex: 3 },
        {
            headerName: 'Tags',
            valueGetter: p => {
                return p.data.tags.split(',').join(' ')
            },

            comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
                const A = valueA.split(' ');
                const B = valueB.split(' ');
                if (A.length === B.length && A.length === 3 && A[0] === B[0] && A[1] === B[1]) {
                    return Number(A[2] - B[2]);
                } else {
                    return (A > B) ? 1 : -1;
                }
            },

            filter: 'agTextColumnFilter',
            filterParams: {
                debounceMs: 0,
                buttons: ['clear']
            },
            resizable: true,
            flex: 1
        },
        { headerName: 'Level', field: 'difficulty', width: 100, maxWidth: 100, minWidth: 100 },
        { headerName: 'Action', cellRenderer: Action, width: 250, maxWidth: 230, minWidth: 230 }
    ]), []);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        suppressMovable: true,
    }), []);

    const gridRef = useRef();

    const onFilterChanged = useCallback(() => {
        localStorage.setItem("list-dashboard-tags-filter", JSON.stringify(gridRef.current.api.getFilterModel()));
    });

    const onFirstDataRendered = useCallback(() => {
        if (localStorage.getItem("list-dashboard-tags-filter")) {
            gridRef.current.api.setFilterModel(JSON.parse(localStorage.getItem("list-dashboard-tags-filter")));
        }
    });

    const dashboardGrid = (
        <div className="ag-theme-alpine" style={{ height: 600 }}>
            <AgGridReact
                ref={gridRef}
                onFirstDataRendered={onFirstDataRendered}
                onFilterChanged={onFilterChanged}
                popupParent={document.body}
                rowData={dashboards}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                suppressMenuHide={true}
            />
        </div>
    );

    return (
        <>
            {loading ? <div className="loading-spinner"></div> :
                <>
                    <Link to="/dashboard/edit/-1" className="float-end"
                        style={{ textDecoration: 'none', color: 'grey' }}> [ Add Record ]
                    </Link>
                    <strong>Dashboard List</strong>
                    <hr size="4" color="grey" />
                    {dashboardGrid}
                </>
            }
        </>
    )
}

export default ListDashboard;