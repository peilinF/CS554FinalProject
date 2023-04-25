const customIcon = (img) => {

  // If there is an image, use it as the icon
  // Otherwise, use the default icon

  if (img) {
    return {
      url: img,
      scaledSize: new window.google.maps.Size(100, 100),
    };
  } else {
    return {
      url: "https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png&text=A&psize=16&font=fonts/Roboto-Regular.ttf&color=ff333333&ax=44&ay=48&scale=1"
    };
  }
};  

export {customIcon};
