/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGoogleMaps, useMap } from "@ttoss/google-maps";
import { Box, Flex } from "@ttoss/ui";
import React from "react";
import ReactJson from "react-json-view";
import { SearchInputPlace } from "./SearchInputPlace";
import SolarPotentialForm from "./SolarPotentialForm";

function App() {
  const { ref, map } = useMap();
  const { status: statusMap } = useGoogleMaps();

  const [location, setLocation] = React.useState<any>({
    // Endereço USA:Rinconada Library
    lat: 37.4449739,
    lng: -122.13914659999998,

    // Endereço BR-RJ: Clube Naval Piraquê
    // lat: -22.9679557,
    // lng: -43.216478,
  });

  const [buildingInsights, setBuildingInsights] = React.useState<any>(null);
  const [dataLayers, setDataLayers] = React.useState<any>(null);

  const getBuildingInsights = async () => {
    try {
      const res = await fetch(
        `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${
          location.lat
        }&location.longitude=${location.lng}&requiredQuality=HIGH&key=${
          import.meta.env.VITE_GOOGLE_MAPS_API
        }`
      );

      const data = await res.json();

      setBuildingInsights(data);
    } catch (err) {
      console.log("err::getBuildingInsights::", err);
    }
  };

  const getDataLayers = async () => {
    try {
      const res = await fetch(
        `https://solar.googleapis.com/v1/dataLayers:get?location.latitude=${
          location.lat
        }&location.longitude=${
          location.lng
        }&radiusMeters=100&view=FULL_LAYERS&requiredQuality=HIGH&pixelSizeMeters=0.5&key=${
          import.meta.env.VITE_GOOGLE_MAPS_API
        }`
      );
      const data = await res.json();

      setDataLayers(data);
    } catch (err) {
      console.log("err::getdataLayers::", err);
    }
  };

  function prepareGetGeoTiffUrl(geoTiffUrl: string) {
    if (geoTiffUrl.match("solar.googleapis.com")) {
      const url = new URL(geoTiffUrl);
      url.searchParams.set("apiKey", import.meta.env.VITE_GOOGLE_MAPS_API);
      return url.toString();
    }
    return geoTiffUrl;
  }

  const getDataBasedInUrl = async (baseUrl: string) => {
    try {
      const res = await fetch(
        `${baseUrl}&key=${import.meta.env.VITE_GOOGLE_MAPS_API}`
      );
      const data = await res.blob();

      console.log("baseUrl::", baseUrl, { data });
    } catch (error) {
      console.log("err::getDataBasedInUrl::", error);
    }
  };

  React.useEffect(() => {
    if (dataLayers?.maskUrl) {
      getDataBasedInUrl(dataLayers.maskUrl);
      console.log(
        "prepareGetGeoTiffUrl:::",
        prepareGetGeoTiffUrl(dataLayers.maskUrl)
      );
    }
  }, [dataLayers]);

  React.useEffect(() => {
    getBuildingInsights();
    getDataLayers();
  }, [location]);

  React.useEffect(() => {
    if (statusMap === "ready" && map) {
      map.setCenter(location);

      map.setZoom(20);
      map.setMapTypeId("satellite");

      map.addListener("dragend", () => {
        const latLng = {
          lat: map.getCenter()?.lat(),
          lng: map.getCenter()?.lng(),
        };

        setLocation(latLng);
      });
    }
  }, [statusMap]);

  return (
    <Flex sx={{ flexDirection: "column", backgroundColor: "#FFFBFE" }}>
      <Flex sx={{}}>
        <Box ref={ref} sx={{ height: 750, width: "100%", maxWidth: "70vw" }} />
        <Box sx={{ width: "30vw", padding: "2xl" }}>
          <SearchInputPlace />

          {!!buildingInsights && !!dataLayers && (
            <SolarPotentialForm
              solarData={{ ...buildingInsights, ...dataLayers }}
            />
          )}
        </Box>
      </Flex>
      <Flex
        sx={{
          paddingY: "2xl",
          paddingX: "md",
          gap: "lg",
          width: "100%",
          overflow: "hidden",
          // marginX: "xs",
        }}
      >
        <Flex
          sx={{
            overflowY: "scroll",
            flex: "1",
            wordBreak: "break-all",
            // "& > *": {
            //   width: "100%",
            // },
          }}
        >
          <ReactJson
            collapsed
            theme={"apathy:inverted"}
            src={{ buildingInsights, dataLayers }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;
