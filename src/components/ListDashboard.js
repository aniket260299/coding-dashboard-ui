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
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };

    return (
        <div>
            <div className="float-end">
                <Link to="/dashboard/edit" state={{ data: null }}>
                    <Button color="success">Add Record</Button>
                </Link>
            </div>
            <h2 className="text">Dashboard List</h2>
            <br></br>
            <div className="row">
                <table className="table table-striped table-bordered">

                    <thead>
                        <tr>
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
                                    <tr key={dashboard.id}>
                                        <td width='35%'> {dashboard.title} </td>
                                        <td width='15%'> {dashboard.tags}</td>
                                        <td width='5%'> {dashboard.difficulty}</td>
                                        <td align='center' width='15%'> {new Date(dashboard.date_updated).toLocaleString('en-US', dateFormat)}</td>
                                        <td align='center' width='15%'>
                                            <Link to="/dashboard/view/" state={{ data: dashboard }}>
                                                <Button color="info">View </Button>
                                            </Link>
                                            <Link to="/dashboard/edit/" state={{ data: dashboard }}>
                                                <Button color="primary" style={{ marginLeft: "10px" }}>Edit </Button>
                                            </Link>
                                            <Button color="danger" style={{ marginLeft: "10px" }} onClick={() => remove(dashboard.id)}>Delete</Button>
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