/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGoogleMaps, useMap } from "@ttoss/google-maps";
import { Box, Flex } from "@ttoss/ui";
import React from "react";
import ReactJson from "react-json-view";

function App() {
  const { ref, map } = useMap();
  const { status } = useGoogleMaps();

  const [location, setLocation] = React.useState<any>({
    // Rinconada Library
    lat: 37.4449739,
    lng: -122.13914659999998,
  });

  const [buildingInsights, setBuildingInsights] = React.useState<any>({});
  const [dataLayers, setDataLayers] = React.useState<any>({});

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
    if (dataLayers.maskUrl) {
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
    if (status === "ready" && map) {
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
  }, [status]);

  return (
    <Flex
      sx={{
        paddingY: "2xl",
        paddingX: "md",
        gap: "lg",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box ref={ref} style={{ height: 640, width: 860 }} />

      <Flex
        sx={{
          overflowY: "scroll",
          flex: "1",
          wordBreak: "break-all",
          "& > *": {
            width: "100%",
          },
        }}
      >
        <ReactJson
          collapsed
          theme={"solarized"}
          src={{ buildingInsights, dataLayers }}
        />
      </Flex>
    </Flex>
  );
}

export default App;
