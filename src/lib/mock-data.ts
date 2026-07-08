// Données mockées complètes pour mode démo (sans Supabase)

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
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
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
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  secretary: {
    id: "00000000-0000-0000-0000-000000000003",
    email: "secretaire@immo360.com",
    first_name: "Sophie",
    last_name: "Koffi",
    phone: "+22997000004",
    role: "secretary",
    is_active: true,
    avatar_url: null,
    created_at: "2024-01-20T09:00:00Z",
    updated_at: "2024-01-20T09:00:00Z",
  },
  accountant: {
    id: "00000000-0000-0000-0000-000000000004",
    email: "comptable@immo360.com",
    first_name: "Jean",
    lastName: "Kouassi",
    phone: "+22997000005",
    role: "accountant",
    is_active: true,
    avatar_url: null,
    created_at: "2024-01-20T09:00:00Z",
    updated_at: "2024-01-20T09:00:00Z",
  },
  provider: {
    id: "00000000-0000-0000-0000-000000000005",
    email: "plombier@immo360.com",
    first_name: "Yao",
    last_name: "Ahomadegbe",
    phone: "+22997000006",
    role: "provider",
    is_active: true,
    avatar_url: null,
    created_at: "2024-02-01T08:00:00Z",
    updated_at: "2024-02-01T08:00:00Z",
  },
  owner: {
    id: "00000000-0000-0000-0000-000000000006",
    email: "proprietaire1@gmail.com",
    first_name: "Serge",
    last_name: "Adjanohoun",
    phone: "+22997000009",
    role: "owner",
    is_active: true,
    avatar_url: null,
    created_at: "2024-02-10T07:00:00Z",
    updated_at: "2024-02-10T07:00:00Z",
  },
};

// 50+ biens immobiliers variés
export const mockProperties = [
  // Appartements (15)
  { id: "prop-1", title: "Appartement Moderne Cocody", type: "appartement", status: "disponible", transaction_type: "location", price: 450000, address: "Cocody Riviera Golf", city: "Abidjan", district: "Cocody", neighborhood: "Riviera Golf", rooms: 3, bathrooms: 2, surface: 120, description: "Appartement standing avec piscine commune", published: true, photos: ["/generated/property-1.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-01-10T10:00:00Z" },
  { id: "prop-2", title: "Studio Meublé Plateau", type: "appartement", status: "loue", transaction_type: "location", price: 180000, address: "Plateau Centre", city: "Abidjan", district: "Plateau", neighborhood: "Centre", rooms: 1, bathrooms: 1, surface: 35, description: "Studio tout équipé", published: true, photos: ["/generated/property-2.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-01-12T11:00:00Z" },
  { id: "prop-3", title: "Duplex Marcory Zone 4", type: "appartement", status: "disponible", transaction_type: "location", price: 650000, address: "Marcory Zone 4", city: "Abidjan", district: "Marcory", neighborhood: "Zone 4", rooms: 4, bathrooms: 3, surface: 180, description: "Grand duplex avec terrasse", published: true, photos: ["/generated/property-3.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-01-15T09:00:00Z" },
  { id: "prop-4", title: "F3 Yopougon Niangon", type: "appartement", status: "disponible", transaction_type: "location", price: 200000, address: "Yopougon Niangon Sud", city: "Abidjan", district: "Yopougon", neighborhood: "Niangon", rooms: 3, bathrooms: 2, surface: 90, description: "Appartement familial sécurisé", published: true, photos: ["/generated/property-4.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-01-20T08:00:00Z" },
  { id: "prop-5", title: "Penthouse Riviera Bonoumin", type: "appartement", status: "disponible", transaction_type: "vente", price: 65000000, address: "Riviera Bonoumin", city: "Abidjan", district: "Cocody", neighborhood: "Bonoumin", rooms: 5, bathrooms: 4, surface: 250, description: "Penthouse luxe vue panoramique", published: true, photos: ["/generated/property-5.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-02-01T10:00:00Z" },
  
  // Villas (12)
  { id: "prop-6", title: "Villa Prestige Cocody", type: "villa", status: "disponible", transaction_type: "vente", price: 85000000, address: "Cocody II Plateaux", city: "Abidjan", district: "Cocody", neighborhood: "II Plateaux", rooms: 6, bathrooms: 5, surface: 400, description: "Villa standing avec piscine et jardin", published: true, photos: ["/generated/property-6.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-01-05T09:00:00Z" },
  { id: "prop-7", title: "Villa Bord de Mer Grand-Bassam", type: "villa", status: "disponible", transaction_type: "location", price: 1200000, address: "Front de mer Grand-Bassam", city: "Grand-Bassam", district: "Grand-Bassam", neighborhood: "Plage", rooms: 5, bathrooms: 4, surface: 300, description: "Villa pieds dans l'eau", published: true, photos: ["/generated/property-1.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-01-08T10:00:00Z" },
  { id: "prop-8", title: "Villa Moderne Abatta", type: "villa", status: "disponible", transaction_type: "vente", price: 55000000, address: "Bingerville Abatta", city: "Bingerville", district: "Bingerville", neighborhood: "Abatta", rooms: 5, bathrooms: 4, surface: 320, description: "Villa neuve tout confort", published: true, photos: ["/generated/property-2.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-01-25T11:00:00Z" },
  { id: "prop-9", title: "Villa Familiale Abobo", type: "villa", status: "loue", transaction_type: "location", price: 350000, address: "Abobo PK 18", city: "Abidjan", district: "Abobo", neighborhood: "PK 18", rooms: 4, bathrooms: 3, surface: 200, description: "Villa spacieuse quartier calme", published: false, photos: ["/generated/property-3.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-02-05T09:00:00Z" },
  { id: "prop-10", title: "Villa de Luxe Riviera Golf", type: "villa", status: "vendu", transaction_type: "vente", price: 120000000, address: "Riviera Golf", city: "Abidjan", district: "Cocody", neighborhood: "Riviera Golf", rooms: 7, bathrooms: 6, surface: 500, description: "Villa haut standing", published: false, photos: ["/generated/property-4.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-02-10T10:00:00Z" },

  // Bureaux (8)
  { id: "prop-11", title: "Bureau Open Space Plateau", type: "bureau", status: "disponible", transaction_type: "location", price: 800000, address: "Plateau Avenue Chardy", city: "Abidjan", district: "Plateau", neighborhood: "Centre", rooms: 8, bathrooms: 3, surface: 200, description: "Espace professionnel moderne", published: true, photos: ["/generated/property-5.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-01-18T10:00:00Z" },
  { id: "prop-12", title: "Immeuble Bureau Marcory", type: "bureau", status: "disponible", transaction_type: "vente", price: 450000000, address: "Marcory Boulevard VGE", city: "Abidjan", district: "Marcory", neighborhood: "Zone 4", rooms: 30, bathrooms: 15, surface: 1200, description: "Immeuble R+5 usage bureaux", published: true, photos: ["/generated/property-6.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-01-22T11:00:00Z" },
  { id: "prop-13", title: "Bureau Cocody Angré", type: "bureau", status: "loue", transaction_type: "location", price: 500000, address: "Cocody Angré 7ème Tranche", city: "Abidjan", district: "Cocody", neighborhood: "Angré", rooms: 5, bathrooms: 2, surface: 120, description: "Bureau standing climatisé", published: false, photos: ["/generated/property-1.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-02-12T09:00:00Z" },

  // Commerces (6)
  { id: "prop-14", title: "Boutique Adjamé Commerce", type: "commerce", status: "disponible", transaction_type: "location", price: 250000, address: "Adjamé Marché", city: "Abidjan", district: "Adjamé", neighborhood: "Centre commercial", rooms: 1, bathrooms: 1, surface: 50, description: "Local commercial bien placé", published: true, photos: ["/generated/property-2.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-01-28T10:00:00Z" },
  { id: "prop-15", title: "Magasin Treichville", type: "commerce", status: "disponible", transaction_type: "location", price: 400000, address: "Treichville Rue du Commerce", city: "Abidjan", district: "Treichville", neighborhood: "Centre", rooms: 2, bathrooms: 1, surface: 80, description: "Grand magasin vitrine rue passante", published: true, photos: ["/generated/property-3.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-02-03T11:00:00Z" },

  // Terrains (9)
  { id: "prop-16", title: "Terrain Bingerville", type: "terrain", status: "disponible", transaction_type: "vente", price: 15000000, address: "Bingerville Route d'Abatta", city: "Bingerville", district: "Bingerville", neighborhood: "Abatta", rooms: 0, bathrooms: 0, surface: 500, description: "Terrain viabilisé titre foncier", published: true, photos: ["/generated/property-4.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-01-30T09:00:00Z" },
  { id: "prop-17", title: "Terrain Grand-Bassam", type: "terrain", status: "disponible", transaction_type: "vente", price: 25000000, address: "Grand-Bassam Zone Touristique", city: "Grand-Bassam", district: "Grand-Bassam", neighborhood: "Zone Touristique", rooms: 0, bathrooms: 0, surface: 800, description: "Terrain bord de mer idéal hôtel", published: true, photos: ["/generated/property-5.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-02-08T10:00:00Z" },
  { id: "prop-18", title: "Terrain Songon", type: "terrain", status: "disponible", transaction_type: "vente", price: 8000000, address: "Songon Zone Agricole", city: "Songon", district: "Songon", neighborhood: "Zone Agricole", rooms: 0, bathrooms: 0, surface: 2000, description: "Grand terrain agricole", published: true, photos: ["/generated/property-6.png"], owner_id: "00000000-0000-0000-0000-000000000006", created_at: "2024-02-15T11:00:00Z" },
];

export const mockStats = {
  totalProperties: 18,
  availableProperties: 13,
  rentedProperties: 3,
  soldProperties: 2,
  totalRevenue: 45800000,
  monthlyRevenue: 3200000,
  pendingPayments: 2,
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
  { name: "Appartements", value: 5, fill: "#3282B8" },
  { name: "Villas", value: 5, fill: "#16213E" },
  { name: "Bureaux", value: 3, fill: "#1A1A2E" },
  { name: "Commerces", value: 2, fill: "#BBE1FA" },
  { name: "Terrains", value: 3, fill: "#0F4C75" },
];

export const mockTopProperties = [
  { name: "Villa Cocody", prix: 85000000 },
  { name: "Penthouse Bonoumin", prix: 65000000 },
  { name: "Villa Abatta", prix: 55000000 },
  { name: "Immeuble Marcory", prix: 450000000 },
  { name: "Terrain Grand-Bassam", prix: 25000000 },
];

// Prospects
export const mockProspects = [
  { id: "pros-1", first_name: "Marie", last_name: "Kouadio", email: "marie.k@gmail.com", phone: "+22507123456", source: "site_web", request_type: "achat", status: "nouveau", property_id: "prop-6", notes: "Intéressée par villa Cocody", created_at: "2024-06-01T10:00:00Z" },
  { id: "pros-2", first_name: "Paul", last_name: "Diabaté", email: "paul.d@yahoo.fr", phone: "+22507234567", source: "site_web", request_type: "location", status: "en_cours", property_id: "prop-3", notes: "Cherche duplex meublé", created_at: "2024-06-02T11:00:00Z" },
  { id: "pros-3", first_name: "Fatou", last_name: "Traoré", email: "fatou.t@gmail.com", phone: "+22507345678", source: "telephone", request_type: "visite", status: "nouveau", property_id: "prop-11", notes: "Visite bureau Plateau", created_at: "2024-06-05T09:00:00Z" },
];

// Visites
export const mockVisits = [
  { id: "visit-1", property_id: "prop-6", prospect_id: "pros-1", agent_id: "00000000-0000-0000-0000-000000000002", visit_date: "2024-06-10T15:00:00Z", status: "confirmee", notes: "RDV confirmé", created_at: "2024-06-02T10:00:00Z" },
  { id: "visit-2", property_id: "prop-3", prospect_id: "pros-2", agent_id: "00000000-0000-0000-0000-000000000002", visit_date: "2024-06-12T10:00:00Z", status: "en_attente", notes: "En attente confirmation", created_at: "2024-06-03T11:00:00Z" },
];

// Réservations
export const mockBookings = [
  { id: "book-1", property_id: "prop-7", customer_name: "Ahmed Ben Ali", customer_email: "ahmed@example.com", customer_phone: "+22507456789", start_date: "2024-07-01", end_date: "2024-07-15", total_amount: 1800000, deposit_amount: 600000, status: "confirmed", payment_status: "deposit_paid", created_at: "2024-06-01T10:00:00Z" },
];

// Paiements
export const mockPayments = [
  { id: "pay-1", property_id: "prop-2", tenant_name: "Jean Koffi", amount: 180000, payment_date: "2024-06-01", payment_method: "mobile_money", status: "paid", receipt_url: null, notes: "Loyer juin 2024", created_at: "2024-06-01T09:00:00Z" },
  { id: "pay-2", property_id: "prop-4", tenant_name: "Sophie Atta", amount: 200000, payment_date: "2024-06-03", payment_method: "cash", status: "paid", receipt_url: null, notes: "Loyer juin 2024", created_at: "2024-06-03T10:00:00Z" },
  { id: "pay-3", property_id: "prop-9", tenant_name: "Pierre Dosso", amount: 350000, payment_date: "2024-06-05", payment_method: "bank_transfer", status: "pending", receipt_url: null, notes: "Loyer juin 2024 - en attente", created_at: "2024-06-05T11:00:00Z" },
];

// Interventions
export const mockInterventions = [
  { id: "int-1", property_id: "prop-2", provider_id: "00000000-0000-0000-0000-000000000005", intervention_type: "plomberie", description: "Fuite robinet cuisine", status: "pending", scheduled_date: "2024-06-08", photos_before: [], photos_after: [], notes: "", created_at: "2024-06-04T10:00:00Z" },
  { id: "int-2", property_id: "prop-4", provider_id: "00000000-0000-0000-0000-000000000005", intervention_type: "peinture", description: "Rafraîchissement salon", status: "in_progress", scheduled_date: "2024-06-06", photos_before: ["/generated/property-1.png"], photos_after: [], notes: "Travaux commencés", created_at: "2024-06-02T09:00:00Z" },
];

export function getMockProfile(email: string) {
  if (email === "admin@immo360.com") return mockProfiles.admin;
  if (email === "agent1@immo360.com") return mockProfiles.agent;
  if (email === "secretaire@immo360.com") return mockProfiles.secretary;
  if (email === "comptable@immo360.com") return mockProfiles.accountant;
  if (email === "plombier@immo360.com") return mockProfiles.provider;
  if (email === "proprietaire1@gmail.com") return mockProfiles.owner;
  return mockProfiles.agent;
}

export function isInDemoMode(): boolean {
  return typeof window !== "undefined" && process.env.NODE_ENV === "development";
}

export function getCurrentProfile() {
  if (typeof window === "undefined") return null;
  const demoUser = localStorage.getItem("demo_user");
  if (!demoUser) return null;
  try {
    return JSON.parse(demoUser);
  } catch {
    return null;
  }
}