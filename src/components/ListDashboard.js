import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Button, Table } from 'reactstrap';
import DashboardService from '../service/DashboardService';

function ListDashboard() {
    const [dashboards, setdashboards] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    let token = localStorage.getItem("jwt-token");

    useEffect(() => {
        token = localStorage.getItem("jwt-token");
        token ? setdashboards(JSON.parse(localStorage.getItem("dashboardList"))) : navigate("/auth");
    }, [token]);

    const remove = async (index) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (confirmDelete) {
            const id = dashboards[index].id;
            setLoading(true);
            await DashboardService.deleteDashboard(id, token).then(() => {
                let updatedDashboard = [...dashboards].filter(i => i.id !== id);
                localStorage.setItem("dashboardList", JSON.stringify(updatedDashboard));
                setdashboards(updatedDashboard);
                setLoading(false);
            });
        }
    }

    const dateFormat = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };

    if (loading) {
        return (
            <div className="loading-spinner"></div>
        );
    }

    if (dashboards.length === 0) {
        return (
            <>
                <div className="float-end">
                    <Link to="/dashboard/edit/-1">
                        <Button color="success">Add Record</Button>
                    </Link>
                </div>
                <h2 className="text">Dashboard List</h2>
            </>
        );
    }

    return (
        <div>
            <div className="float-end">
                <Link to="/dashboard/edit/-1">
                    <Button color="success">Add Record</Button>
                </Link>
            </div>
            <h2 className="text">Dashboard List</h2>
            <br></br>
            <Table responsive hover style={{ wordBreak: 'break-all' }}>
                <thead>
                    <tr>
                        <th style={{ minWidth: "100px" }}>Title</th>
                        <th style={{ minWidth: "70px" }}>Tags</th>
                        <th style={{ minWidth: "57px" }}>Level</th>
                        <th style={{ minWidth: "135px" }}>Date updated</th>
                        <th style={{ minWidth: "225px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dashboards.map((dashboard, index) =>
                        <tr key={dashboard.id}>
                            <td> {dashboard.title} </td>
                            <td> {dashboard.tags.split(",")[0]}</td>
                            <td> {dashboard.difficulty}</td>
                            <td> {new Date(dashboard.date_updated).toLocaleString('en-US', dateFormat)}</td>
                            <td>
                                <Link to={"/dashboard/view/" + index}>
                                    <Button color="info">View </Button>
                                </Link>
                                <Link to={"/dashboard/edit/" + index}>
                                    <Button color="primary" style={{ marginLeft: "10px" }}>Edit </Button>
                                </Link>
                                <Button color="danger" style={{ marginLeft: "10px" }} onClick={() => remove(index)}>Delete</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default ListDashboard;