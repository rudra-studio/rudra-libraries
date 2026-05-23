export interface FormatterProps {
  name: string;
  age: number;
}

export default function formatter({name, age}: FormatterProps) {
  // Util'ity function logic here
  return `Hi ${name}, your age is ${age}`
}
