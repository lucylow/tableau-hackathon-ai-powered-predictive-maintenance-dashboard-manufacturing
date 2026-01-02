import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Bell, 
  Link, 
  Shield, 
  Database, 
  Cloud,
  Slack,
  Mail,
  Smartphone,
  CheckCircle
} from "lucide-react";

const SettingsPage = () => {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences and integrations</p>
        </div>

        <Tabs defaultValue="notifications">
          <TabsList>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Link className="w-4 h-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="thresholds" className="gap-2">
              <Settings className="w-4 h-4" />
              Thresholds
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>Configure how you receive alerts and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { icon: Mail, label: "Email Notifications", desc: "Receive alerts via email", enabled: true },
                  { icon: Slack, label: "Slack Integration", desc: "Push alerts to Slack channels", enabled: true },
                  { icon: Smartphone, label: "SMS Alerts", desc: "Critical alerts via SMS", enabled: false },
                  { icon: Bell, label: "In-App Notifications", desc: "Browser push notifications", enabled: true },
                ].map((channel, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-secondary">
                        <channel.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{channel.label}</p>
                        <p className="text-sm text-muted-foreground">{channel.desc}</p>
                      </div>
                    </div>
                    <Switch defaultChecked={channel.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Alert Preferences</CardTitle>
                <CardDescription>Choose which events trigger notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Critical health alerts (<60%)", enabled: true },
                  { label: "Warning alerts (60-80%)", enabled: true },
                  { label: "Prediction updates", enabled: true },
                  { label: "Maintenance reminders", enabled: true },
                  { label: "System status changes", enabled: false },
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span>{pref.label}</span>
                    <Switch defaultChecked={pref.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { 
                  name: "Salesforce", 
                  desc: "Sync equipment data and create cases", 
                  status: "connected",
                  icon: Cloud
                },
                { 
                  name: "Slack", 
                  desc: "Send alerts to Slack channels", 
                  status: "connected",
                  icon: Slack
                },
                { 
                  name: "Tableau", 
                  desc: "Embed analytics dashboards", 
                  status: "connected",
                  icon: Database
                },
                { 
                  name: "Azure IoT Hub", 
                  desc: "Connect IoT sensor data", 
                  status: "disconnected",
                  icon: Shield
                },
              ].map((integration, i) => (
                <Card key={i} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary">
                          <integration.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{integration.name}</p>
                          <p className="text-sm text-muted-foreground">{integration.desc}</p>
                        </div>
                      </div>
                      {integration.status === "connected" ? (
                        <Badge variant="outline" className="text-success border-success gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Disconnected</Badge>
                      )}
                    </div>
                    <Button 
                      variant={integration.status === "connected" ? "outline" : "default"} 
                      size="sm" 
                      className="w-full"
                    >
                      {integration.status === "connected" ? "Configure" : "Connect"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="thresholds" className="mt-6 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Health Score Thresholds</CardTitle>
                <CardDescription>Define thresholds for health status categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label>Critical Threshold (%)</Label>
                    <Input type="number" defaultValue={60} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">Equipment below this is critical</p>
                  </div>
                  <div>
                    <Label>Warning Threshold (%)</Label>
                    <Input type="number" defaultValue={80} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">Equipment below this is warning</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Sensor Thresholds</CardTitle>
                <CardDescription>Configure alert thresholds for sensor readings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Temperature (°C)", value: 85 },
                    { label: "Vibration (mm/s)", value: 5 },
                    { label: "Pressure (PSI)", value: 115 },
                    { label: "Power (kW)", value: 75 },
                  ].map((threshold, i) => (
                    <div key={i}>
                      <Label>{threshold.label}</Label>
                      <Input type="number" defaultValue={threshold.value} className="mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
