import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  const setDay = (day) => setState({ ...state, day: day });

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = { ...state.appointments, [id]: appointment };

    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        setState((prev) => ({
          ...state,
          appointments,
        }));
      })
      .catch((err) => console.log(err));
  }

  function cancelInterview(id) {
    const interview = null;
    const appointment = { ...state.appointments[id], interview };
    const appointments = { ...state.appointments, [id]: appointment };

    return axios
      .delete(`/api/appointments/${id}`, { interview })
      .then((response) => {
        setState((prev) => ({
          ...prev,
          appointments,
        }));
      })
      .catch((err) => console.log(err));
  }
  return { state, setDay, bookInterview, cancelInterview };
}
