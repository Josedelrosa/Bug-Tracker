import React from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chart from "react-apexcharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function DonutChart() {
  const { currentUser } = useAuth();
  const [typeLabel, setTypeLabel] = useState([]);
  const [typeSeries, setTypeSeries] = useState([]);
  const [statusLabel, setStatusLabel] = useState([]);
  const [statusSeries, setStatusSeries] = useState([]);
  const [priorityLabel, setPriorityLabel] = useState([]);
  const [prioritySeries, setPrioritySeries] = useState([]);

  useEffect(() => {
    const id = currentUser.uid;

    const getUserTicket = async (id) => {
      const querySnapshot = await getDocs(
        collection(db, "users", id, "tickets")
      );
      const theseTickets = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      if (theseTickets) {
        const type = [];
        const status = [];
        const priority = [];
        const countType = {};
        const countStatus = {};
        const countPriority = {};

        for (let i of theseTickets) {
          type.push(i.type);
          status.push(i.status);
          priority.push(i.priority);
        }

        for (const element of type) {
          if (countType[element]) {
            countType[element] += 1;
          } else {
            countType[element] = 1;
          }
        }
        for (const element of status) {
          if (countStatus[element]) {
            countStatus[element] += 1;
          } else {
            countStatus[element] = 1;
          }
        }
        for (const element of priority) {
          if (countPriority[element]) {
            countPriority[element] += 1;
          } else {
            countPriority[element] = 1;
          }
        }

        const typeValues = Object.values(countType);
        const statusValues = Object.values(countStatus);
        const priorityValues = Object.values(countPriority);

        let uniqueType = [...new Set(type)];
        let uniqueStatus = [...new Set(status)];
        let uniquePriority = [...new Set(priority)];

        setTypeLabel(uniqueType);
        setStatusLabel(uniqueStatus);
        setPriorityLabel(uniquePriority);

        setTypeSeries(typeValues);
        setStatusSeries(statusValues);
        setPrioritySeries(priorityValues);
      }
    };
    getUserTicket(id);

    // getTickets();

    //currentUser.uid, currentUserTickets.id
  }, [currentUser.uid]);
  return (
    <>
      <Grid item xs={4}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "row",
            height: 320,
          }}
          elevation={12}
        >
          {/* <Chart type="pie" /> */}

          <Chart
            options={{
              noData: { text: "Empty Data" },
              labels: typeLabel,
              title: {
                text: "Type",
              },
            }}
            type="donut"
            series={typeSeries}
            width={400}
            height={400}
          />
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "row",
            height: 320,
          }}
          elevation={12}
        >
          <Chart
            options={{
              noData: { text: "Empty Data" },
              labels: statusLabel,
              title: {
                text: "Status",
              },
            }}
            series={statusSeries}
            type="donut"
            width={400}
            height={400}
          />
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "row",
            height: 320,
          }}
          elevation={12}
        >
          <Chart
            options={{
              noData: { text: "Empty Data" },
              labels: priorityLabel,
              title: {
                text: "Priority",
              },
              chart: {},
              legend: {},
            }}
            series={prioritySeries}
            type="donut"
            width={400}
            height={400}
          />
        </Paper>
      </Grid>
    </>
  );
}
