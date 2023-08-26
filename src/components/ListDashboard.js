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

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div className="float-end">
                <Button color="success" tag={Link} to="/add">Add Record</Button>
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
                                        <td> {dashboard.date_updated}</td>
                                        <td>
                                            <button onClick={() => this.viewDashboard(dashboard.id)} className="btn btn-info">View </button>
                                            <button style={{ marginLeft: "10px" }} onClick={() => this.editDashboard(dashboard.id)} className="btn btn-primary">Update </button>
                                            <button style={{ marginLeft: "10px" }} onClick={() => this.deleteDashboard(dashboard.id)} className="btn btn-danger">Delete </button>
                                        </td>
                                    </tr>
                            )
                        }
                    </tbody>
                </table>

            </div>

        </div>
    )
}

export default ListDashboard;