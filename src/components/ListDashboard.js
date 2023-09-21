import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap';
import DashboardService from '../service/DashboardService';

function ListDashboard() {
    const [dashboards, setdashboards] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        DashboardService.getAllDashboard()
            .then(response => {
                setdashboards(response.data);
                setLoading(false);
            })
    }, []);

    const remove = async (id) => {
        await DashboardService.deleteDashboard(id).then(() => {
            let updatedDashboard = [...dashboards].filter(i => i.id !== id);
            setdashboards(updatedDashboard);
        });
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    const dateFormat = {
        weekday: 'short', // 'short', 'long', or 'narrow'
        year: 'numeric', // 'numeric', '2-digit'
        month: 'short', // 'short', 'long', 'narrow', or '2-digit'
        day: '2-digit', // 'numeric', '2-digit'
        hour: '2-digit', // 'numeric', '2-digit'
        minute: '2-digit', // 'numeric', '2-digit'
    };

    return (
        <div>
            <div className="float-end">
                <Button color="success" tag={Link} to="/dashboard/edit" state={{ data: null }}>Add Record</Button>
            </div>
            <h2 className="text">Dashboard List</h2>
            <br></br>
            <div className="row">
                <table className="table table-striped table-bordered">

                    <thead>
                        <tr align='center'>
                            <th> Title</th>
                            <th> Tags</th>
                            <th> Difficulty</th>
                            <th> Date updated</th>
                            <th> Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dashboards.map(
                                dashboard =>
                                    <tr align='center' key={dashboard.id}>
                                        <td> {dashboard.title} </td>
                                        <td> {dashboard.tags}</td>
                                        <td> {dashboard.difficulty}</td>
                                        <td> {new Date(dashboard.date_updated).toLocaleString('en-US', dateFormat)}</td>
                                        <td>
                                            <Button color="info" tag={Link} to="/dashboard/view/" state={{ data: dashboard }} >View </Button>
                                            <Button color="primary" tag={Link} to="/dashboard/edit/" state={{ data: dashboard }} style={{ marginLeft: "10px" }} >Update </Button>
                                            <Button color="danger" style={{ marginLeft: "10px" }} onClick={() => remove(dashboard.id)} className="btn btn-danger">Delete </Button>
                                        </td>
                                    </tr>
                            )
                        }
                    </tbody>
                </table>

            </div>

        </div >
    )
}

export default ListDashboard;