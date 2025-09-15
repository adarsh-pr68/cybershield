import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  Filter,
  Bell,
  Settings,
  MoreVertical,
  Clock,
  MapPin,
  Trash2,
  Edit
} from "lucide-react";
import { useThreats } from "@/hooks/useThreats";
import { useMetrics } from "@/hooks/useMetrics";
import { useThreatActors } from "@/hooks/useThreatActors";
import { ThreatForm } from "./ThreatForm";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "stable";
}

const MetricCard = ({ title, value, change, icon, trend }: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs flex items-center gap-1 ${
        trend === 'up' ? 'text-red-500' : 
        trend === 'down' ? 'text-green-500' : 
        'text-muted-foreground'
      }`}>
        {trend === 'up' && <TrendingUp className="h-3 w-3" />}
        {trend === 'down' && <TrendingDown className="h-3 w-3" />}
        {trend === 'stable' && <Minus className="h-3 w-3" />}
        {change}
      </p>
    </CardContent>
  </Card>
);

interface ThreatCardProps {
  threat: any;
  onDelete: (id: string) => void;
}

const ThreatCard = ({ threat, onDelete }: ThreatCardProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical": return "destructive";
      case "high": return "secondary";
      case "medium": return "default";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "mitigated": return "default";
      case "in_progress": return "secondary";
      case "unmitigated": return "destructive";
      case "false_positive": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge 
              variant={getSeverityColor(threat.severity)}
              className="font-medium"
            >
              {threat.severity?.toUpperCase() || 'UNKNOWN'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {threat.category}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <ThreatForm threat={threat} />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(threat.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        
        <CardTitle className="text-base leading-tight">
          {threat.title}
        </CardTitle>
        <CardDescription className="text-sm">
          {threat.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{threat.created_at ? new Date(threat.created_at).toLocaleString() : 'Unknown'}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Source:</span>
              <span className="font-medium">{threat.source || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Affected:</span>
              <span className="font-medium">{threat.affected_systems?.toLocaleString() || '0'}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge 
              variant={getStatusColor(threat.mitigation_status)}
              className="text-xs"
            >
              {threat.mitigation_status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ThreatDashboard = () => {
  const { threats, loading: threatsLoading, deleteThreat } = useThreats();
  const { metrics, loading: metricsLoading } = useMetrics();
  const { threatActors, loading: actorsLoading } = useThreatActors();

  // Calculate metrics from real data
  const getMetricValue = (metricName: string) => {
    const metric = metrics.find(m => m.metric_name.toLowerCase().includes(metricName.toLowerCase()));
    return metric ? metric.metric_value : 0;
  };

  const criticalThreats = threats.filter(t => t.severity === 'critical').length;
  const highThreats = threats.filter(t => t.severity === 'high').length;
  const unmitigatedThreats = threats.filter(t => t.mitigation_status === 'unmitigated').length;

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            CyberShield Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">Real-time threat intelligence and analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <MetricCard
              title="Active Threats"
              value={threats.length.toString()}
              change={`${criticalThreats} critical`}
              icon={<AlertTriangle className="h-5 w-5" />}
              trend={criticalThreats > 0 ? "up" : "stable"}
            />
            <MetricCard
              title="Critical Alerts"
              value={criticalThreats.toString()}
              change={`${highThreats} high`}
              icon={<Shield className="h-5 w-5" />}
              trend={criticalThreats > 5 ? "up" : "down"}
            />
            <MetricCard
              title="Unmitigated"
              value={unmitigatedThreats.toString()}
              change={`${((unmitigatedThreats / (threats.length || 1)) * 100).toFixed(1)}%`}
              icon={<Clock className="h-4 w-4" />}
              trend={unmitigatedThreats > threats.length / 2 ? "up" : "down"}
            />
            <MetricCard
              title="Security Score"
              value={`${getMetricValue('security score') || 8.7}/10`}
              change="+0.2"
              icon={<TrendingUp className="h-4 w-4" />}
              trend="up"
            />
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Feed */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold">Priority Threat Feed</CardTitle>
              <div className="flex items-center gap-2">
                <ThreatForm />
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {threatsLoading ? (
                <>
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                </>
              ) : threats.length > 0 ? (
                threats.map((threat) => (
                  <ThreatCard key={threat.id} threat={threat} onDelete={deleteThreat} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No threats found. Add your first threat using the button above.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Threat Actors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actorsLoading ? (
                  <>
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </>
                ) : threatActors.length > 0 ? (
                  threatActors.slice(0, 5).map((actor) => (
                    <div key={actor.id} className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                      <div className={`w-2 h-8 rounded ${
                        actor.activity_status === 'active' ? 'bg-red-500' : 
                        actor.activity_status === 'monitoring' ? 'bg-yellow-500' : 
                        'bg-gray-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{actor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {actor.activity_status || 'Unknown'} • {actor.origin_country || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No threat actors found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Posture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Current security level: <strong>High</strong>
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Threat Coverage</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span className="font-medium">4.2m avg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mitigation Rate</span>
                    <span className="font-medium">{threats.length > 0 ? (((threats.length - unmitigatedThreats) / threats.length * 100).toFixed(1)) : 0}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThreatDashboard;