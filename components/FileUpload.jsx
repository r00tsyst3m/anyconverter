import React, { useState, useRef } from 'react';

function FileUpload({ onFileSelect, selectedFile }) {
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = async (file) => {
    setValidationError('');
    
    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setValidationError('File size must be less than 100MB');
      return;
    }

    // Validate file type
    const validation = await window.FileValidator.validateFileType(file);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    onFileSelect(file, validation);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    onFileSelect(null, null);
    setValidationError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer glass-morphism hover:bg-white/20 ${
            dragActive ? 'drag-active' : 'border-white/30'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileInput}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.mp3,.wav,.flac,.aac,.ogg,.mp4,.avi,.mkv,.mov,.wmv,.webm,.zip,.7z,.tar,.gz"
          />
          
          <div className="animate-float">
            <svg
              className="mx-auto h-16 w-16 text-white/70 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            Drop your file here
          </h3>
          <p className="text-white/70 mb-4">
            or click to browse from your computer
          </p>
          
          <div className="text-sm text-white/60">
            <p className="mb-2">Supported formats:</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <div className="bg-white/10 rounded px-2 py-1">📄 Documents</div>
              <div className="bg-white/10 rounded px-2 py-1">🖼️ Images</div>
              <div className="bg-white/10 rounded px-2 py-1">🎵 Audio</div>
              <div className="bg-white/10 rounded px-2 py-1">🎬 Video</div>
              <div className="bg-white/10 rounded px-2 py-1">📦 Archives</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-morphism rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl file-icon">
                {window.FileValidator.getFileIcon(window.FileValidator.getFileExtension(selectedFile.name))}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white truncate max-w-xs">
                  {selectedFile.name}
                </h3>
                <p className="text-white/70 text-sm">
                  {window.ConversionEngine.formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {validationError && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-200 text-sm">{validationError}</p>
        </div>
      )}
    </div>
  );
}

window.FileUpload = FileUpload;
