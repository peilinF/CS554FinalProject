import React, { useEffect, useRef, useState } from "react";

import "./styles.scss";

import Map from "../components/Map/Map";
import MainLayout from "../layouts/MainLayout";

const MyMapPage = () => {

  return (
    <MainLayout className="home">
        <Map />
    </MainLayout>
  );
};

export default MyMapPage;
