import { usePlacesAutocomplete } from "@ttoss/google-maps";
import { Box, Flex, Input, Text } from "@ttoss/ui";
import React from "react";

type Suggestion = {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  saved?: boolean;
};

export const SearchInputPlace = () => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    cacheKey: import.meta.env.VITE_GOOGLE_MAPS_API,
  });

  console.log(ready, value, status, data, import.meta.env.VITE_GOOGLE_MAPS_API);

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const renderSuggestions = React.useMemo(() => {
    return (
      <Box>
        {(data as Suggestion[]).map((suggestion, idx, list) => {
          const {
            place_id,
            structured_formatting: { main_text, secondary_text },
            // saved,
          } = suggestion;

          return (
            <Flex
              key={place_id}
              sx={{
                minHeight: 32,
                paddingLeft: 6,
                alignItems: "center",
                gap: 6,
                paddingTop: 6,
                zIndex: 1,
                cursor: "pointer",
                ":hover": {
                  backgroundColor: "muted",
                },
              }}
              onClick={() => {
                setValue(suggestion.description, false);
                clearSuggestions();
              }}
            >
              <Flex sx={{ flexDirection: "column", width: "100%" }}>
                <Text sx={{ color: "dark" }} as="strong">
                  {main_text}
                </Text>
                <Text as="p" sx={{ marginBottom: 6 }}>
                  <Text as="small" sx={{ color: "text" }}>
                    {secondary_text}
                  </Text>
                </Text>
                {idx < list.length - 1 && (
                  <Box as="hr" sx={{ borderTop: "solid 1px" }} />
                )}
              </Flex>
            </Flex>
          );
        })}
      </Box>
    );
  }, [clearSuggestions, data, setValue]);

  return (
    <Flex>
      <Input
        aria-roledescription="input-search-autocomplete"
        className="header-search-input"
        id="input-search-autocomplete"
        variant="input-search"
        sx={{
          width: "100%",
          backgroundColor: "#D6D0D9",
        }}
        onPaste={(e) => {
          const pastedText = e.clipboardData.getData("text/plain");

          setValue(pastedText);
        }}
        placeholder="Digite um lugar"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            clearSuggestions();
          }
        }}
        value={value}
        onChange={handleInput}
      />
      {status === "OK" && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 10,
            top: 55,
            width: "100%",
            paddingTop: 6,
            boxShadow: 2,
            paddingInlineStart: 0,
            backgroundColor: "background",
          }}
        >
          {renderSuggestions}
        </Box>
      )}
    </Flex>
  );
};
