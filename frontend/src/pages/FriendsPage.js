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

  const [populate, setPopulate] = useState(0);

  useEffect(() => {
    const fetchPeople = async () => {
      let { data } = await apiInstance.get("/friends", {
        headers: {
          Authorization: auth.currentUser.uid,
        },
      });
      console.log(data);
      setSearchData(data);
      setLoading(false);
    };

    const fetchRequests = async () => {
      const { data } = await apiInstance.get(`/friends/requests`, {
        headers: {
          Authorization: auth.currentUser.uid,
        },
      });
      setRequestsData(data);
      setLoading(false);
    };

    const fetchfriends = async () => {
      const { data } = await apiInstance.get(`/friends/friends`, {
        headers: {
          Authorization: auth.currentUser.uid,
        },
      });
      setFriendsData(data);
      setLoading(false);
    };

    fetchPeople();
    fetchRequests();
    fetchfriends();
  }, [populate]);


  const sendRequest = async (id) => {
    const res = await apiInstance.post("/friends", {
      targetId: id,
      uid: auth.currentUser.uid,
    });
    console.log(res);
    setPopulate(populate + 1);
  };

  const acceptRequest = async (id) => {
    const res = await apiInstance.post("/friends/accept", {
      targetId: auth.currentUser.uid,
      uid: id,
    });
    const conv = await apiInstance.post(`/conversations`, {
      senderId: auth.currentUser.uid,
      receiverId: id,
    });
    const getConv = await apiInstance.get(`/conversations/${auth.currentUser.uid}/${id}`);
    await apiInstance
      .post(`/messages`, {
        conversationId: getConv.data._id,
        userId: id,
        text: "Now we are friends",
      })
    // console.log("conv", conv);
    // console.log("res", res);
    // console.log("getConv", getConv.data._id)
    setPopulate(populate + 1);
  };

  const declineRequest = async (id) => {
    const res = await apiInstance.post("/friends/declineRequest", {
      targetId: auth.currentUser.uid,
      uid: id,
    });
    console.log(res);
    setPopulate(populate + 1);
  };

  const removeFriend = async (id) => {
    const res = await apiInstance.post("/friends/removeFriend", {
      targetId: auth.currentUser.uid,
      uid: id,
    });
    const conv = await apiInstance.get(`/conversations/delete/${id}/${auth.currentUser.uid}`);
    console.log(res);
    console.log(conv);
    setPopulate(populate + 1);
  };

  console.log(requestsData);

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
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary={o.name}
                    secondary={
                      <React.Fragment>
                        {o.status == -1 && (
                          <Button
                            onClick={() => sendRequest(o._id)}
                            variant={"contained"}
                          >
                            Add
                          </Button>
                        )}
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
          {Array.isArray(requestsData) &&
            (requestsData.length == 0 ? (
              <>No pending requests</>
            ) : (
              requestsData.map((o, i) => (
                <div key={i}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar />
                    </ListItemAvatar>
                    <ListItemText
                      primary={o.name}
                      secondary={
                        <React.Fragment>
                          <Button
                            onClick={() => acceptRequest(o._id)}
                            variant={"contained"}
                            color={"primary"}
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => declineRequest(o._id)}
                            variant={"contained"}
                            color={"secondary"}
                          >
                            Remove
                          </Button>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" />
                </div>
              ))
            ))}
        </div>
        <div className="my-f">
          <h2>My Friends</h2>
          {Array.isArray(requestsData) &&
            (friendsData.length == 0 ? (
              <>No friends to show</>
            ) : (
              friendsData.map((o, i) => (
                <div key={i}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar />
                    </ListItemAvatar>
                    <ListItemText
                      primary={o.name}
                      secondary={
                        <React.Fragment>
                          <Button
                            onClick={() => removeFriend(o._id)}
                            variant={"contained"}
                            color={"secondary"}
                          >
                            Remove
                          </Button>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" />
                </div>
              ))
            ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default FriendsPage;