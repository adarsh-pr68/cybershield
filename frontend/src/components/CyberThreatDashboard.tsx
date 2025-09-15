import React, { useEffect, useState } from 'react';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Mock fallback data
const mockThreats = [
  {
    id: 1,
    title: 'Zero-day in Apache Log4j',
    description: 'Remote code execution vulnerability affecting multiple enterprise systems',
    severity: 'Critical',
    priorityScore: 96,
    category: 'CVE',
    date: '2023-11-15',
    status: 'New',
    affectedSystems: 12000,
    threatActor: 'APT29',
    mitigation: 'Apply patches immediately, monitor network traffic'
  },
  {
    id: 2,
    title: 'Phishing Campaign Targeting Financial Sector',
    description: 'Sophisticated phishing emails impersonating banking institutions',
    severity: 'High',
    priorityScore: 88,
    category: 'Phishing',
    date: '2023-11-14',
    status: 'Active',
    affectedSystems: 3500,
    threatActor: 'FIN7',
    mitigation: 'Implement email filtering, user awareness training'
  }
];

const threatTrendData = [
  { day: 'Nov 10', threats: 12, critical: 3 },
  { day: 'Nov 11', threats: 18, critical: 5 },
  { day: 'Nov 12', threats: 15, critical: 4 },
  { day: 'Nov 13', threats: 22, critical: 7 },
  { day: 'Nov 14', threats: 19, critical: 6 },
  { day: 'Nov 15', threats: 26, critical: 9 },
];

const categoryData = [
  { name: 'CVE', count: 12 },
  { name: 'Phishing', count: 8 },
  { name: 'Ransomware', count: 6 },
  { name: 'DDoS', count: 4 },
  { name: 'Data Breach', count: 7 },
];

const statsFallback = { totalThreats: 24, criticalThreats: 9, activeIncidents: 3, avgResponseTime: '2.4h' };

const API_BASE = process.env.REACT_APP_API_BASE_URL || window.location.origin;

export default function CyberThreatDashboard() {
  const [threats, setThreats] = useState<any[]>([]);
  const [filteredThreats, setFilteredThreats] = useState<any[]>([]);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stats, setStats] = useState<any>(statsFallback);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/threats`);
        if (!res.ok) throw new Error('api error');
        const json = await res.json();
        setThreats(json);
        setFilteredThreats(json);
      } catch (e) {
        setThreats(mockThreats);
        setFilteredThreats(mockThreats);
      }

      try {
        const sres = await fetch(`${API_BASE}/api/threats/stats`);
        if (sres.ok) {
          const sjson = await sres.json();
          setStats(sjson);
        }
      } catch (e) {
        setStats(statsFallback);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...threats];
    if (severityFilter !== 'All') result = result.filter(t => t.severity === severityFilter);
    if (categoryFilter !== 'All') result = result.filter(t => t.category === categoryFilter);
    setFilteredThreats(result);
  }, [severityFilter, categoryFilter, threats]);

  const getSeverityColor = (s: string) => {
    if (s === 'Critical') return 'text-red-600';
    if (s === 'High') return 'text-orange-500';
    if (s === 'Medium') return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">CyberShield Intelligence (MVP)</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded">Total: {stats.totalThreats}</div>
          <div className="bg-white p-4 rounded">Critical: {stats.criticalThreats}</div>
          <div className="bg-white p-4 rounded">Active: {stats.activeIncidents}</div>
          <div className="bg-white p-4 rounded">Avg Response: {stats.avgResponseTime}</div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-2">Threat Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={threatTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="threats" stroke="#3b82f6" />
                <Line type="monotone" dataKey="critical" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-2">Threats by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded mb-6 flex gap-4">
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="CVE">CVE</option>
            <option value="Phishing">Phishing</option>
            <option value="Ransomware">Ransomware</option>
            <option value="DDoS">DDoS</option>
            <option value="Data Breach">Data Breach</option>
          </select>
        </div>

        {/* Threats List */}
        <div className="bg-white rounded shadow">
          {filteredThreats.map(t => (
            <div key={t.id} className="border-b p-3 flex justify-between">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-gray-600">{t.description}</div>
              </div>
              <div className={getSeverityColor(t.severity)}>{t.severity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

