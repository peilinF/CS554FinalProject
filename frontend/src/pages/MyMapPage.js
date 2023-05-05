import React, { useEffect, useRef, useState } from "react";
import AddressAutoComplete from "../components/Forms/AddressAutoComplete";

import "./styles.scss";

import Map from "../components/YashMap";
import MainLayout from "../layouts/MainLayout";
import { mapApiInstance } from "../utils/mapApiInstance";

const MyMapPage = () => {
  //Default at Stevens
  const [latLng, setLatLng] = useState({ lng: -74.025435, lat: 40.74696 });

  const [destLatLng, setDestLatLng] = useState(null);

  return (
    <MainLayout>
      <div className="home">
        <Map latLng={latLng} setLatLng={setLatLng} destLatLng={destLatLng} />
        <AddressAutoComplete
          latLng={latLng}
          setLatLng={setLatLng}
          setDestLatLng={setDestLatLng}
        />
      </div>
    </MainLayout>
  );
};

export default MyMapPage;
