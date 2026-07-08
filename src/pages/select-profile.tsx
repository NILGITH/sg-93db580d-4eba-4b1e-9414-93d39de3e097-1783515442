import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Briefcase, 
  FileText, 
  Calculator, 
  Wrench, 
  Home 
} from "lucide-react";

interface ProfileOption {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "admin" | "agent" | "secretary" | "accountant" | "provider" | "owner";
  icon: any;
  title: string;
  description: string;
  color: string;
}

const profiles: ProfileOption[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@immo360.com",
    firstName: "Admin",
    lastName: "Système",
    phone: "+22997000001",
    role: "admin",
    icon: Shield,
    title: "Administrateur",
    description: "Accès complet à toutes les fonctionnalités",
    color: "bg-red-500",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    email: "agent1@immo360.com",
    firstName: "Kofi",
    lastName: "Mensah",
    phone: "+22997000002",
    role: "agent",
    icon: Briefcase,
    title: "Agent Immobilier",
    description: "Gestion biens, visites, locations, ventes",
    color: "bg-blue-500",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    email: "secretaire@immo360.com",
    firstName: "Sophie",
    lastName: "Koffi",
    phone: "+22997000004",
    role: "secretary",
    icon: FileText,
    title: "Secrétaire",
    description: "Rendez-vous, prospects, contrats, réservations",
    color: "bg-green-500",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    email: "comptable@immo360.com",
    firstName: "Jean",
    lastName: "Kouassi",
    phone: "+22997000005",
    role: "accountant",
    icon: Calculator,
    title: "Comptable",
    description: "Paiements, loyers, impayés, rapports financiers",
    color: "bg-purple-500",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    email: "plombier@immo360.com",
    firstName: "Yao",
    lastName: "Ahomadegbe",
    phone: "+22997000006",
    role: "provider",
    icon: Wrench,
    title: "Prestataire",
    description: "Missions affectées, photos, commentaires, clôture",
    color: "bg-orange-500",
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    email: "proprietaire1@gmail.com",
    firstName: "Serge",
    lastName: "Adjanohoun",
    phone: "+22997000009",
    role: "owner",
    icon: Home,
    title: "Propriétaire",
    description: "Espace personnel : biens, loyers, dépenses, interventions",
    color: "bg-indigo-500",
  },
];

export default function SelectProfile() {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<ProfileOption | null>(null);

  function handleSelectProfile(profile: ProfileOption) {
    setSelectedProfile(profile);
    
    // Stocker le profil dans localStorage
    const mockProfile = {
      id: profile.id,
      email: profile.email,
      first_name: profile.firstName,
      last_name: profile.lastName,
      phone: profile.phone,
      role: profile.role,
      is_active: true,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem("demo_user", JSON.stringify(mockProfile));
    localStorage.setItem("demo_mode_active", "true");

    // Redirection selon le rôle
    setTimeout(() => {
      switch (profile.role) {
        case "admin":
        case "agent":
        case "secretary":
        case "accountant":
          router.push("/dashboard");
          break;
        case "provider":
          router.push("/provider/missions");
          break;
        case "owner":
          router.push("/owner");
          break;
        default:
          router.push("/dashboard");
      }
    }, 500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <img src="/logo_Amiri.png" alt="AMIRI" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold mb-2">AMIRI - Mode Démo</h1>
          <p className="text-muted-foreground">
            Sélectionnez un profil pour explorer l'application
          </p>
          <Badge variant="outline" className="mt-2">
            ✨ Aucune connexion requise
          </Badge>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile, index) => {
            const Icon = profile.icon;
            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                    selectedProfile?.id === profile.id ? "ring-2 ring-accent" : ""
                  }`}
                  onClick={() => handleSelectProfile(profile)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`${profile.color} p-3 rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {profile.role}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{profile.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {profile.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">
                        {profile.firstName} {profile.lastName}
                      </p>
                      <p>{profile.email}</p>
                      <p>{profile.phone}</p>
                    </div>
                    <Button
                      className="w-full mt-4 bg-accent hover:bg-accent/90"
                      size="sm"
                    >
                      Sélectionner
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <Card className="bg-muted/50">
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Mode Démo :</strong> Toutes les données sont mockées localement. 
                Aucune connexion à Supabase n'est nécessaire. Explorez librement toutes les fonctionnalités !
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}