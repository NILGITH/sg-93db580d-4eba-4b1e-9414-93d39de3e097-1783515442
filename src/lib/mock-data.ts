// Données mockées pour mode démo (quand Supabase n'est pas accessible)

export const mockProfiles = {
  admin: {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@immo360.com",
    first_name: "Admin",
    last_name: "Système",
    phone: "+22997000001",
    role: "admin",
    is_active: true,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  agent: {
    id: "00000000-0000-0000-0000-000000000002",
    email: "agent1@immo360.com",
    first_name: "Kofi",
    last_name: "Mensah",
    phone: "+22997000002",
    role: "agent",
    is_active: true,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export const mockProperties = [
  {
    id: "1",
    title: "Villa Moderne Cocody",
    type: "villa",
    status: "disponible",
    transaction_type: "vente",
    price: 85000000,
    address: "Cocody Riviera Golf",
    city: "Abidjan",
    district: "Cocody",
    neighborhood: "Riviera Golf",
    rooms: 5,
    bathrooms: 4,
    surface: 350,
    description: "Magnifique villa moderne avec piscine",
    published: true,
    photos: ["/generated/property-1.png"],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Appartement Standing Plateau",
    type: "appartement",
    status: "disponible",
    transaction_type: "location",
    price: 450000,
    address: "Plateau Avenue Chardy",
    city: "Abidjan",
    district: "Plateau",
    neighborhood: "Centre-ville",
    rooms: 3,
    bathrooms: 2,
    surface: 120,
    description: "Appartement de standing avec vue panoramique",
    published: true,
    photos: ["/generated/property-2.png"],
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Bureau Moderne Zone 4",
    type: "bureau",
    status: "disponible",
    transaction_type: "location",
    price: 800000,
    address: "Marcory Zone 4",
    city: "Abidjan",
    district: "Marcory",
    neighborhood: "Zone 4",
    rooms: 8,
    bathrooms: 3,
    surface: 200,
    description: "Espace bureau climatisé avec parking",
    published: true,
    photos: ["/generated/property-3.png"],
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Terrain Constructible Bingerville",
    type: "terrain",
    status: "disponible",
    transaction_type: "vente",
    price: 15000000,
    address: "Bingerville Route d'Abatta",
    city: "Bingerville",
    district: "Bingerville",
    neighborhood: "Abatta",
    rooms: 0,
    bathrooms: 0,
    surface: 500,
    description: "Terrain viabilisé prêt à construire",
    published: true,
    photos: ["/generated/property-4.png"],
    created_at: new Date().toISOString(),
  },
];

export const mockStats = {
  totalProperties: 24,
  availableProperties: 18,
  rentedProperties: 4,
  soldProperties: 2,
  totalRevenue: 45800000,
  monthlyRevenue: 3200000,
  pendingPayments: 850000,
  totalVisits: 156,
  scheduledVisits: 12,
  totalProspects: 89,
  newProspects: 15,
  activeBookings: 8,
  pendingInterventions: 5,
};

export const mockRevenueData = [
  { month: "Jan", revenue: 2800000 },
  { month: "Fév", revenue: 3100000 },
  { month: "Mar", revenue: 2900000 },
  { month: "Avr", revenue: 3400000 },
  { month: "Mai", revenue: 3000000 },
  { month: "Jui", revenue: 3200000 },
];

export const mockPropertyTypeData = [
  { name: "Appartements", value: 10, fill: "#3282B8" },
  { name: "Villas", value: 6, fill: "#16213E" },
  { name: "Bureaux", value: 4, fill: "#1A1A2E" },
  { name: "Commerces", value: 2, fill: "#BBE1FA" },
  { name: "Terrains", value: 2, fill: "#0F4C75" },
];

export const mockTopProperties = [
  { name: "Villa Cocody", prix: 85000000 },
  { name: "Duplex Riviera", prix: 72000000 },
  { name: "Penthouse Plateau", prix: 65000000 },
  { name: "Villa Marcory", prix: 58000000 },
  { name: "Bureau Zone 4", prix: 45000000 },
];

export function getMockProfile(email: string) {
  if (email === "admin@immo360.com") return mockProfiles.admin;
  if (email === "agent1@immo360.com") return mockProfiles.agent;
  return mockProfiles.agent; // Default
}

export function isInDemoMode(): boolean {
  // Mode démo activé si nous sommes en développement et que Supabase n'est pas accessible
  return typeof window !== "undefined" && process.env.NODE_ENV === "development";
}