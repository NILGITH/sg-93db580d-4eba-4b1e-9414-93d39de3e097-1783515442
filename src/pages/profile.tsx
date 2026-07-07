import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Camera, 
  Save, 
  Lock,
  Bell,
  Activity,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [stats, setStats] = useState({
    total_properties: 0,
    active_visits: 0,
    pending_interventions: 0,
    total_payments: 0,
  });

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone || "",
      });
    } catch (error) {
      console.error("Erreur chargement profil:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Statistiques selon le rôle
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "owner") {
        const { count: propertiesCount } = await supabase
          .from("properties")
          .select("*", { count: "exact", head: true })
          .eq("owner_id", user.id);

        const { count: paymentsCount } = await supabase
          .from("payments")
          .select("*", { count: "exact", head: true })
          .eq("owner_id", user.id);

        setStats({
          total_properties: propertiesCount || 0,
          active_visits: 0,
          pending_interventions: 0,
          total_payments: paymentsCount || 0,
        });
      } else if (profile?.role === "provider") {
        const { count: interventionsCount } = await supabase
          .from("interventions")
          .select("*", { count: "exact", head: true })
          .eq("provider_id", user.id)
          .eq("status", "en_cours");

        setStats({
          total_properties: 0,
          active_visits: 0,
          pending_interventions: interventionsCount || 0,
          total_payments: 0,
        });
      } else {
        const { count: propertiesCount } = await supabase
          .from("properties")
          .select("*", { count: "exact", head: true });

        const { count: visitsCount } = await supabase
          .from("visits")
          .select("*", { count: "exact", head: true })
          .eq("status", "en_attente");

        setStats({
          total_properties: propertiesCount || 0,
          active_visits: visitsCount || 0,
          pending_interventions: 0,
          total_payments: 0,
        });
      }
    } catch (error) {
      console.error("Erreur chargement statistiques:", error);
    }
  }

  async function handleUpdateProfile() {
    if (!profile) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone || null,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "✅ Profil mis à jour",
        description: "Vos informations ont été enregistrées",
      });

      await loadProfile();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!passwordData.new_password || !passwordData.confirm_password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.new_password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    try {
      setChangingPassword(true);

      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password,
      });

      if (error) throw error;

      toast({
        title: "✅ Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès",
      });

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de changer le mot de passe",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleAvatarUpload(urls: string[]) {
    if (!profile || urls.length === 0) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: urls[0] })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "✅ Photo de profil mise à jour",
        description: "Votre avatar a été enregistré",
      });

      await loadProfile();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour l'avatar",
        variant: "destructive",
      });
    }
  }

  function getRoleBadgeColor(role: string) {
    const colors = {
      admin: "bg-red-500",
      agent: "bg-green-500",
      secretary: "bg-yellow-500",
      accountant: "bg-blue-500",
      provider: "bg-purple-500",
      owner: "bg-orange-500",
    };
    return colors[role as keyof typeof colors] || "bg-gray-500";
  }

  function getRoleLabel(role: string) {
    const labels = {
      admin: "Administrateur",
      agent: "Agent Immobilier",
      secretary: "Secrétaire",
      accountant: "Comptable",
      provider: "Prestataire",
      owner: "Propriétaire",
    };
    return labels[role as keyof typeof labels] || role;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Profil non trouvé. Veuillez vous reconnecter.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* En-tête du profil */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="bg-accent text-accent-foreground text-2xl font-semibold">
                    {profile.first_name[0]}{profile.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <FileUpload
                    bucket="avatars"
                    accept="image/*"
                    onUploadComplete={handleAvatarUpload}
                  />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-serif font-bold">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  <Badge className={`${getRoleBadgeColor(profile.role)} text-white`}>
                    {getRoleLabel(profile.role)}
                  </Badge>
                  {profile.is_active && (
                    <Badge variant="outline" className="border-green-500 text-green-500">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Actif
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {profile.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {profile.role !== "provider" && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Activity className="w-8 h-8 mx-auto text-accent" />
                  <p className="text-3xl font-bold">{stats.total_properties}</p>
                  <p className="text-sm text-muted-foreground">Biens</p>
                </div>
              </CardContent>
            </Card>
          )}

          {(profile.role === "agent" || profile.role === "secretary") && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <User className="w-8 h-8 mx-auto text-blue-500" />
                  <p className="text-3xl font-bold">{stats.active_visits}</p>
                  <p className="text-sm text-muted-foreground">Visites</p>
                </div>
              </CardContent>
            </Card>
          )}

          {profile.role === "provider" && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Activity className="w-8 h-8 mx-auto text-purple-500" />
                  <p className="text-3xl font-bold">{stats.pending_interventions}</p>
                  <p className="text-sm text-muted-foreground">Interventions</p>
                </div>
              </CardContent>
            </Card>
          )}

          {(profile.role === "owner" || profile.role === "accountant") && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Shield className="w-8 h-8 mx-auto text-green-500" />
                  <p className="text-3xl font-bold">{stats.total_payments}</p>
                  <p className="text-sm text-muted-foreground">Paiements</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Onglets de paramètres */}
        <Card>
          <Tabs defaultValue="info" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">
                  <User className="w-4 h-4 mr-2" />
                  Informations
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Lock className="w-4 h-4 mr-2" />
                  Sécurité
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="info" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name">Nom</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      L'email ne peut pas être modifié
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+229 XX XX XX XX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <Separator />

                  <Button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="w-full md:w-auto"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer les modifications
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <div className="space-y-4">
                  <CardDescription>
                    Modifiez votre mot de passe pour sécuriser votre compte
                  </CardDescription>

                  <div className="space-y-2">
                    <Label htmlFor="new_password">Nouveau mot de passe</Label>
                    <Input
                      id="new_password"
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Le mot de passe doit contenir au moins 6 caractères
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    variant="destructive"
                    className="w-full md:w-auto"
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Modification...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Changer le mot de passe
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-4">
                  <CardDescription>
                    Gérez vos préférences de notifications
                  </CardDescription>

                  <Alert>
                    <Bell className="h-4 w-4" />
                    <AlertDescription>
                      Fonctionnalité en cours de développement. Bientôt disponible !
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}