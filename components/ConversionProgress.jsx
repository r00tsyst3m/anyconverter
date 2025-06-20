import React, { useState, useEffect } from 'react';

function ConversionProgress({ 
  selectedFile, 
  selectedFormat, 
  isConverting, 
  onConversionComplete,
  onConversionError 
}) {
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);

  useEffect(() => {
    if (isConverting && selectedFile && selectedFormat) {
      startConversion();
    }
  }, [isConverting, selectedFile, selectedFormat]);

  const startConversion = async () => {
    try {
      setProgress(0);
      setConvertedFile(null);
      setConversionResult(null);

      const result = await window.ConversionEngine.convertFile(
        selectedFile,
        selectedFormat,
        (progressValue) => setProgress(progressValue)
      );

      setConvertedFile(result.file);
      setConversionResult(result);
      onConversionComplete(result);
    } catch (error) {
      onConversionError(error.message);
    }
  };

  const downloadFile = () => {
    if (convertedFile) {
      window.ConversionEngine.downloadFile(convertedFile);
    }
  };

  const resetConversion = () => {
    setProgress(0);
    setConvertedFile(null);
    setConversionResult(null);
  };

  if (!selectedFile || !selectedFormat) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="glass-morphism rounded-xl p-6">
        {!isConverting && !convertedFile && (
          <div className="text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Ready to Convert
            </h3>
            <p className="text-white/70 text-sm">
              {selectedFile.name} → {selectedFormat.toUpperCase()}
            </p>
          </div>
        )}

        {isConverting && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Converting...
                </h3>
                <p className="text-white/70 text-sm">
                  {progress}% complete
                </p>
              </div>
            </div>

            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="text-center text-white/60 text-sm">
              Processing your file...
            </div>
          </div>
        )}

        {convertedFile && conversionResult && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Conversion Complete!
              </h3>
            </div>

            <div className="bg-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Original File:</span>
                <span className="text-white font-medium">{selectedFile.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Converted File:</span>
                <span className="text-white font-medium">{convertedFile.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Original Size:</span>
                <span className="text-white font-medium">
                  {window.ConversionEngine.formatFileSize(conversionResult.originalSize)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Converted Size:</span>
                <span className="text-white font-medium">
                  {window.ConversionEngine.formatFileSize(conversionResult.convertedSize)}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={downloadFile}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 animate-pulse-glow"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download File</span>
              </button>
              
              <button
                onClick={resetConversion}
                className="px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Convert Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.ConversionProgress = ConversionProgress;
