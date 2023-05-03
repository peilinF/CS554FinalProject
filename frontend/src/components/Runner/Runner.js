import '../App.css';

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import { useQuery, useMutation } from "@apollo/client";
import queries from '../../graphql/queries';

const Runner = (props) => {

    const navigate = useNavigate();

    const [logbook, setLogbook] = useState(null);
    const [logInfo, setLogInfo] = useState(null);
    const [editStatus, setEditStatus] = useState(false);

    const {loading, error, refetch} = useQuery(queries.GET_LOGBOOK, {
        variables: { userId: props.userInfo._id },
        fetchPolicy: 'cache-and-network',
        skip: !props.userInfo,
        onCompleted: (data) => {
            // console.log(data);
            setLogbook(data.getLogbook);
        },
    });

    const [editTitle, setEditTitle] = useState("Edit Log");
    const [editLog] = useMutation(queries.EDIT_LOG);
    const [deleteLog] = useMutation(queries.DELETE_LOG);

    const handleLogInfo = (event, log_info) => {
        event.preventDefault();

        setLogInfo(log_info);
    };

    const handleEditLog = async (event) => {
        event.preventDefault();

        let new_log = undefined;

        console.log(props.userInfo._id, logInfo._id, {
            date: logInfo.date,
            time: logInfo.time,
            notes: logInfo.notes,
        });
        try {
            new_log = await editLog({
                variables: {
                    userId: props.userInfo._id,
                    logId: logInfo._id,
                    log: {
                        date: logInfo.date,
                        time: logInfo.time,
                        notes: logInfo.notes,
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
        
        setEditStatus(false);

        if (new_log && new_log.data.editLog) {
            refetch();
            setLogInfo(new_log.data.editLog);
        }
        
    };

    const handleDeleteLog = async (event) => {
        event.preventDefault();

        // Create a pop-up window to confirm delete
        const confirmDelete = window.confirm("Are you sure you want to delete this log?");

        if (!confirmDelete) {
            return; // Exit the function if the user clicks Cancel
        }

        let deleted_log = undefined;

        try {
            deleted_log = await deleteLog({
                variables: {
                    userId: props.userInfo._id,
                    logId: logInfo._id
                }
            });
        } catch (error) {
            console.log(error);
        }

        if (deleted_log && deleted_log.data.deleteLog.deleted) {
            refetch();
            setLogInfo(null);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    let log_html = logbook.map((log) => {
        return (
            <li
                key={log._id}
                className="logbook-li"
                onClick={(event) => {
                    console.log("clicked log");
                    handleLogInfo(event, log);
                    setEditStatus(false);
                    props.handleMapLogInfo(log);
                }}
            >
                <p>{log.date}</p>
                <p>{log.time}</p>
                <p>{log.distance.toFixed(2)} mi</p>
            </li>
        );
    });

    // console.log(logInfo);

    let log_info_html = undefined;
    if (!logInfo) {
        log_info_html = (
            <div>
                <p>Click on a log to see more info</p>
            </div>
        );
    } else {

        if (!editStatus) {
            log_info_html = (
                <div key={logInfo._id}>
                    <h2>{logInfo.date}</h2>
                    <br />
                    <h3>Time: </h3>
                    <p>{logInfo.time}</p>
                    <h3>Distance: </h3>
                    <p>{logInfo.distance} mi</p>
                    <h3>Pace: </h3>
                    <p>{logInfo.pace}</p>
                    <h3>Notes: </h3>
                    <p>{logInfo.notes}</p>

                    <br />

                    {/* edit button */}

                    <button
                        className='edit-btn'
                        onClick={(event) => {
                            event.preventDefault();
                            setEditStatus(true);
                            setEditTitle(logInfo.date + "   " + logInfo.time + "   " + logInfo.distance + " mi");
                        }}
                    >
                        Edit
                    </button>

                </div>
            );
        } else {
            log_info_html = (
                <div key={logInfo._id}>

                    <h2>{editTitle}</h2>

                    <form onSubmit={(event) => handleEditLog(event)} className="edit-form">
                        <br />
                        <label>Date: 
                        <input
                            type="text"
                            id="date"
                            value={logInfo.date}
                            onChange={(e) => setLogInfo({ ...logInfo, date: e.target.value })}
                            required
                        />
                        </label>

                        <br />
                        <label>Time:
                        <input
                            type="text"
                            id="time"
                            value={logInfo.time}
                            onChange={(e) => setLogInfo({ ...logInfo, time: e.target.value })}
                            required
                        />
                        </label>

                        <br />
                        <label>Notes:
                        <textarea
                            id="notes"
                            value={logInfo.notes}
                            onChange={(e) => setLogInfo({ ...logInfo, notes: e.target.value })}
                            required
                        />
                        </label>

                        <div className='edit-btn-container'>

                            <button onClick={()=> {
                                setEditStatus(false);
                            }}>
                                &lt; Cancel
                            </button>

                            <button type="submit" >
                                Submit &gt;
                            </button>

                            <button id='delete-btn'
                                onClick={(event) => handleDeleteLog(event)}
                            >
                                X Delete
                            </button>

                        </div>
                    </form>

                </div>
            );
        }
    }

    let logbook_html = (
        <div>
            <h2>Logbook</h2>
            <ul className="logbook-ul">{log_html}</ul>
        </div>
    );

    return (
        <div>
            <h1>Runner</h1>
            {logbook_html}
            <br />
            {log_info_html}
        </div>
    );
};

export default Runner;