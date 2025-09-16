import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

const CyberThreatIntelligencePlatform = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Data
  const recentThreats = [
    { id: 1, cve: "CVE-2024-3400", severity: "Critical", source: "Palo Alto Advisory", date: "2024-04-12" },
    { id: 2, cve: "APT29 Phishing", severity: "High", source: "OSINT Feeds", date: "2024-04-11" },
    { id: 3, cve: "Ransomware Expansion", severity: "Medium", source: "Dark Web Monitoring", date: "2024-04-10" },
  ];

  const vulnTrends = [
    { week: "Week 1", vulns: 12 },
    { week: "Week 2", vulns: 25 },
    { week: "Week 3", vulns: 18 },
    { week: "Week 4", vulns: 30 },
  ];

  const threatActors = [
    { name: "APT29", incidents: 14 },
    { name: "Conti", incidents: 9 },
    { name: "Lapsus$", incidents: 6 },
    { name: "LockBit", incidents: 12 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-extrabold tracking-wide"> Cyber Threat Intelligence Platform</h1>
          <p className="text-sm opacity-80">AI-powered real-time threat insights</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="py-4 bg-black/30 backdrop-blur-md shadow-md">
        <div className="container mx-auto flex justify-center space-x-4">
          {["overview", "analysis"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md scale-105"
                  : "bg-gray-700/60 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 container mx-auto px-6 py-10 space-y-10">
        {activeTab === "overview" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-xl p-6 shadow-xl bg-gradient-to-br from-red-500 to-red-700 text-white text-center">
                <h3 className="text-lg font-semibold">Critical Threats</h3>
                <p className="text-5xl font-extrabold mt-2">12</p>
                <p className="text-sm opacity-80">Active in past 24h</p>
              </div>
              <div className="rounded-xl p-6 shadow-xl bg-gradient-to-br from-yellow-400 to-orange-600 text-white text-center">
                <h3 className="text-lg font-semibold">Vulnerabilities</h3>
                <p className="text-5xl font-extrabold mt-2">47</p>
                <p className="text-sm opacity-80">New CVEs this week</p>
              </div>
              <div className="rounded-xl p-6 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white text-center">
                <h3 className="text-lg font-semibold">Threat Actors</h3>
                <p className="text-5xl font-extrabold mt-2">8</p>
                <p className="text-sm opacity-80">Actively monitored</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-xl p-6 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                <h3 className="text-lg font-bold text-indigo-300 mb-4">📈 Vulnerability Trends</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={vulnTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="week" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Line type="monotone" dataKey="vulns" stroke="#818CF8" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl p-6 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                <h3 className="text-lg font-bold text-pink-300 mb-4">⚔️ Threat Actor Activity</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={threatActors}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Bar dataKey="incidents" fill="url(#gradientBar)" />
                    <defs>
                      <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EC4899" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.9} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-800 to-gray-900">
              <h3 className="text-lg font-bold text-green-400 p-4">🛡️ Recent Threats</h3>
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">CVE / Threat</th>
                    <th className="p-3 text-left">Severity</th>
                    <th className="p-3 text-left">Source</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentThreats.map((t, i) => (
                    <tr key={t.id} className={i % 2 === 0 ? "bg-gray-700/60" : "bg-gray-600/50"}>
                      <td className="p-3">{t.id}</td>
                      <td className="p-3 font-medium">{t.cve}</td>
                      <td className="p-3 font-semibold">{t.severity}</td>
                      <td className="p-3">{t.source}</td>
                      <td className="p-3">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "analysis" && (
          <div className="rounded-xl p-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 shadow-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-white">🔍 Vulnerability Analysis</h3>
            <input
              type="text"
              placeholder="Enter CVE (e.g., CVE-2024-3400)"
              className="w-full border border-white/30 bg-black/30 text-white rounded-lg p-3 mb-4 focus:ring-2 focus:ring-pink-400"
            />
            <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition">
              Analyze
            </button>
            <div className="mt-6 p-4 bg-black/40 border border-white/20 rounded-lg">
              <h4 className="font-semibold text-indigo-300">AI Analysis Result:</h4>
              <p className="text-sm text-gray-300 mt-2">(Results will appear here after analysis)</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CyberThreatIntelligencePlatform;
