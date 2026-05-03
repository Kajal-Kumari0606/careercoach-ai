import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import { analyzeResume } from './services/gemini';
import { extractTextFromPdf } from './services/pdfParser';
import { saveSessionData } from './services/firebase';
import { Loader2 } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [inputType, setInputType] = useState('pdf');
  const [manualResumeText, setManualResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (inputType === 'pdf' && !file) {
      setError('Please upload a resume PDF.');
      return;
    }
    if (inputType === 'text' && !manualResumeText.trim()) {
      setError('Please paste your resume text.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please enter a job description.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setLoadingStatus('Initializing...');
    setResults(null);

    try {
      // 1. Get resume text
      let resumeText = '';
      if (inputType === 'text') {
        resumeText = manualResumeText;
      } else {
        resumeText = await extractTextFromPdf(file, (msg) => setLoadingStatus(msg));
      }
      
      setLoadingStatus('Analyzing with Gemini AI...');
      // 2. Call Gemini API
      const analysisData = await analyzeResume(resumeText, jobDescription);
      
      // 3. Save session to Firebase
      await saveSessionData(jobDescription, analysisData);

      // 4. Set results
      setResults(analysisData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {!results ? (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-navy-900 mb-2">Resume Analyzer</h1>
              <p className="text-slate-500 mb-8">
                Upload your resume and the job description to get AI-powered insights, skills gap analysis, and tailored interview questions.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Input Type Toggle */}
                <div className="flex p-1 bg-slate-100 rounded-lg w-fit mx-auto mb-6">
                  <button
                    onClick={() => setInputType('pdf')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                      inputType === 'pdf' ? 'bg-white shadow-sm text-navy-900' : 'text-slate-500 hover:text-navy-600'
                    }`}
                  >
                    Upload PDF
                  </button>
                  <button
                    onClick={() => setInputType('text')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                      inputType === 'text' ? 'bg-white shadow-sm text-navy-900' : 'text-slate-500 hover:text-navy-600'
                    }`}
                  >
                    Paste Text
                  </button>
                </div>

                {inputType === 'pdf' ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Upload Resume (PDF)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-navy-500 transition-colors">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-slate-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-navy-600 hover:text-navy-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-navy-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileChange} />
                          </label>
                        </div>
                        <p className="text-xs text-slate-500">
                          {file ? file.name : "PDF up to 10MB"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Resume Text
                    </label>
                    <textarea
                      rows={6}
                      className="w-full border-slate-300 rounded-lg shadow-sm focus:border-navy-500 focus:ring-navy-500 border p-3"
                      placeholder="Paste your entire resume text here..."
                      value={manualResumeText}
                      onChange={(e) => setManualResumeText(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    rows={6}
                    className="w-full border-slate-300 rounded-lg shadow-sm focus:border-navy-500 focus:ring-navy-500 border p-3"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      {loadingStatus || 'Analyzing...'}
                    </>
                  ) : (
                    'Analyze Resume'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Dashboard results={results} onReset={() => setResults(null)} />
        )}
      </main>
    </div>
  );
}

export default App;
