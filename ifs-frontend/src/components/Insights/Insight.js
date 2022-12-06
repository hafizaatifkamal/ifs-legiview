import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "../../store/interviewer-action";
import { Card, Box, Autocomplete, TextField } from "@mui/material";
import {
  getInsights,
  getRoleGroupInsights,
  getInsightsByRole,
} from "../../store/insights-action";
import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from "recharts";

let color = [
  "#E74C3C",
  "#22B20A",
  "#0A3AB2",
  "#700AB2",
  "#221928",
  "#C1B5C9",
  "#105202",
  "#F52807",
  "#565252",
  "#DE5B5B",
  "#DE5BD0",
  "#800D74",
  "#800008",
  "#2471A3 ",
  "#6D2F2F",
  "#2F346D",
  "#2F6D5C",
  "#769B0B",
  "#817C08",
  "#25B48A",
];

function Insights() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [insightData, setInsightData] = useState([]);

  const [role, setRole] = useState("");

  useEffect(() => {
    dispatch(getRoles(""));
    dispatch(getInsights());
    dispatch(getRoleGroupInsights());
  }, []);

  const { roles } = useSelector((state) => state.interviewer);

  const { insights } = useSelector((state) => state.insights);

  const { roleGroupInsights } = useSelector((state) => state.insights);

  const { insightsByRole } = useSelector((state) => state.insights);

  useEffect(() => {
    if (!!insights) {
      setInsightData(insights);
    }
  }, [insights]);

  useEffect(() => {
    if (!!insightsByRole) {
      setData(insightsByRole);
    }
  }, []);
  useEffect(() => {
    if (!!insightsByRole) {
      setData(insightsByRole);
    }
  }, [insightsByRole]);

  useEffect(() => {
    if (!!roleGroupInsights) {
      setData(roleGroupInsights);
    }
  }, [roleGroupInsights]);

  console.log(data, role, "insightsByRole");

  return (
    !!roles && (
      <div>
        <Card sx={{ p: 3 }}>
          {!!insightData.length && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                border: "2px solid #D4D2D5",
                width: "100%",
                padding: "10px",
              }}
            >
              {insightData.map((insight) => (
                <div
                  key={insight.property}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 1,
                    padding: "10px",
                    width: "30%",
                    height: "100px",
                    margin: "10px",
                    border: "1px solid #D4D2D5",
                  }}
                >
                  <p
                    style={{
                      textTransform: "capitalize",
                      fontSize: "24px",
                    }}
                  >
                    {insight.property}
                  </p>
                  <p style={{ color: "#B0AEB2", fontSize: "20px" }}>
                    ({insight.value})
                  </p>
                </div>
              ))}
            </div>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 10%",
            }}
          >
            <label style={{ width: "150px" }}>Role</label>
            <Autocomplete
              fullWidth
              disablePortal
              id="combo-box-demo"
              options={roles}
              getOptionLabel={(option) => option.role}
              onChange={(event, values) => {
                if (!!values) {
                  dispatch(getInsightsByRole(values.role));
                  setRole(values.role);
                } else {
                  setData(roleGroupInsights);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter role"
                  margin="normal"
                  required
                  size="small"
                  id="role"
                  name="role"
                />
              )}
            />
          </Box>
          {data.length && data[0].value === 0 && (
            <div
              style={{
                color: "#D13E3C",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>{"there is no insights to show"}</p>
            </div>
          )}
          {data.length && data[0].value > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={data}
                  startAngle={0}
                  endAngle={360}
                  innerRadius="40%"
                  outerRadius="70%"
                  dataKey="value"
                >
                  {data[0].value === 0 ? (
                    <Cell name={"there is no insights to sow"} fill="#D13E3C" />
                  ) : (
                    data.map((insight) => (
                      <Cell
                        key={insight.property + "  " + insight.value}
                        name={insight.property + " " + insight.value}
                        fill={color[Math.floor(Math.random() * 20)]}
                      />
                    ))
                  )}
                </Pie>
                <Legend
                  iconType="circle"
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    )
  );
}

export default Insights;
