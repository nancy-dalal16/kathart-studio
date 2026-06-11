import React, { useEffect, useState, useCallback } from "react";
import { set, unset, useClient } from "sanity";
import { MultiSelectInput } from "./MultiSelectInput";

const BASE_FIELDS = ["Design", "Films", "Marketing"];

export function CreativeFieldInput(props) {
  const { value = [], onChange, readOnly } = props;
  const client = useClient({ apiVersion: "2024-06-01" });
  const [options, setOptions] = useState(BASE_FIELDS);

  useEffect(() => {
    let alive = true;
    client
      .withConfig({ perspective: "raw" })
      .fetch(`array::unique(*[_type == "project" && defined(category)].category[])`)
      .then((vals) => {
        if (!alive) return;
        const merged = Array.from(new Set([...BASE_FIELDS, ...(vals || [])])).filter(Boolean);
        setOptions(merged);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [client]);

  const handleAddOption = useCallback((newOption) => {
    setOptions((prev) =>
      prev.includes(newOption) ? prev : [...prev, newOption]
    );
  }, []);

  const handleChange = useCallback(
    (patch) => onChange(patch),
    [onChange]
  );

  return (
    <MultiSelectInput
      value={Array.isArray(value) ? value : value ? [value] : []}
      onChange={handleChange}
      options={options}
      readOnly={readOnly}
      placeholder="Select creative fields…"
      onAddOption={handleAddOption}
    />
  );
}
