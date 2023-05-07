import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";

import run from "../assets/running.svg";

const HomePage = () => {
  return (
    <MainLayout>
      <div className="home">
        <img alt="runningMan" className="bg" src={run} />
        <div className="intro">
          <Typography variant={"h2"}>Random Route Generator</Typography>
          <Typography variant={"p"}>
            Make routes for running in only a few clicks! Try it now.
          </Typography>
          <Button
            variant={"contained"}
            size={"large"}
            onClick={() => (window.location.href = "/mymap")}
          >
            Generate
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
