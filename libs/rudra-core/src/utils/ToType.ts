export interface ToTypeProps {
  value: any;
  type: "string" | "boolean" | "array" | "object"; /* @select|string|boolean|array|object */
}

export default function ToType({ value, type }: ToTypeProps): any {
  // Handle null or undefined gracefully based on the requested type
  if (value === undefined || value === null) {
    switch (type) {
      case "string": return "";
      case "boolean": return false;
      case "array": return [];
      case "object": return {};
    }
  }

  switch (type) {
    case "string":
      // Safely stringify objects/arrays
      if (typeof value === "object") {
        try {
          return JSON.stringify(value);
        } catch {
          return String(value);
        }
      }
      return String(value);

    case "boolean":
      // Handle human-readable string booleans
      if (typeof value === "string") {
        const lower = value.toLowerCase().trim();
        if (["true", "1", "yes", "on"].includes(lower)) return true;
        if (["false", "0", "no", "off"].includes(lower)) return false;
      }
      return Boolean(value);

    case "array":
      if (Array.isArray(value)) return value;
      
      // If it's a string, see if it's a stringified array
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          // If it fails to parse, just fall through and wrap it in an array
        }
      }
      // Fallback: wrap the value in an array
      return [value];

    case "object":
      if (typeof value === "object" && !Array.isArray(value)) return value;
      
      // If it's a string, see if it's a stringified object
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
            return parsed;
          }
        } catch {
          // If it fails to parse, fall through
        }
      }
      // Fallback: wrap the raw value inside an object
      return { value };

    default:
      return value;
  }
}