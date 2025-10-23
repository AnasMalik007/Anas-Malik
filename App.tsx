import React, { useState, useCallback, useRef } from 'react';
import { analyzeMedicalDocument } from './services/geminiService';
import type { AnalysisResult, LabResult, Medication } from './types';
import { 
  UploadIcon, LoaderIcon, AlertTriangleIcon, LogoIcon,
  DocumentIcon, DiagnosisIcon, LabIcon, PillIcon, ChecklistIcon
} from './components/icons';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdf.js to run in a separate thread
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const processPdf = async (file: File) => {
    setIsProcessingPdf(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1); // Process the first page
      const viewport = page.getViewport({ scale: 2.0 }); // Increase scale for better resolution
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (!context) {
        throw new Error("Could not create canvas context.");
      }

      await page.render({ canvasContext: context, viewport: viewport }).promise;
      const imageUrl = canvas.toDataURL('image/jpeg', 0.95); // High quality JPEG
      setImagePreviewUrl(imageUrl);
      setImageBase64(imageUrl.split(',')[1]);
      setMimeType('image/jpeg');
    } catch (e) {
      console.error("Error processing PDF:", e);
      setError("Failed to process PDF. It might be corrupted or unsupported.");
      resetState();
    } finally {
      setIsProcessingPdf(false);
    }
  };


  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.type.startsWith('image/')) {
        setError(null);
        setImageFile(file);
        
        const previewUrl = URL.createObjectURL(file);
        setImagePreviewUrl(previewUrl);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string)?.split(',')[1];
          setImageBase64(base64String);
          setMimeType(file.type);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setError(null);
        setImageFile(file);
        processPdf(file);
      } else {
        setError('Please select a valid image or PDF file.');
        resetState();
      }
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files ? e.target.files[0] : null);
  };
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    handleFileChange(event.dataTransfer.files ? event.dataTransfer.files[0] : null);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleAnalyzeClick = async () => {
    if (!imageBase64 || !mimeType) {
      setError('Please select an image or PDF file first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeMedicalDocument(imageBase64, mimeType, userPrompt);
      setAnalysisResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
    setImageFile(null);
    setImageBase64(null);
    setMimeType(null);
    setUserPrompt('');
    setAnalysisResult(null);
    setIsLoading(false);
    setError(null);
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-black min-h-screen font-sans text-slate-300 relative overflow-hidden">
      <GlobalStyles />
      <div className="aurora-background">
          <div className="aurora-g-1"></div>
          <div className="aurora-g-2"></div>
          <div className="aurora-g-3"></div>
          <div className="aurora-g-4"></div>
      </div>

      <div className="container mx-auto p-4 md:p-8 max-w-7xl relative z-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 flex items-center justify-center gap-3">
            <LogoIcon className="w-10 h-10" />
            MediScan AI
          </h1>
          <p className="text-slate-400 mt-2 text-lg max-w-2xl mx-auto">
            Harnessing AI to interpret your medical documents with futuristic precision.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div 
                className={`relative border-2 border-slate-700 rounded-xl p-8 text-center cursor-pointer bg-black/30 backdrop-blur-md hover:border-slate-500 transition-all duration-300 flex items-center justify-center min-h-[220px] ${isDragging ? 'border-fuchsia-500 ring-4 ring-fuchsia-500/20 scale-105 shadow-[0_0_25px_rgba(217,70,239,0.5)]' : 'border-dashed'}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileSelect}
                accept="image/*,application/pdf"
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center space-y-2 text-slate-400 pointer-events-none">
                {imagePreviewUrl ? (
                    <div className="space-y-3">
                      <img src={imagePreviewUrl} alt="Document Preview" className="max-h-40 rounded-lg object-contain shadow-lg" />
                      <p className="text-sm font-semibold truncate max-w-xs">{imageFile?.name}</p>
                    </div>
                ) : isProcessingPdf ? (
                    <>
                      <LoaderIcon className="w-8 h-8 animate-spin text-purple-400" />
                      <p className="mt-2 text-slate-300 font-semibold">Processing PDF...</p>
                    </>
                ) : (
                   <>
                     <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700">
                        <UploadIcon className="w-8 h-8 text-slate-500" />
                     </div>
                    <p className="mt-2 text-slate-300 font-semibold">Drag & Drop Document</p>
                    <p className="text-sm">Image or PDF - or click to browse</p>
                   </>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-400 mb-2">
                Specific Question (Optional)
              </label>
              <textarea
                id="prompt"
                rows={3}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="e.g., 'What does the high WBC count mean?'"
                className="w-full p-3 bg-slate-900/80 border border-slate-700 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition text-slate-200 placeholder-slate-500 backdrop-blur-md"
              />
            </div>
            
            <div className="flex gap-4">
               <button
                  onClick={handleAnalyzeClick}
                  disabled={!imageFile || isLoading || isProcessingPdf}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-600 hover:from-fuchsia-500 hover:via-purple-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-black disabled:bg-slate-700 disabled:from-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-purple-500/20 hover:shadow-purple-400/40 hover:shadow-lg"
                >
                  {isLoading && <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                  {isLoading ? 'Analyzing...' : 'Analyze Document'}
                </button>
                <button
                  onClick={resetState}
                  className="px-6 py-3 border border-slate-700 text-base font-medium rounded-md text-slate-300 bg-slate-800/80 backdrop-blur-md hover:bg-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-black transition"
                >
                  Reset
                </button>
            </div>
          </div>

          <div className="lg:col-span-3 bg-black/30 backdrop-blur-xl p-6 rounded-xl shadow-2xl border border-slate-800 min-h-[400px]">
            <h2 className="text-2xl font-bold mb-4 text-slate-50">Analysis Results</h2>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <LoaderIcon className="w-12 h-12 animate-spin mb-4 text-purple-400" />
                <p>Analyzing document... this may take a moment.</p>
              </div>
            )}
            {error && <ErrorDisplay message={error} />}
            {analysisResult && <AnalysisDisplay result={analysisResult} />}
            {!isLoading && !error && !analysisResult && (
              <div className="text-center text-slate-500 pt-16">
                <DocumentIcon className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Your AI-powered analysis will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const DocumentTypeBadge = ({ type }: { type: string }) => {
  // FIX: Specify props type for icon to allow cloning with className.
  const typeStyles: { [key: string]: { icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; color: string; } } = {
    'Lab Report': { icon: <LabIcon />, color: 'blue' },
    'Prescription': { icon: <PillIcon />, color: 'orange' },
    'Medicine Label': { icon: <PillIcon />, color: 'orange' },
    'Other Medical Document': { icon: <DocumentIcon />, color: 'gray' },
  };

  const style = typeStyles[type] || typeStyles['Other Medical Document'];
  const colors: { [key: string]: string } = {
      gray: "border-slate-600 bg-slate-800/50 text-slate-300",
      blue: "border-blue-500/50 bg-blue-900/50 text-blue-200",
      orange: "border-orange-500/50 bg-orange-900/50 text-orange-200",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 mb-5 text-sm font-medium rounded-full border ${colors[style.color]} backdrop-blur-lg`}>
      {React.cloneElement(style.icon, { className: 'w-5 h-5' })}
      <span>{type}</span>
    </div>
  );
};

const AnalysisDisplay = ({ result }: { result: AnalysisResult }) => (
  <div className="space-y-6 animate-fade-in">
    {result.documentType && <DocumentTypeBadge type={result.documentType} />}

    <ResultCard title="Document Summary" icon={<DocumentIcon />} color="gray">
      <p>{result.documentSummary}</p>
    </ResultCard>

    <ResultCard title="Potential Diagnosis" icon={<DiagnosisIcon />} color="fuchsia">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <RadialProgress score={result.potentialDiagnosis.confidenceScore} />
        </div>
        <div>
          <h4 className="font-semibold text-xl text-fuchsia-300">{result.potentialDiagnosis.condition}</h4>
          <p className="text-slate-400 mt-1">{result.potentialDiagnosis.reasoning}</p>
        </div>
      </div>
    </ResultCard>
    
    {result.labResults && result.labResults.length > 0 && (
      <ResultCard title="Lab Results" icon={<LabIcon />} color="blue">
        <LabResultsTable results={result.labResults} />
      </ResultCard>
    )}
    
    {result.medications && result.medications.length > 0 && (
      <ResultCard title="Medications" icon={<PillIcon />} color="orange">
        <MedicationsTable medications={result.medications} />
      </ResultCard>
    )}

    <ResultCard title="Recommendations" icon={<ChecklistIcon />} color="green">
      <ul className="space-y-2 text-slate-400">
        {result.recommendations.map((rec, i) => 
            <li key={i} className="flex items-start gap-3">
                <span className="text-green-400 mt-1">&#10003;</span>
                <span>{rec}</span>
            </li>
        )}
      </ul>
    </ResultCard>
  </div>
);

const cardColors = {
    gray: "border-t-slate-500",
    fuchsia: "border-t-fuchsia-500",
    blue: "border-t-blue-500",
    orange: "border-t-orange-500",
    green: "border-t-green-500",
};

// FIX: Specify props type for icon to allow cloning with className.
const ResultCard = ({ title, icon, color, children }: { title: string; icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; color: keyof typeof cardColors; children: React.ReactNode }) => (
    <div className={`bg-slate-900/50 backdrop-blur-lg rounded-xl overflow-hidden border border-slate-800 shadow-lg relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-t-4 ${cardColors[color]}`}>
        <div className="flex items-center gap-4 p-4 bg-black/20">
             <div className="p-2 bg-slate-900 rounded-full border border-slate-700 shadow-inner">
                {React.cloneElement(icon, { className: 'w-6 h-6' })}
             </div>
            <h3 className="text-xl font-bold text-slate-100">{title}</h3>
        </div>
        <div className="p-5 text-slate-300 text-base">
            {children}
        </div>
    </div>
);

const RadialProgress = ({ score }: { score: number }) => {
  const size = 100;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - score * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
         <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle
          className="text-slate-800"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          className="transition-all duration-1000 ease-out"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          style={{ filter: `drop-shadow(0 0 6px #a78bfa)` }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-50">
        {(score * 100).toFixed(0)}%
      </span>
    </div>
  );
};

const LabResultsTable = ({ results }: { results: LabResult[] }) => (
  <div className="overflow-x-auto -mx-5">
    <table className="min-w-full">
      <thead className="bg-black/20">
        <tr>
          <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Test Name</th>
          <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Value</th>
          <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Range</th>
          <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Interpretation</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800">
        {results.map((res, i) => (
          <tr key={i} className="hover:bg-slate-800/50 transition-colors">
            <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-200">{res.testName}</td>
            <td className="px-5 py-4 whitespace-nowrap">{res.value}</td>
            <td className="px-5 py-4 whitespace-nowrap text-slate-400">{res.referenceRange}</td>
            <td className="px-5 py-4 whitespace-nowrap text-slate-400">{res.interpretation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MedicationsTable = ({ medications }: { medications: Medication[] }) => (
  <div className="overflow-x-auto -mx-5">
    <table className="min-w-full">
      <thead className="bg-black/20">
        <tr>
          <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
          <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Dosage</th>
          <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Purpose</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800">
        {medications.map((med, i) => (
          <tr key={i} className="hover:bg-slate-800/50 transition-colors">
            <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-200">{med.name}</td>
            <td className="px-5 py-4 whitespace-nowrap">{med.dosage}</td>
            <td className="px-5 py-4 whitespace-nowrap text-slate-400">{med.purpose}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="bg-red-900/30 backdrop-blur-md border border-red-500/50 text-red-300 p-4 rounded-lg flex items-start gap-3">
    <AlertTriangleIcon className="w-6 h-6 flex-shrink-0 text-red-400 mt-1" />
    <div>
      <h3 className="font-semibold text-red-200">Analysis Failed</h3>
      <p>{message}</p>
    </div>
  </div>
);

const GlobalStyles = () => (
  <style>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes aurora {
      0% { transform: translate(var(--x-0), var(--y-0)) }
      25% { transform: translate(var(--x-1), var(--y-1)) }
      50% { transform: translate(var(--x-2), var(--y-2)) }
      75% { transform: translate(var(--x-3), var(--y-3)) }
      100% { transform: translate(var(--x-0), var(--y-0)) }
    }
    .aurora-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }
    .aurora-background > div {
        position: absolute;
        border-radius: 9999px;
        mix-blend-mode: screen;
        filter: blur(80px);
        opacity: 0.4;
    }
    .aurora-g-1 {
        --x-0: -20%; --y-0: -40%;
        --x-1: 30%; --y-1: 10%;
        --x-2: 80%; --y-2: -20%;
        --x-3: 60%; --y-3: 60%;
        top: 0;
        left: 0;
        width: 500px;
        height: 500px;
        background-color: #f472b6;
        animation: aurora 20s linear infinite;
    }
    .aurora-g-2 {
        --x-0: 80%; --y-0: -30%;
        --x-1: 40%; --y-1: 50%;
        --x-2: -10%; --y-2: 20%;
        --x-3: 20%; --y-3: -40%;
        top: 0;
        left: 0;
        width: 400px;
        height: 400px;
        background-color: #a78bfa;
        animation: aurora 24s linear infinite;
    }
    .aurora-g-3 {
        --x-0: 100%; --y-0: 80%;
        --x-1: 50%; --y-1: 10%;
        --x-2: 0%; --y-2: 100%;
        --x-3: 20%; --y-3: 40%;
        top: 0;
        left: 0;
        width: 350px;
        height: 350px;
        background-color: #22d3ee;
        animation: aurora 28s linear infinite;
    }
    .aurora-g-4 {
        --x-0: -10%; --y-0: 100%;
        --x-1: 20%; --y-1: -20%;
        --x-2: 70%; --y-2: 80%;
        --x-3: 90%; --y-3: 10%;
        top: 0;
        left: 0;
        width: 300px;
        height: 300px;
        background-color: #3b82f6;
        animation: aurora 32s linear infinite;
    }
  `}</style>
);

export default App;