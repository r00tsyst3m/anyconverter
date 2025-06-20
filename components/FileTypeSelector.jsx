import React, { useState, useEffect } from 'react';

function FileTypeSelector({ selectedFile, fileValidation, onFormatSelect, selectedFormat }) {
  const [availableFormats, setAvailableFormats] = useState([]);

  useEffect(() => {
    if (selectedFile && fileValidation) {
      const extension = window.FileValidator.getFileExtension(selectedFile.name);
      const formats = window.FileValidator.getAvailableConversions(extension);
      setAvailableFormats(formats);
    } else {
      setAvailableFormats([]);
    }
  }, [selectedFile, fileValidation]);

  if (!selectedFile || !fileValidation) {
    return null;
  }

  const currentExtension = window.FileValidator.getFileExtension(selectedFile.name);
  const fileType = fileValidation.type;

  const getFormatDescription = (format) => {
    const descriptions = {
      // Documents
      pdf: 'Portable Document Format',
      doc: 'Microsoft Word 97-2003',
      docx: 'Microsoft Word Document',
      xls: 'Microsoft Excel 97-2003',
      xlsx: 'Microsoft Excel Workbook',
      ppt: 'Microsoft PowerPoint 97-2003',
      pptx: 'Microsoft PowerPoint Presentation',
      txt: 'Plain Text Document',
      
      // Images
      jpg: 'JPEG Image',
      jpeg: 'JPEG Image',
      png: 'Portable Network Graphics',
      gif: 'Graphics Interchange Format',
      bmp: 'Bitmap Image',
      webp: 'WebP Image',
      svg: 'Scalable Vector Graphics',
      tiff: 'Tagged Image File Format',
      
      // Audio
      mp3: 'MPEG Audio Layer 3',
      wav: 'Waveform Audio File',
      flac: 'Free Lossless Audio Codec',
      aac: 'Advanced Audio Coding',
      ogg: 'Ogg Vorbis Audio',
      m4a: 'MPEG-4 Audio',
      
      // Video
      mp4: 'MPEG-4 Video',
      avi: 'Audio Video Interleave',
      mkv: 'Matroska Video',
      mov: 'QuickTime Movie',
      wmv: 'Windows Media Video',
      webm: 'WebM Video',
      
      // Archives
      zip: 'ZIP Archive',
      '7z': '7-Zip Archive',
      tar: 'Tape Archive',
      gz: 'Gzip Compressed Archive'
    };
    
    return descriptions[format] || format.toUpperCase();
  };

  const getTypeIcon = (type) => {
    const icons = {
      document: '📄',
      image: '🖼️',
      audio: '🎵',
      video: '🎬',
      archive: '📦'
    };
    return icons[type] || '📄';
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="glass-morphism rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-2xl">{getTypeIcon(fileType)}</span>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Convert to {fileType} format
            </h3>
            <p className="text-white/70 text-sm">
              Current format: {currentExtension.toUpperCase()}
            </p>
          </div>
        </div>

        {availableFormats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableFormats.map((format) => (
              <button
                key={format}
                onClick={() => onFormatSelect(format)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  selectedFormat === format
                    ? 'border-blue-400 bg-blue-500/20 text-white'
                    : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">
                      .{format.toUpperCase()}
                    </div>
                    <div className="text-sm opacity-80">
                      {getFormatDescription(format)}
                    </div>
                  </div>
                  {selectedFormat === format && (
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/70">
              No conversion options available for this file type.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

window.FileTypeSelector = FileTypeSelector;
