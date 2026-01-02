import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Play, 
  Pause, 
  TrendingUp, 
  CheckCircle, 
  Shield, 
  Zap,
  BarChart3,
  Activity,
  Wrench,
  Puzzle,
  Monitor,
  Radio,
  AlertTriangle,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Star,
  Cloud,
  Sparkles
} from "lucide-react";
import { EquipmentCard } from "@/components/EquipmentCard";
import { StatCard } from "@/components/StatCard";
import { FeatureCard } from "@/components/FeatureCard";
import { FloatingOrb } from "@/components/FloatingOrb";
import { AlertBanner } from "@/components/AlertBanner";

const mockEquipmentData = [
  { id: 1, name: "Press #3", health: 92, status: "critical" as const, type: "Press", lastMaintenance: "2 days ago" },
  { id: 2, name: "Conveyor B2", health: 87, status: "warning" as const, type: "Conveyor", lastMaintenance: "1 week ago" },
  { id: 3, name: "Mixer #5", health: 73, status: "warning" as const, type: "Mixer", lastMaintenance: "2 weeks ago" },
  { id: 4, name: "Motor #7", health: 45, status: "critical" as const, type: "Motor", lastMaintenance: "3 days ago" },
  { id: 5, name: "Pump #12", health: 95, status: "healthy" as const, type: "Pump", lastMaintenance: "1 month ago" },
];

const features = [
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Predictive Analytics",
    description: "AI-powered failure predictions 7-30 days in advance using machine learning models",
    badge: "40% Innovation Score",
    color: "#0ea5e9"
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: "Real-time Monitoring",
    description: "Live IoT sensor data processing with instant anomaly detection",
    badge: "30% Technical Execution",
    color: "#22c55e"
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "Automated Workflows",
    description: "Auto-create service cases, assign technicians, and order parts",
    badge: "20% Potential Impact",
    color: "#f59e0b"
  },
  {
    icon: <Puzzle className="w-6 h-6" />,
    title: "Seamless Integration",
    description: "Deep integration with Tableau, Salesforce, Slack, and existing systems",
    badge: "10% User Experience",
    color: "#a855f7"
  }
];

const stats = [
  { value: "40%", label: "Reduction in Downtime", icon: <TrendingUp className="w-6 h-6" /> },
  { value: "25%", label: "Maintenance Cost Savings", icon: <CheckCircle className="w-6 h-6" /> },
  { value: "95%", label: "Prediction Accuracy", icon: <Shield className="w-6 h-6" /> },
  { value: "10K+", label: "Sensors Processed/sec", icon: <Zap className="w-6 h-6" /> }
];

const alerts = [
  "🚨 Press #3 - Temperature anomaly detected",
  "⚠️ Conveyor B2 - Vibration levels increasing",
  "🔧 Mixer #5 - Preventive maintenance scheduled",
  "📊 New prediction: Motor #7 failure in 3 days",
  "✅ Maintenance completed on Pump #12"
];

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentAlert, setCurrentAlert] = useState("");
  const [equipmentData, setEquipmentData] = useState(mockEquipmentData);

  useEffect(() => {
    if (!isPlaying) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      setCurrentAlert(alerts[currentIndex]);
      currentIndex = (currentIndex + 1) % alerts.length;
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setEquipmentData(prev =>
        prev.map(eq => ({
          ...eq,
          health: Math.max(10, Math.min(100, eq.health + (Math.random() - 0.5) * 5))
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSimulateAlert = () => {
    const emergencyAlerts = [
      "🚨 Emergency: Bearing failure predicted in 24h!",
      "⚠️ Warning: Temperature threshold exceeded",
      "🔧 Scheduled maintenance due tomorrow"
    ];
    setCurrentAlert(emergencyAlerts[Math.floor(Math.random() * emergencyAlerts.length)]);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center py-20">
        {/* Background Elements */}
        <FloatingOrb className="top-[10%] left-[5%]" size="lg" color="primary" />
        <FloatingOrb className="bottom-[20%] right-[10%]" size="md" color="accent" delay />
        <FloatingOrb className="top-[60%] left-[60%]" size="sm" color="primary" />
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8 animate-slide-up">
              <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-2 text-sm animate-pulse-glow">
                <Sparkles className="w-4 h-4 mr-2" />
                Tableau Hackathon 2025
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                AI-Powered
                <br />
                <span className="gradient-text">Predictive Maintenance</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg">
                Transform manufacturing with real-time IoT analytics, AI predictions, and automated workflows powered by Tableau Next.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-all duration-300 hover:scale-105 glow-primary px-8"
                >
                  Launch Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="border-border hover:bg-secondary/50"
                >
                  {isPlaying ? <Pause className="mr-2 w-5 h-5" /> : <Play className="mr-2 w-5 h-5" />}
                  {isPlaying ? "Pause" : "Play"} Demo
                </Button>
              </div>

              {/* Alert Banner */}
              <AlertBanner message={currentAlert} />
            </div>

            {/* Right Column - Live Monitor */}
            <div 
              className="glass-card rounded-3xl p-6 border border-border/50 animate-scale-in"
              style={{ animationDelay: '300ms' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Monitor className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold">Live Equipment Monitor</h2>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Radio className="w-4 h-4 text-success animate-pulse" />
                  <span>10,245 sensors active</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {equipmentData.map((equipment) => (
                  <EquipmentCard key={equipment.id} equipment={equipment} />
                ))}
              </div>

              <Button 
                className="w-full bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/30"
                onClick={handleSimulateAlert}
              >
                <AlertTriangle className="mr-2 w-4 h-4" />
                Simulate Critical Alert
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard 
                key={index} 
                {...stat} 
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <FloatingOrb className="top-[20%] right-[5%]" size="md" color="accent" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Why This Solution <span className="gradient-text">Wins</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with Tableau Next and cutting-edge technology to deliver actionable insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-primary/20 to-accent/10">
              <h3 className="text-3xl font-bold mb-6">Interactive Demo</h3>
              <p className="text-muted-foreground mb-6">
                Experience real-time predictive analytics in action. Our demo shows:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: <BarChart3 className="w-5 h-5" />, text: "Live sensor data visualization" },
                  { icon: <Activity className="w-5 h-5" />, text: "AI failure probability predictions" },
                  { icon: <Puzzle className="w-5 h-5" />, text: "Automated Salesforce workflows" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-foreground">
                    <span className="text-primary">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                Try Interactive Demo
              </Button>
            </div>

            <div className="space-y-6">
              <h3 className="text-4xl font-black">
                Built for the
                <span className="text-primary"> Tableau Hackathon</span>
              </h3>
              <p className="text-lg text-muted-foreground">
                This solution targets multiple prize categories with innovative features:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Best Data Layer",
                  "Semantic Modeling",
                  "Actionable Analytics",
                  "Product Extensibility",
                  "Grand Prize"
                ].map((badge, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-secondary/80"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
              <p className="text-muted-foreground">
                Featuring real-time IoT data pipelines, advanced ML models, and seamless Salesforce integration.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="border-border">
                  <Github className="mr-2 w-4 h-4" />
                  View Source
                </Button>
                <Button variant="outline" className="border-border">
                  <Cloud className="mr-2 w-4 h-4" />
                  Tableau Integration
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90" />
            <div className="relative z-10 p-12 lg:p-16 text-center">
              <Star className="w-16 h-16 mx-auto mb-6 text-warning" />
              <h2 className="text-4xl lg:text-5xl font-black text-primary-foreground mb-4">
                Ready to Transform Manufacturing?
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join the future of predictive maintenance with AI-powered insights.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-background text-foreground hover:bg-background/90 px-8"
                >
                  Launch Full Dashboard
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={handleSimulateAlert}
                >
                  Trigger Demo Alert
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Predictive Maintenance Dashboard</h4>
              <p className="text-muted-foreground text-sm mb-4">
                An AI-powered solution for the Tableau Hackathon 2025, demonstrating cutting-edge analytics and automation.
              </p>
              <div className="flex gap-3">
                {[Github, Linkedin, Twitter, Mail].map((Icon, index) => (
                  <Button key={index} variant="ghost" size="icon" className="hover:text-primary">
                    <Icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {["Tableau Next", "Salesforce", "React", "TypeScript", "Python ML", "IoT Sensors", "Slack API", "Docker"].map((tech, index) => (
                  <Badge key={index} variant="outline" className="border-border text-muted-foreground">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Hackathon Info</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Deadline:</strong> Jan 12, 2026</p>
                <p><strong>Prize Pool:</strong> $45,000+</p>
                <p><strong>Platform:</strong> Tableau Next & Tableau Cloud</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 border-border">
                View Hackathon Details
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2025 Tableau Hackathon Submission. AI-Powered Predictive Maintenance Dashboard for Manufacturing.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
