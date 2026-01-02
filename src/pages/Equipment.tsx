import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List as ListIcon,
  Factory,
  AlertTriangle,
  CheckCircle,
  Clock,
  SortAsc,
  SortDesc
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { EquipmentHealthCard } from "@/components/dashboard/EquipmentHealthCard";
import { Progress } from "@/components/ui/progress";
import { useEquipmentData } from "@/hooks/useEquipmentData";
import { EquipmentStatus, EquipmentType } from "@/types/equipment";
import { formatPercentage, getHealthLabel } from "@/utils/formatters";
import { cn } from "@/lib/utils";

const EquipmentPage = () => {
  const { equipment, loading } = useEquipmentData();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [healthFilter, setHealthFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"health" | "name" | "criticality">("health");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredEquipment = useMemo(() => {
    let filtered = [...equipment];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(eq => 
        eq.name.toLowerCase().includes(query) ||
        eq.equipmentId.toLowerCase().includes(query) ||
        eq.factoryId.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(eq => eq.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(eq => eq.type === typeFilter);
    }

    // Health filter
    if (healthFilter !== "all") {
      if (healthFilter === "critical") {
        filtered = filtered.filter(eq => eq.currentHealthScore < 0.6);
      } else if (healthFilter === "warning") {
        filtered = filtered.filter(eq => eq.currentHealthScore >= 0.6 && eq.currentHealthScore < 0.8);
      } else if (healthFilter === "healthy") {
        filtered = filtered.filter(eq => eq.currentHealthScore >= 0.8);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "health":
          comparison = a.currentHealthScore - b.currentHealthScore;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "criticality":
          comparison = a.criticalityScore - b.criticalityScore;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [equipment, searchQuery, statusFilter, typeFilter, healthFilter, sortBy, sortOrder]);

  const stats = useMemo(() => ({
    total: equipment.length,
    healthy: equipment.filter(e => e.currentHealthScore >= 0.8).length,
    warning: equipment.filter(e => e.currentHealthScore >= 0.6 && e.currentHealthScore < 0.8).length,
    critical: equipment.filter(e => e.currentHealthScore < 0.6).length,
  }), [equipment]);

  const getHealthClass = (score: number) => {
    if (score >= 0.8) return "bg-success";
    if (score >= 0.6) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Equipment Inventory</h1>
            <p className="text-muted-foreground">
              Monitor and manage all connected equipment
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <CheckCircle className="w-3 h-3 text-success" />
              {stats.healthy} Healthy
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3 text-warning" />
              {stats.warning} Warning
            </Badge>
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              {stats.critical} Critical
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={EquipmentStatus.OPERATIONAL}>Operational</SelectItem>
                  <SelectItem value={EquipmentStatus.DEGRADED}>Degraded</SelectItem>
                  <SelectItem value={EquipmentStatus.MAINTENANCE}>Maintenance</SelectItem>
                  <SelectItem value={EquipmentStatus.FAILED}>Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.values(EquipmentType).map(type => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={healthFilter} onValueChange={setHealthFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Health" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Health</SelectItem>
                  <SelectItem value="healthy">Healthy (80%+)</SelectItem>
                  <SelectItem value="warning">Warning (60-80%)</SelectItem>
                  <SelectItem value="critical">Critical (&lt;60%)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health Score</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="criticality">Criticality</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <ListIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredEquipment.length} of {equipment.length} equipment
          </p>
        </div>

        {/* Equipment Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEquipment.map((eq) => (
              <EquipmentHealthCard key={eq.id} equipment={eq} />
            ))}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredEquipment.map((eq) => (
                  <EquipmentHealthCard key={eq.id} equipment={eq} compact />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <Factory className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No equipment found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default EquipmentPage;
