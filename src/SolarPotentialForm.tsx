/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Box, Input, Label, Heading, Text } from "@ttoss/ui";

type SolarPotentialFormProps = {
  solarData: any;
};

const SolarPotentialForm = ({ solarData }: SolarPotentialFormProps) => {
  const [formData, setFormData] = useState({
    latitude: solarData?.center?.latitude,
    longitude: solarData?.center?.longitude,
    postalCode: solarData?.postalCode,
    administrativeArea: solarData?.administrativeArea,
    statisticalArea: solarData?.statisticalArea,
    regionCode: solarData?.regionCode,
    maxArrayPanelsCount: solarData?.solarPotential?.maxArrayPanelsCount,
    maxArrayAreaMeters2: solarData?.solarPotential?.maxArrayAreaMeters2,
    maxSunshineHoursPerYear: solarData?.solarPotential?.maxSunshineHoursPerYear,
    carbonOffsetFactorKgPerMwh:
      solarData?.solarPotential?.carbonOffsetFactorKgPerMwh,
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box as="form" sx={{ mx: "auto", p: 3, paddingX: "lg" }}>
      <Text
        sx={{
          alignSelf: "center",
          color: "#6750A4",
          fontSize: "xl",
          paddingTop: "2xl",
          fontWeight: "bold",
        }}
      >
        Proposal Generator
      </Text>
      <Heading as="h3" sx={{ color: "#625B71" }}>
        Solar Potential Analysis
      </Heading>
      {Object.entries(formData).map(([key, value]) => (
        <Box key={key} mb={3}>
          <Label sx={{ color: "#6750A4" }} htmlFor={key}>
            {key}
          </Label>

          <Input
            name={key}
            value={value}
            onChange={handleChange}
            mb={2}
            sx={{
              borderColor: "gray",
              "&:focus": {
                outline: "none",
                borderColor: "#6750A4",
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default SolarPotentialForm;
