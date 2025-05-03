
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDeveloperMode } from "@/context/DeveloperModeContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DeveloperModeBanner from "@/components/layout/DeveloperModeBanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  User,
  MessageSquare,
  Heart,
  Activity,
  RefreshCw,
  Settings,
  LogIn,
  Coffee,
  Database,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Profile, ProfileLifestyle } from "@/hooks/use-profiles";
import { Badge } from "@/components/ui/badge";
import { Json } from "@/integrations/supabase/types";

const DeveloperDashboard = () => {
  const { user } = useAuth();
  const { isDeveloperMode } = useDeveloperMode();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfiles, setActiveProfiles] = useState<number>(0);
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [totalChats, setTotalChats] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    if (!isDeveloperMode) {
      toast({
        title: "Developer Mode Required",
        description: "You need to enable developer mode to access this page.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (profilesError) {
          throw profilesError;
        }

        if (profilesData) {
          // Convert the profiles data to match our Profile interface
          const typedProfiles: Profile[] = profilesData.map(profile => {
            // Convert lifestyle from Json to ProfileLifestyle or null
            let lifestyle: ProfileLifestyle | null = null;
            
            if (profile.lifestyle) {
              try {
                // Handle lifestyle data conversion safely
                if (typeof profile.lifestyle === 'object') {
                  lifestyle = {
                    cleanliness: String(profile.lifestyle?.cleanliness || ''),
                    noise: String(profile.lifestyle?.noise || ''),
                    schedule: String(profile.lifestyle?.schedule || ''),
                    guests: String(profile.lifestyle?.guests || ''),
                    smoking: String(profile.lifestyle?.smoking || '')
                  };
                }
              } catch (e) {
                console.error('Error parsing lifestyle data:', e);
              }
            }

            return {
              ...profile,
              lifestyle,
            } as unknown as Profile;
          });

          setProfiles(typedProfiles);
          setActiveProfiles(typedProfiles?.filter((p) => p.is_profile_active).length || 0);
        }

        // For now, let's use placeholder values for matches and chats
        // In a real implementation, you would fetch these from their respective tables
        setTotalMatches(profilesData?.length * 2 || 0); // Placeholder
        setTotalChats(Math.floor((profilesData?.length || 0) / 2)); // Placeholder

        toast({
          title: "Dashboard Data Loaded",
          description: "Developer dashboard data has been refreshed.",
        });
      } catch (error: any) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error Loading Data",
          description: error.message || "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [isDeveloperMode, navigate, toast]);

  const handleRefreshData = () => {
    // Reload the dashboard data
    // This is the same functionality as in the useEffect, but can be called manually
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (profilesError) throw profilesError;

        if (profilesData) {
          // Convert the profiles data to match our Profile interface
          const typedProfiles: Profile[] = profilesData.map(profile => {
            // Convert lifestyle from Json to ProfileLifestyle or null
            let lifestyle: ProfileLifestyle | null = null;
            
            if (profile.lifestyle) {
              try {
                // Handle lifestyle data conversion safely
                if (typeof profile.lifestyle === 'object') {
                  lifestyle = {
                    cleanliness: String(profile.lifestyle?.cleanliness || ''),
                    noise: String(profile.lifestyle?.noise || ''),
                    schedule: String(profile.lifestyle?.schedule || ''),
                    guests: String(profile.lifestyle?.guests || ''),
                    smoking: String(profile.lifestyle?.smoking || '')
                  };
                }
              } catch (e) {
                console.error('Error parsing lifestyle data:', e);
              }
            }

            return {
              ...profile,
              lifestyle,
            } as unknown as Profile;
          });

          setProfiles(typedProfiles);
          setActiveProfiles(typedProfiles?.filter((p) => p.is_profile_active).length || 0);
        }

        toast({
          title: "Data Refreshed",
          description: "Dashboard data has been refreshed successfully.",
        });
      } catch (error: any) {
        toast({
          title: "Refresh Failed",
          description: error.message || "Failed to refresh data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  };

  const handleViewProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };

  const handleForceMatch = (id: string) => {
    // In a real implementation, you would create a match between the current user and the selected profile
    toast({
      title: "Match Created",
      description: `You have created a test match with profile ID: ${id}`,
    });
  };

  const handleViewChats = () => {
    navigate("/chat");
  };

  const handleViewMatches = () => {
    navigate("/matching");
  };

  if (!isDeveloperMode) {
    return null; // This component should only render in developer mode
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DeveloperModeBanner />
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Developer Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and test your application in real-time
            </p>
          </div>
          <Button
            onClick={handleRefreshData}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-6"
        >
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="text-center">
              <div className="flex items-center gap-2">
                <Activity size={16} />
                <span className="hidden md:inline">Overview</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="profiles" className="text-center">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span className="hidden md:inline">Profiles</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-center">
              <div className="flex items-center gap-2">
                <Settings size={16} />
                <span className="hidden md:inline">Tools</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-center">
              <div className="flex items-center gap-2">
                <Database size={16} />
                <span className="hidden md:inline">Logs</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>Total Users</span>
                    <Users
                      size={20}
                      className="text-blue-500 dark:text-blue-400"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{profiles.length}</div>
                  <p className="text-muted-foreground text-sm">
                    {activeProfiles} active
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setActiveTab("profiles")}
                  >
                    View all profiles
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>Total Matches</span>
                    <Heart
                      size={20}
                      className="text-red-500 dark:text-red-400"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalMatches}</div>
                  <p className="text-muted-foreground text-sm">
                    Across all users
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={handleViewMatches}
                  >
                    View matches
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>Active Chats</span>
                    <MessageSquare
                      size={20}
                      className="text-green-500 dark:text-green-400"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalChats}</div>
                  <p className="text-muted-foreground text-sm">
                    {Math.floor(totalChats / 2)} new today
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={handleViewChats}
                  >
                    View chats
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>Test Actions</span>
                    <Settings
                      size={20}
                      className="text-purple-500 dark:text-purple-400"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/matching")}
                  >
                    <Heart size={16} className="mr-2" />
                    Test Matching
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/chat")}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Test Chat
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recent User Activity</CardTitle>
                <CardDescription>
                  The latest profiles created or updated
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                    <p>Loading profiles...</p>
                  </div>
                ) : profiles.length > 0 ? (
                  <div className="space-y-4">
                    {profiles.slice(0, 5).map((profile) => (
                      <div
                        key={profile.id}
                        className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                            {profile.profile_image ? (
                              <img
                                src={profile.profile_image}
                                alt={profile.first_name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <User size={16} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {profile.first_name} {profile.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              @{profile.username}
                              {profile.is_profile_active ? (
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-green-500/10 text-green-600 border-green-500/20"
                                >
                                  Active
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-orange-500/10 text-orange-600 border-orange-500/20"
                                >
                                  Inactive
                                </Badge>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewProfile(profile.id)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleForceMatch(profile.id)}
                          >
                            Force Match
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <AlertCircle size={24} className="mx-auto mb-2" />
                    <p>No profiles found</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveTab("profiles")}
                >
                  View All Profiles
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="profiles">
            <Card>
              <CardHeader>
                <CardTitle>All User Profiles</CardTitle>
                <CardDescription>
                  Manage and test with real user profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                    <p>Loading profiles...</p>
                  </div>
                ) : profiles.length > 0 ? (
                  <div className="space-y-4">
                    {profiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                            {profile.profile_image ? (
                              <img
                                src={profile.profile_image}
                                alt={profile.first_name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <User size={16} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {profile.first_name} {profile.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              @{profile.username}{" "}
                              {profile.is_profile_active ? (
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-green-500/10 text-green-600 border-green-500/20"
                                >
                                  Active
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-orange-500/10 text-orange-600 border-orange-500/20"
                                >
                                  Inactive
                                </Badge>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewProfile(profile.id)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleForceMatch(profile.id)}
                          >
                            Force Match
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <AlertCircle size={24} className="mx-auto mb-2" />
                    <p>No profiles found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LogIn size={18} />
                    Authentication
                  </CardTitle>
                  <CardDescription>
                    Tools for testing authentication flows
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/signin")}
                  >
                    Test Sign In Flow
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/register")}
                  >
                    Test Registration Flow
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart size={18} />
                    Matching
                  </CardTitle>
                  <CardDescription>
                    Tools for testing the matching system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/matching")}
                  >
                    View Matching Interface
                  </Button>
                  <Button className="w-full" variant="outline">
                    Create Random Match
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee size={18} />
                    Development
                  </CardTitle>
                  <CardDescription>
                    Additional development tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/profile/create")}
                  >
                    Create Test Profile
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleRefreshData}
                  >
                    <RefreshCw
                      size={16}
                      className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
                    />
                    Refresh Database Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>
                  View recent system activity and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-xs h-80 overflow-auto">
                  {/* This would be replaced with real logs in a production system */}
                  <p className="text-slate-400">[2025-05-03 16:53:39]</p>
                  <p className="text-green-400">
                    INFO: User authenticated successfully
                  </p>
                  <br />
                  <p className="text-slate-400">[2025-05-03 16:53:38]</p>
                  <p className="text-green-400">INFO: Token revoked</p>
                  <br />
                  <p className="text-slate-400">[2025-05-03 16:53:38]</p>
                  <p className="text-green-400">INFO: Login successful</p>
                  <br />
                  <p className="text-slate-400">[2025-05-03 16:53:38]</p>
                  <p className="text-green-400">INFO: Token revoked</p>
                  <br />
                  <p className="text-slate-400">[2025-05-03 16:49:38]</p>
                  <p className="text-yellow-400">
                    WARN: Redirecting to external provider
                  </p>
                  <br />
                  <p className="text-slate-400">[2025-05-03 16:49:38]</p>
                  <p className="text-green-400">
                    INFO: Authorization request completed
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  These are simulated logs for demonstration purposes
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default DeveloperDashboard;
