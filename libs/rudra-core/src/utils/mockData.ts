export const TABLE_COLUMNS = [
  { key: 'id', label: 'ID', width: 70 },
  { key: 'name', label: 'Full Name', width: 200 },
  { key: 'email', label: 'Email Address', width: 250 },
  { key: 'department', label: 'Department', width: 150 },
  { key: 'position', label: 'Position', width: 180 },
  { key: 'status', label: 'Status', width: 120 }
];

export const MOCK_EMPLOYEES = [
  {
    id: 1,
    name: 'Alice Freeman',
    email: 'alice.f@example.com',
    department: 'Engineering',
    position: 'Senior Frontend Engineer',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Bob Vance',
    email: 'bob.v@example.com',
    department: 'Sales',
    position: 'Regional Sales Manager',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Charlie Day',
    email: 'charlie.d@example.com',
    department: 'Marketing',
    position: 'Creative Director',
    status: 'Inactive'
  },
  {
    id: 4,
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    department: 'Legal',
    position: 'General Counsel',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Ethan Hunt',
    email: 'ethan.h@example.com',
    department: 'Operations',
    position: 'Special Ops Lead',
    status: 'Active'
  },
  {
    id: 6,
    name: 'Fiona Gallagher',
    email: 'fiona.g@example.com',
    department: 'Finance',
    position: 'Junior Accountant',
    status: 'Inactive'
  },
  {
    id: 7,
    name: 'George Bluth',
    email: 'george.b@example.com',
    department: 'Executive',
    position: 'Chairman Emeritus',
    status: 'Active'
  },
  {
    id: 8,
    name: 'Hannah Abbott',
    email: 'hannah.a@example.com',
    department: 'Engineering',
    position: 'Backend Developer',
    status: 'Active'
  },
  {
    id: 9,
    name: 'Ian Wright',
    email: 'ian.w@example.com',
    department: 'Support',
    position: 'Technical Support Lead',
    status: 'Inactive'
  },
  {
    id: 10,
    name: 'Janet Snakehole',
    email: 'janet.s@example.com',
    department: 'Security',
    position: 'Security Officer',
    status: 'Active'
  },
  {
    id: 11,
    name: 'Kevin Malone',
    email: 'kevin.m@example.com',
    department: 'Finance',
    position: 'Accountant',
    status: 'Active'
  },
  {
    id: 12,
    name: 'Leslie Knope',
    email: 'leslie.k@example.com',
    department: 'Government',
    position: 'Deputy Director',
    status: 'Active'
  },
  {
    id: 13,
    name: 'Michael Scott',
    email: 'michael.s@example.com',
    department: 'Management',
    position: 'Regional Manager',
    status: 'Inactive'
  },
  {
    id: 14,
    name: 'Nancy Drew',
    email: 'nancy.d@example.com',
    department: 'Research',
    position: 'Lead Investigator',
    status: 'Active'
  },
  {
    id: 15,
    name: 'Oscar Martinez',
    email: 'oscar.m@example.com',
    department: 'Finance',
    position: 'Senior Accountant',
    status: 'Active'
  }
];

/**
 * Generates a large dataset for testing virtualization in the DataTable component
 */
export const generateLargeDataset = (count: number = 1000) => {
  const departments = ['Engineering', 'Sales', 'Marketing', 'Legal', 'Operations', 'Finance', 'Security', 'Research'];
  const positions = ['Senior Engineer', 'Manager', 'Analyst', 'Lead', 'Specialist', 'Director', 'Associate'];
  const statuses: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Employee Name ${i + 1}`,
    email: `employee.${i + 1}@company.com`,
    department: departments[i % departments.length],
    position: positions[i % positions.length],
    status: i % 8 === 0 ? statuses[1] : statuses[0]
  }));
};
