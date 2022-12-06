import React from "react";
import { Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Box, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const drawerWidth = 240;

const Sidebar = ({ loggedIn_id }) => {
  const { user } = useSelector((state) => state.user);
  return (
    <Box>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box>
          <List>
            <Link to="/home" style={{ textDecoration: "none", color: "black" }}>
              <ListItem button>
                <ListItemText primary={"Home"} />
              </ListItem>
            </Link>
            {user.role === "hr" && (
              <Link
                to="/history"
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItem button>
                  <ListItemText primary={"History"} />
                </ListItem>
              </Link>
            )}
            {user.role === "interviewer" && (
              <Link
                to={`/history/${loggedIn_id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItem button>
                  <ListItemText primary={"History"} />
                </ListItem>
              </Link>
            )}
            {user.role === "hr" && (
              <Link
                to="/review"
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItem button>
                  <ListItemText primary={"Review / Task"} />
                </ListItem>
              </Link>
            )}

            {(user.role === "super-admin" || user.role === "admin") && (
              <Link
                to="/setting"
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItem button>
                  <ListItemText primary={"Setting"} />
                </ListItem>
              </Link>
            )}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
