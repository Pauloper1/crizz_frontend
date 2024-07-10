import React, { useEffect, useState } from 'react';
import { Modal, Card } from 'react-bootstrap';
import './base.css';

const ResultModal = ({ show, handleClose, results, teamA_, teamB_, currentOver }) => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [probability, setProbability] = useState(0); // Initialize probability with a default value

  useEffect(() => {
    // console.log(results.scenario[1]['2nd_inning'][currentOver])
    // Update teamA, teamB, and probability based on results and teamA_, teamB_
    if (teamA_ === results.chasing_team) {
      setTeamA(results.chasing_team);
      setTeamB(results.defending_team);
      setProbability(results.probability);
    } else {
      setTeamA(results.defending_team);
      setTeamB(results.chasing_team);
      setProbability(1 - results.probability);
    }
  }, [results, teamA_, teamB_]);
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Match Results</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <h5>Winning Probability for Team A: {(probability * 100).toFixed(2)}%</h5>
          {results.scenario.map((result, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Card.Title>{result.matchTitle}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{result.matchDate}</Card.Subtitle>
                <Card.Text>{result.description}</Card.Text>
                {result && (
                  <div>
                    <h6>Scenario {index + 1}</h6>
                    <p>
                      {/* {console.log(result['2nd_inning'])} */}
                      {/* {teamA} vs {teamB}, Team Batting First:, */}

                      Second Innings:
                      {/* {result['2nd_inning'][`${currentOver}`]} */}
                      <br />

                      </p>
                    <div className="row">
                      <div className="col-12 col-5-md">
                        <p>
                          <span className="fw-bold">Overs Completed</span>: {result['2nd_inning'][`${currentOver}`].over},
                          <br />
                          <span className="fw-bold">Run Scored</span>: {result['2nd_inning'][`${currentOver}`]?.current_score},
                          <br />
                          <span className="fw-bold">Wickets Fallen</span>: {result['2nd_inning'][`${currentOver}`]?.current_wicket},
                        </p>
                      </div>
                      <div className="col-12 col-5-md">
                        <p>
                          <span className="fw-bold">Runs still required to win</span>: {result['2nd_inning'][`${currentOver}`].to_score},
                          <br />
                          <span className="fw-bold">Winning Team</span>: {result.winner === 1 ? result.chasing_team : result.defending_team}

                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResultModal;
