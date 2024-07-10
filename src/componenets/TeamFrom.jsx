import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResultModal from './ResultModal'
import * as Yup from 'yup';

function TeamForm() {
    const iplTeams = [
        "Chennai Super Kings",
        "Delhi Capitals",
        "Kings XI Punjab",
        "Kolkata Knight Riders",
        "Mumbai Indians",
        "Rajasthan Royals",
        "Royal Challengers Bangalore",
        "Sunrisers Hyderabad",
        "Gujarat Titans",
        "Lucknow Super Giants"
    ];

    const [formData, setFormData] = useState({
        teamA: '',
        teamB: '',
        battingTeam: '',
        currentOver: '',
        currentWicket: '',
        runsToScore: '',
        currentRun: ''
    });

    const [loading, setLoading] = useState(false); 
    const [result, setResult] = useState()
    const [modalShow, setModalShow] = useState(false);
    const handleModalClose = () => setModalShow(false);
    const handleModalShow = () => setModalShow(true);

    const validationSchema = Yup.object().shape({
        teamA: Yup.string().required('Team A is required'),
        teamB: Yup.string()
            .required('Team B is required')
            .notOneOf([Yup.ref('teamA')], 'Team B must be different from Team A'),
        battingTeam: Yup.string().required('Select batting team'),
        currentRun: Yup.number().required('Runs scored is required').min(0,'Runs scored must be positive'),
        currentWicket: Yup.number().required('Wickets fallen is required').min(0, 'Wickets fallen must be 0 or 10').max(10,'Wickets fallen must be 0 or 10'),
        currentOver: Yup.number().required('Overs completed is required').min(0, 'Overs must be between 0 and 19').max(19, 'Overs must be between 0 and 19'),
        runsToScore: Yup.number().required('Required runs is required').min(0,'Required runs must be positive'),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // const API_URL = 'http://localhost:8000/api';
    const API_URL = 'https://8253-58-146-118-80.ngrok-free.app/api/api'

    const handleSubmit = async (e) => {

        
        e.preventDefault();
        
        setLoading(true);
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            const response = await fetch(`${API_URL}/estimate/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            console.log(data);
            setResult(data)
            handleModalShow()

            toast.success('Estimation submitted successfully.');


        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                error.inner.forEach(err => {
                    toast.error(err.message);
                });
            } else {
                toast.error('Failed to submit estimation.');
            }
    
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>{
        console.log(result)
    },[result])
    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 mt-5">
            <div className="card p-4 w-100" style={{ maxWidth: '500px' }}>
                <h3 className="card-title text-center">Match Estimator</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="teamA">Team A</label>
                        <select
                            className="form-control"
                            id="teamA"
                            name="teamA"
                            value={formData.teamA}
                            onChange={handleChange}
                        >
                            <option value="">Select Team A</option>
                            {iplTeams.map((team, index) => (
                                <option key={index} value={team}>{team}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="teamB">Team B</label>
                        <select
                            className="form-control"
                            id="teamB"
                            name="teamB"
                            value={formData.teamB}
                            onChange={handleChange}
                        >
                            <option value="">Select Team B</option>
                            {iplTeams.filter(team => team !== formData.teamA).map((team, index) => (
                                <option key={index} value={team}>{team}</option>
                            ))}
                        </select>
                    </div>

                    {(formData.teamA && formData.teamB) && (
                        <>
                            <div className="form-group mb-3">
                                <label>Team Batting First</label>
                                <div className="form-check mb-3">
                                    <input
                                        type="radio"
                                        name="battingTeam"
                                        className="form-check-input"
                                        value={formData.teamA}
                                        checked={formData.battingTeam === formData.teamA}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label">
                                        {formData.teamA}
                                    </label>
                                </div>
                                <div className="form-check mb-3">
                                    <input
                                        type="radio"
                                        name="battingTeam"
                                        className="form-check-input"
                                        value={formData.teamB}
                                        checked={formData.battingTeam === formData.teamB}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label">
                                        {formData.teamB}
                                    </label>
                                </div>
                            </div>

                            <h4 className="text-center mt-4">Second Innings</h4>
                            <div className="form-group mb-3">
                                <input
                                    className="form-control"
                                    type="number"
                                    name="currentRun"
                                    placeholder="Runs Scored"
                                    value={formData.currentRun}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    className="form-control"
                                    type="number"
                                    name="currentWicket"
                                    placeholder="Wickets Fallen"
                                    value={formData.currentWicket}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    className="form-control"
                                    type="number"
                                    name="currentOver"
                                    placeholder="Overs Completed"
                                    value={formData.currentOver}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    className="form-control"
                                    type="number"
                                    name="runsToScore"
                                    placeholder="Required Runs"
                                    value={formData.runsToScore}
                                    onChange={handleChange}
                                />
                            </div>

                            <button className="btn btn-primary btn-block mb-3" type="submit" disabled={loading}>
                                {loading && (
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                )}
                                Submit
                            </button>
                        </>
                    )}
                </form>
            </div>

            {/* Toast component */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {result && (
                <ResultModal
                show={modalShow}
                handleClose={handleModalClose}
                results={result}
                teamA={formData['teamA']}
                teamB={formData['teamB']}
                currentOver={formData['currentOver']}
            />
            )}
        </div>

    );
}

export default TeamForm;
