import React, { useEffect, useState } from "react";
import { apiInstance } from "../utils/apiInstance";
import MainLayout from "../layouts/MainLayout";

import "./styles.scss";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { getAuth } from "firebase/auth";

const FriendsPage = () => {
  const [searchData, setSearchData] = useState([]);
  const [requestsData, setRequestsData] = useState([]);
  const [friendsData, setFriendsData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const auth = getAuth();

  useEffect(() => {
    const fetchPeople = async () => {
      const { data } = await apiInstance.get("/friends");
      console.log(data);
      setSearchData(data);
      setLoading(false);
    };

    const fetchRequests = async () => {
      const { data } = await apiInstance.get(
        `/friends/requests/${auth.currentUser.uid}`
      );
      setRequestsData(data);
      setLoading(false);
    };

    const fetchfriends = async () => {
      const { data } = await apiInstance.get(
        `/friends/friends/${auth.currentUser.uid}`
      );
      setFriendsData(data);
      setLoading(false);
    };

    fetchPeople();
    fetchRequests();
    fetchfriends();
  }, []);

  console.log(friendsData);

  if (loading) return <div className="loader"></div>;

  return (
    <MainLayout>
      <div className="social-page">
        <div className="search-f">
          <h2>Search</h2>

          {/* <form>
            <TextField
              id="search-bar"
              className="text"
              onInput={(e) => {
                setSearchQuery(e.target.value);
              }}
              label="Enter Name"
              variant="outlined"
              placeholder="Search..."
              size="small"
            />
            <IconButton type="submit" aria-label="search">
              <Search style={{ fill: "blue" }} />
            </IconButton>
          </form> */}
          <div className="flist">
            {searchData.map((o, i) => (
              <div key={i}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={o.name}
                    secondary={
                      <React.Fragment>
                        <Button variant={"contained"}>Add</Button>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" />
              </div>
            ))}
          </div>
        </div>
        <div className="requests-f">
          <h2>Requests</h2>
        </div>
        <div className="my-f">
          <h2>My Friends</h2>{" "}
        </div>
      </div>
    </MainLayout>
  );
};

export default FriendsPage;
