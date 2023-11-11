import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import DashboardService from '../service/DashboardService';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Utils from './Utils';

function ListDashboard() {
    const [dashboards, setdashboards] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    let token = localStorage.getItem("jwt-token");

    useEffect(() => {
        if (Utils.authenticated()) {
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
            color = 'green';
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

    const Action = (data) => {
        return <>
            <Link to={"/dashboard/view/" + findIndexFromId(data.data.id)}
                style={{ textDecoration: 'none', color: '#191970' }}> [ View ]
            </Link>
            <Link to={"/dashboard/edit/" + findIndexFromId(data.data.id)}
                style={{ textDecoration: 'none', color: 'black', marginLeft: '10px' }}> [ Edit ]
            </Link>
            <Link onClick={() => remove(findIndexFromId(data.data.id))}
                style={{ textDecoration: 'none', color: 'red', marginLeft: '10px' }}> [ Delete ]
            </Link>
        </>
    }

    const exportList = () => {
        const file = new Blob([localStorage.getItem("dashboardList")], { type: 'text/plain' });
        const element = document.createElement("a");
        element.href = window.URL.createObjectURL(file);
        element.download = "dashboardList.txt";
        document.body.appendChild(element);
        element.click();
    }

    const inputFile = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files && event.target.files[0];
        file.text().then(result => {
            const importedList = JSON.parse(result);
            DashboardService.importDashboard(importedList, token).then(response => {
                let localList = JSON.parse(localStorage.getItem("dashboardList")) || [];
                localList = localList.concat(importedList);
                localStorage.setItem("dashboardList", JSON.stringify(localList));
                setdashboards(localList);
            })
        })
    };
    const importList = () => {
        inputFile.current.click();
    };

    const columnDefs = useMemo(() => ([
        { headerName: 'Title', cellRenderer: Title, resizable: true, flex: 3 },
        {
            headerName: 'Difficulty',
            cellRenderer: Difficulty,
            width: 50, maxWidth: 100, minWidth: 100
        },
        {
            headerName: 'Tags',
            valueGetter: p => {
                return p.data.tags.split(',').join(' ')
            },

            comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
                const A = valueA.split(' ');
                const B = valueB.split(' ');
                let result = A > B ? 1 : -1;

                if (A.length === B.length) {
                    const n = A.length;
                    let sameTag = true;
                    for (let i = 0; i < n - 1; i++) {
                        if (A[i] !== B[i]) {
                            sameTag = false;
                            break;
                        }
                    }
                    if (sameTag) {
                        result = Number(A[n - 1]) - Number(B[n - 1]);
                    }
                }
                return result;
            },

            filter: 'agTextColumnFilter',
            filterParams: {
                debounceMs: 0,
                buttons: ['clear']
            },
            sort: 'asc',
            flex: 1
        },
        { headerName: 'Action', cellRenderer: Action, width: 250, maxWidth: 230, minWidth: 230 }
    ]), []);

    const defaultColDef = useMemo(() => ({
        suppressMovable: true
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
                        style={{ textDecoration: 'none', color: 'black' }}> [ Add Record ]
                    </Link>
                    <Link onClick={exportList} className="float-end"
                        style={{ textDecoration: 'none', color: 'grey' }}> [ Export ]
                    </Link>
                    <input
                        style={{ display: "none" }}
                        ref={inputFile}
                        onChange={handleFileUpload}
                        type="file"
                    />
                    <Link onClick={importList} className="float-end"
                        style={{ textDecoration: 'none', color: 'grey' }}> [ Import ]
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