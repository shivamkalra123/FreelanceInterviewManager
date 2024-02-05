import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import NotFound from "./Not_Found.png";
import "./App.css";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function formatDate(dateString) {
  const date = new Date(dateString);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleTimeString(undefined, options);
  } else if (date.toDateString() === tomorrow.toDateString()) {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleTimeString(undefined, options);
  } else {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString(undefined, options);
  }
}

function Home() {
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    position: "",
    datetime: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/candidates")
      .then((response) => {
        setCandidates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching candidates:", error);
      });
  }, []);

  const todayCandidates = candidates.filter(
    (candidate) =>
      new Date(candidate.datetime).toDateString() === new Date().toDateString()
  );
  const tomorrowCandidates = candidates.filter((candidate) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      new Date(candidate.datetime).toDateString() === tomorrow.toDateString()
    );
  });
  const otherCandidates = candidates.filter((candidate) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(candidate.datetime) > tomorrow;
  });
  const [showOptions, setShowOptions] = useState(null);

  const handleOptionsClick = (index) => {
    setShowOptions((prev) => (prev === index ? null : index));
  };

  const handleReschedule = (name) => {
    console.log(`Reschedule candidate with name: ${name}`);
    navigate(`/reschedule/${encodeURIComponent(name)}`);
  };

  const handleDelete = async (sno) => {
    try {
      await axios.delete("http://localhost:8080/delete", {
        data: { sno },
      });

      console.log(`Candidate with sno ${sno} deleted successfully.`);

      setCandidates((prevCandidates) =>
        prevCandidates.filter((candidate) => candidate.sno !== sno)
      );
    } catch (error) {
      console.error(`Error deleting candidate with sno ${sno}:`, error);
    }
  };

  const handleViewHistory = (sno) => {
    navigate(`/past-records/${sno}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate((prevCandidate) => ({
      ...prevCandidate,
      [name]: value,
    }));
  };

  const handleAddCandidate = async () => {
    try {
      await axios.post("http://localhost:8080/candidates/add", newCandidate);

      // Refresh the candidates list after adding a new candidate
      const updatedCandidates = await axios.get(
        "http://localhost:8080/candidates"
      );
      setCandidates(updatedCandidates.data);

      // Reset the newCandidate state
      setNewCandidate({
        name: "",
        position: "",
        datetime: "",
      });
    } catch (error) {
      console.error("Error adding new candidate:", error);
    }
  };

  return (
    <>
      <div className="card">
        <div>
          <input
            type="text"
            placeholder="name"
            name="name"
            value={newCandidate.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="position"
            name="position"
            value={newCandidate.position}
            onChange={handleInputChange}
          />
          <input
            className="date-time"
            type="datetime-local"
            name="datetime"
            value={newCandidate.datetime}
            onChange={handleInputChange}
          />
          <button onClick={handleAddCandidate}>Add Candidate</button>
        </div>
        <h1>Upcoming Interviews</h1>
        <div>
          <h2>Today</h2>
          {todayCandidates.length > 0 ? (
            <ul>
              {todayCandidates.map((candidate, index) => (
                <li key={candidate.sno}>
                  <div className="candidate-info">
                    <span>{candidate.name} </span>
                    <span className="position">{candidate.position}</span>
                  </div>
                  <div className="join-now">
                    <strong>{formatDate(candidate.datetime)}</strong>
                    <button
                      className="view-history-btn"
                      onClick={() => handleViewHistory(candidate.sno)}
                    >
                      View History
                    </button>
                    <a href="#">Join Now</a>
                    <div className="options-menu">
                      <HiDotsVertical
                        onClick={() => handleOptionsClick(index)}
                      />

                      {showOptions === index && (
                        <ul className="options-dropdown">
                          <li onClick={() => handleReschedule(candidate.name)}>
                            Reschedule
                          </li>
                          <li onClick={() => handleDelete(candidate.sno)}>
                            Delete
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="notFound">
              <img src={NotFound} alt="FoundNot"></img>
              <p>No Interview scheduled for Today</p>
            </div>
          )}
        </div>
        <div>
          <h2>Tomorrow</h2>
          {tomorrowCandidates.length > 0 ? (
            <ul>
              {tomorrowCandidates.map((candidate, index) => (
                <li key={candidate.sno}>
                  <div className="candidate-info">
                    <span>{candidate.name} </span>
                    <span className="position">{candidate.position}</span>
                  </div>
                  <div className="join-now">
                    <strong>{formatDate(candidate.datetime)}</strong>
                    <button
                      className="view-history-btn"
                      onClick={() => handleViewHistory(candidate.sno)}
                    >
                      View History
                    </button>
                    <a href="#">Join Now</a>

                    <div className="options-menu">
                      <HiDotsVertical
                        onClick={() => handleOptionsClick(index)}
                      />

                      {showOptions === index && (
                        <ul className="options-dropdown">
                          <li onClick={() => handleReschedule(candidate.sno)}>
                            Reschedule
                          </li>
                          <li onClick={() => handleDelete(candidate.sno)}>
                            Delete
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="notFound">
              <img src={NotFound} alt="FoundNot"></img>
              <p>No Interview scheduled for Tomorrow</p>
            </div>
          )}
        </div>
        <div>
          <h2>Other Dates</h2>
          {otherCandidates.length > 0 ? (
            <ul>
              {otherCandidates.map((candidate, index) => (
                <li key={candidate.sno}>
                  <div className="candidate-info">
                    <span>{candidate.name} </span>
                    <span className="position">{candidate.position}</span>
                  </div>
                  <div className="join-now">
                    <div className="a">
                      <strong>{formatDate(candidate.datetime)}</strong>

                      <button
                        className="view-history-btn"
                        onClick={() => handleViewHistory(candidate.sno)}
                      >
                        View History
                      </button>
                    </div>

                    <a href="#">Join Now</a>
                    <div className="options-menu">
                      <HiDotsVertical
                        onClick={() => handleOptionsClick(index)}
                      />
                      {showOptions === index && (
                        <ul className="options-dropdown">
                          <li onClick={() => handleReschedule(candidate.sno)}>
                            Reschedule
                          </li>
                          <li onClick={() => handleDelete(candidate.sno)}>
                            Delete
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="notFound">
              <img src={NotFound} alt="FoundNot"></img>
              <p>No Interview scheduled</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
