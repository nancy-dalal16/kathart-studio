import React, { useEffect, useState, useCallback } from "react";
import { useClient } from "sanity";
import { MultiSelectInput } from "./MultiSelectInput";

const BASE_TAGS = [
  "Branding", "Typography", "Motion", "UX/UI", "Illustration",
  "Photography", "Print", "Web Design", "Social Media", "Identity",
  "Packaging", "Editorial", "Art Direction", "3D", "Animation",
];

export function TagsInput(props) {
  const { value = [], onChange, readOnly } = props;
  const client = useClient({ apiVersion: "2024-06-01" });
  const [options, setOptions] = useState(BASE_TAGS);

  useEffect(() => {
    let alive = true;
    client
      .withConfig({ perspective: "raw" })
      .fetch(`array::unique(*[_type == "project" && defined(tags)].tags[])`)
      .then((vals) => {
        if (!alive) return;
        const merged = Array.from(new Set([...BASE_TAGS, ...(vals || [])])).filter(Boolean);
        setOptions(merged);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [client]);

  const handleAddOption = useCallback((newTag) => {
    setOptions((prev) => (prev.includes(newTag) ? prev : [...prev, newTag]));
  }, []);

  return (
    <MultiSelectInput
      value={Array.isArray(value) ? value : []}
      onChange={onChange}
      options={options}
      readOnly={readOnly}
      placeholder="Select or add tags…"
      onAddOption={handleAddOption}
    />
  );
}
