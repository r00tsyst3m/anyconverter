import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileValidation, setFileValidation] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState('');

  const handleFileSelect = (file, validation) => {
    setSelectedFile(file);
    setFileValidation(validation);
    setSelectedFormat('');
    setConversionError('');
  };

  const handleFormatSelect = (format) => {
    setSelectedFormat(format);
    setConversionError('');
  };

  const startConversion = () => {
    if (selectedFile && selectedFormat) {
      setIsConverting(true);
      setConversionError('');
    }
  };

  const handleConversionComplete = (result) => {
    setIsConverting(false);
  };

  const handleConversionError = (error) => {
    setIsConverting(false);
    setConversionError(error);
  };

  const resetApp = () => {
    setSelectedFile(null);
    setFileValidation(null);
    setSelectedFormat('');
    setIsConverting(false);
    setConversionError('');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 animate-float">
            🔄 File Converter
          </h1>
          <p className="text-xl text-white/80 mb-2">
            Convert your files between different formats
          </p>
          <p className="text-white/60">
            Support for documents, images, audio, video, and archive files
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* File Upload */}
          <window.FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />

          {/* Format Selection */}
          <window.FileTypeSelector
            selectedFile={selectedFile}
            fileValidation={fileValidation}
            onFormatSelect={handleFormatSelect}
            selectedFormat={selectedFormat}
          />

          {/* Convert Button */}
          {selectedFile && selectedFormat && !isConverting && (
            <div className="text-center">
              <button
                onClick={startConversion}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 animate-pulse-glow"
              >
                🚀 Start Conversion
              </button>
            </div>
          )}

          {/* Conversion Progress */}
          <window.ConversionProgress
            selectedFile={selectedFile}
            selectedFormat={selectedFormat}
            isConverting={isConverting}
            onConversionComplete={handleConversionComplete}
            onConversionError={handleConversionError}
          />

          {/* Error Display */}
          {conversionError && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-red-200 font-semibold">Conversion Error</h4>
                    <p className="text-red-300 text-sm">{conversionError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-white/60">
          <p className="text-sm">
            Secure client-side file conversion • No files uploaded to servers
          </p>
          <div className="flex justify-center space-x-8 mt-4 text-xs">
            <span>📄 Documents</span>
            <span>🖼️ Images</span>
            <span>🎵 Audio</span>
            <span>🎬 Video</span>
            <span>📦 Archives</span>
          </div>
        </div>

        {/* Reset Button */}
        {(selectedFile || conversionError) && (
          <div className="text-center mt-8">
            <button
              onClick={resetApp}
              className="text-white/70 hover:text-white transition-colors text-sm underline"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById('renderDiv')).render(<App />);
