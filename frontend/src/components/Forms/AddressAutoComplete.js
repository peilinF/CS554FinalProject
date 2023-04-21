import React from "react";
import axios from "axios";

import "./styles.scss";

const AddressAutoComplete = () => {
  const fsqAPIToken = "fsq3PnhE5Zyd+DmfVJu+uHVFrTf/db8notB4S3S10xBz/JM=";
  let sessionToken = generateRandomSessionToken();
  const addressInput = document.getElementById("autofill-search");
  const dropDownField = document.getElementById("autofill-dropdown");
  const ulField = document.getElementById("autofill-suggestions");
  const errorField = document.getElementById("autofill-error");
  const notFoundField = document.getElementById("autofill-not-found");
  const cityInput = document.getElementById("autofill-city");
  const regionInput = document.getElementById("autofill-region");
  const countryInput = document.getElementById("autofill-country");
  const postcodeInput = document.getElementById("autofill-postcode");
  const address2Input = document.getElementById("autofill-address2");
  const form = document.getElementById("autofill-form");
  const searchContainer = document.getElementById("autofill-search-container");
  const findMeButton = document.getElementById("autofill-findme");
  let latLng = {};
  let isFetching = false;
  form && form.addEventListener("submit", (e) => e.preventDefault(), true);
  const onChangeAutoComplete = debounce(changeAutoComplete);

  //   addressInput && addressInput.addEventListener("input", onChangeAutoComplete);
  searchContainer &&
    searchContainer.addEventListener("focusin", focusEventAutoComplete);
  searchContainer &&
    searchContainer.addEventListener("focusout", focusEventAutoComplete);
  ulField && ulField.addEventListener("click", selectItem);
  findMeButton && findMeButton.addEventListener("click", getCurrentPosition);

  function focusEventAutoComplete(event) {
    if (event.type === "focusin" && event.target.value) {
      dropDownField.style.display = "block";
    } else if (
      event.type === "focusout" &&
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      dropDownField.style.display = "none";
    }
  }

  function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latLng.lat = position.coords.latitude;
        latLng.lng = position.coords.longitude;
      },
      (error) => {
        if (error) {
          latLng = {};
          console.warn(error);
        }
      }
    );
  }

  function logError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  /* Generate a random string with 32 characters.
             Session Token is a user-generated token to identify a session for billing purposes. 
             Learn more about session tokens.
             https://docs.foursquare.com/reference/session-tokens
          */
  function generateRandomSessionToken(length = 32) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < length; i++) {
      result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  }

  async function changeAutoComplete({ target }) {
    console.log(target);
    const { value: inputSearch = "" } = target;
    ulField.innerHTML = "";
    notFoundField.style.display = "none";
    errorField.style.display = "none";
    if (inputSearch.length && !isFetching) {
      try {
        isFetching = true;
        const results = await autoComplete(inputSearch);
        if (results && results.length) {
          results.forEach((value) => {
            addItem(value);
          });
        } else {
          notFoundField.innerHTML = `Foursquare can't find ${inputSearch}. Make sure your search is spelled correctly.`;
          notFoundField.style.display = "block";
        }
      } catch (err) {
        errorField.style.display = "block";
        logError(err);
      } finally {
        isFetching = false;
        dropDownField.style.display = "block";
      }
    } else {
      dropDownField.style.display = "none";
    }
  }

  const options = {
    headers: {
      accept: "application/json",
      Authorization: "fsq3PnhE5Zyd+DmfVJu+uHVFrTf/db8notB4S3S10xBz/JM=",
    },
  };

  async function autoComplete(query) {
    try {
      const params = {
        query,
        types: "address",
        session_token: sessionToken,
      };
      if (latLng.lat && latLng.lng) {
        params.ll = `${latLng.lat},${latLng.lng}`;
      }
      const searchParams = new URLSearchParams(params).toString();
      const searchResults = await axios.get(
        `https://api.foursquare.com/v3/autocomplete?${searchParams}`,
        { headers: options.headers }
      );
      const data = await searchResults.data;
      console.log(data);
      return data.results;
    } catch (error) {
      throw error;
    }
  }

  function addItem(value) {
    const { link } = value;
    if (!link) return;
    ulField.innerHTML += `
    <button className="autofill--dropdown-item autofill--text" data-object=${link}> <div>${highlightedNameElement(
      value.text
    )}</div> <div className="autofill--secondary-text">${
      value.text.secondary
    }</div></button>`;
  }

  async function selectItem({ target }) {
    if (target.tagName === "BUTTON") {
      const link = target.dataset.object;
      const addressDetail = await fetchAddressDetails(link);
      const { location = {} } = addressDetail;
      const {
        address = "",
        country = "",
        postcode = "",
        locality = "",
        region = "",
      } = location;
      addressInput.value = address;
      address2Input.value = "";
      countryInput.value = country;
      postcodeInput.value = postcode;
      cityInput.value = locality;
      regionInput.value = region;
      // generate new session token after a complete search
      sessionToken = generateRandomSessionToken();

      address2Input && address2Input.focus();
      dropDownField.style.display = "none";
    }
  }

  async function fetchAddressDetails(link) {
    try {
      const results = await fetch(`https://api.foursquare.com${link}`, {
        method: "get",
        headers: new Headers({
          Accept: "application/json",
          Authorization: fsqAPIToken,
        }),
      });
      const data = await results.json();
      return data;
    } catch (err) {
      logError(err);
    }
  }

  function highlightedNameElement(textObject) {
    if (!textObject) return "";
    const { primary, highlight } = textObject;
    if (highlight && highlight.length) {
      let beginning = 0;
      let hightligtedWords = "";
      for (let i = 0; i < highlight.length; i++) {
        const { start, length } = highlight[i];
        hightligtedWords += primary.substr(beginning, start - beginning);
        hightligtedWords += "<b>" + primary.substr(start, length) + "</b>";
        beginning = start + length;
      }
      hightligtedWords += primary.substr(beginning);
      return hightligtedWords;
    }
    return primary;
  }

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  return (
    <form id="autofill-form">
      <div className="autofill--text autofill--heading">Demo</div>
      <div className="autofill--row">
        <p className="autofill--text">Center search on my currrent location.</p>
        <div className="autofill--text autofill--findme" id="autofill-findme">
          <img src="https://files.readme.io/0d519df-image.png" />
          Find me
        </div>
      </div>
      <div className="autofill--row" id="autofill-search-container">
        <input
          type="text"
          id="autofill-search"
          className="autofill--input autofill--text"
          placeholder="Address"
          onChange={(e) => {
            onChangeAutoComplete(e);
          }}
        />
        <br />
        <div id="autofill-dropdown" className="autofill--text">
          <ul id="autofill-suggestions"></ul>
          <div
            id="autofill-error"
            className="autofill--error autofill--background-icon"
          >
            Something went wrong. Please refresh and try again.
          </div>
          <div
            id="autofill-not-found"
            className="autofill--error autofill--background-icon"
          ></div>
          <div className="autofill--copyright">
            <img
              src="https://files.readme.io/a8cc85b-Group_7.png"
              alt="powered by foursquare"
            />
          </div>
        </div>
      </div>
      <div className="autofill--row">
        <input
          type="text"
          id="autofill-address2"
          className="autofill--input autofill--text"
          placeholder="Apt, Suite, etc (optional)"
        />
      </div>
      <div className="autofill--row">
        <input
          type="text"
          id="autofill-city"
          className="autofill--input autofill--text"
          placeholder="City"
        />
      </div>
      <div className="autofill--row">
        <input
          type="text"
          id="autofill-region"
          className="autofill--input autofill--text"
          placeholder="State/Province"
        />
      </div>
      <div className="autofill--row">
        <input
          type="text"
          id="autofill-postcode"
          className="autofill--input autofill--text"
          placeholder="Zip/Postal Code"
        />
      </div>
      <div className="autofill--row">
        <input
          type="text"
          id="autofill-country"
          className="autofill--input autofill--text"
          placeholder="Country"
        />
      </div>
      <div className="autofill--row">
        <input
          type="reset"
          value="Clear"
          className="autofill-button autofill--text"
        />
        <input
          type="submit"
          value="Done"
          className="autofill-button autofill--text"
        />
      </div>
    </form>
  );
};

export default AddressAutoComplete;
