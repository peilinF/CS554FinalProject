import React, { useEffect, useRef, useState } from "react";
import AddressAutoComplete from "../components/Forms/AddressAutoComplete";

import "./styles.scss";

import Map from "../components/Map";
import MainLayout from "../layouts/MainLayout";

const HomePage = () => {
  const [latLng, setLatLng] = useState({ lng: -74, lat: 40.7123 });

  console.log(latLng);
  return (
    <MainLayout className="home">
      <Map latLng={latLng} setLatLng={setLatLng} />
      <AddressAutoComplete latLng={latLng} setLatLng={setLatLng} />
    </MainLayout>
  );
};

export default HomePage;
