export const VESSEL_TYPES = [
  { value: 'cargo', label: 'Cargo' },
  { value: 'tanker', label: 'Tanker' },
  { value: 'passenger', label: 'Passenger' },
  { value: 'fishing', label: 'Fishing' },
  { value: 'research', label: 'Research' },
  { value: 'other', label: 'Other' },
];

export const FUEL_TYPES = [
  { value: 'diesel', label: 'Diesel' },
  { value: 'heavy_fuel_oil', label: 'Heavy Fuel Oil' },
  { value: 'lng', label: 'LNG' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const VESSEL_STATUS = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'docked', label: 'Docked', color: 'blue' },
  { value: 'maintenance', label: 'Maintenance', color: 'yellow' },
  { value: 'retired', label: 'Retired', color: 'gray' },
];

export const ZONE_TYPES = [
  { value: 'coral_reef', label: 'Coral Reef' },
  { value: 'whale_migration', label: 'Whale Migration' },
  { value: 'marine_protected_area', label: 'Marine Protected Area' },
  { value: 'breeding_ground', label: 'Breeding Ground' },
  { value: 'fishing_restricted', label: 'Fishing Restricted' },
  { value: 'pollution_sensitive', label: 'Pollution Sensitive' },
];

export const PROTECTION_LEVELS = [
  { value: 'no_entry', label: 'No Entry', color: 'red' },
  { value: 'speed_restricted', label: 'Speed Restricted', color: 'orange' },
  { value: 'monitored', label: 'Monitored', color: 'yellow' },
  { value: 'advisory', label: 'Advisory', color: 'blue' },
];

export const ROUTE_STATUS = [
  { value: 'planned', label: 'Planned', color: 'blue' },
  { value: 'in_progress', label: 'In Progress', color: 'yellow' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
];

export const USER_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'fleet_manager', label: 'Fleet Manager' },
  { value: 'ship_captain', label: 'Ship Captain' },
  { value: 'environmental_officer', label: 'Environmental Officer' },
];