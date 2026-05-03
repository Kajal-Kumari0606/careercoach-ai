import React, { useState } from 'react';
import {
  CheckCircle2, XCircle, ChevronLeft, Download, Copy,
  Target, AlertTriangle, FileEdit, Users, Check
} from 'lucide-react';

export default function Dashboard({ results, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  // If results is missing some fields, provide fallbacks
  const {
    matchScore = 0,
    missingSkills = [],
    rewrittenBullets = [],
    interviewQuestions = []
  } = results || {};

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'skills', label: 'Skills Gap', icon: AlertTriangle },
    { id: 'resume', label: 'Resume Tips', icon: FileEdit },
    { id: 'interview', label: 'Interview Prep', icon: Users },
  ];

  const handleCopy = () => {
    const textToCopy = interviewQuestions.map(q => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = interviewQuestions.map(q => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n');
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Interview_Prep.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col">
      <button
        onClick={onReset}
        className="self-start flex items-center text-slate-500 hover:text-navy-600 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Upload
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-grow flex flex-col">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${isActive
                    ? 'border-b-2 border-navy-600 text-navy-600'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-navy-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-8 overflow-y-auto flex-grow">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-navy-900">Job Match Score</h2>
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    className="text-slate-100"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="80"
                    cx="96"
                    cy="96"
                  />
                  <circle
                    className={matchScore >= 75 ? 'text-green-500' : matchScore >= 50 ? 'text-yellow-500' : 'text-red-500'}
                    strokeWidth="12"
                    strokeDasharray={80 * 2 * Math.PI}
                    strokeDashoffset={80 * 2 * Math.PI - (matchScore / 100) * (80 * 2 * Math.PI)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="80"
                    cx="96"
                    cy="96"
                    style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-navy-900">{matchScore}</span>
                  <span className="text-sm text-slate-500">/ 100</span>
                </div>
              </div>
              <p className="text-slate-600 max-w-lg text-center">
                {matchScore >= 80
                  ? "Great match! Your profile aligns very well with this role."
                  : matchScore >= 50
                    ? "Good start, but you could improve your resume by adding missing keywords."
                    : "Consider adding more relevant skills or reformatting your experience to better match this job description."}
              </p>
            </div>
          )}

          {/* Skills Gap Tab */}
          {activeTab === 'skills' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Top Missing Skills & Keywords</h2>
              <div className="grid gap-4">
                {missingSkills.map((skill, index) => (
                  <div key={index} className="flex items-start p-4 bg-red-50 border border-red-100 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-900">{skill.keyword}</h4>
                      <p className="text-red-700 text-sm mt-1">{skill.reason}</p>
                    </div>
                  </div>
                ))}
                {missingSkills.length === 0 && (
                  <div className="p-8 text-center text-slate-500">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    Great job! We couldn't find any major missing skills.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resume Tips Tab */}
          {activeTab === 'resume' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Suggested Bullet Point Improvements</h2>
              <div className="space-y-6">
                {rewrittenBullets.map((tip, index) => (
                  <div key={index} className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Original (Similar context)</span>
                      <p className="text-slate-600 line-through text-sm">{tip.originalContext}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-1 block">Suggested Rewrite</span>
                      <p className="text-navy-900 font-medium">{tip.rewritten}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview Prep Tab */}
          {activeTab === 'interview' && (
            <div className="animate-in fade-in duration-500 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-navy-900">Likely Interview Questions</h2>
                <div className="flex space-x-2">
                  <button onClick={handleCopy} className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
                    {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={handleDownload} className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-navy-600 rounded-md hover:bg-navy-700 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>

              <div className="space-y-6 flex-grow">
                {interviewQuestions.map((q, index) => (
                  <div key={index} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                    <h4 className="font-semibold text-navy-900 mb-2 flex items-start">
                      <span className="text-green-500 mr-2">Q{index + 1}.</span>
                      {q.question}
                    </h4>
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 ml-6">
                      <span className="text-xs font-semibold text-green-700 uppercase mb-1 block">Ideal Answer Approach</span>
                      <p className="text-slate-700 text-sm">{q.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
