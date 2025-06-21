// File type definitions with magic numbers and MIME types
const FILE_TYPES = {
  document: {
    extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp'],
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'application/rtf',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.presentation'
    ],
    conversions: {
      pdf: ['doc', 'docx', 'txt'],
      doc: ['pdf', 'docx', 'txt'],
      docx: ['pdf', 'doc', 'txt'],
      xls: ['xlsx', 'csv', 'pdf'],
      xlsx: ['xls', 'csv', 'pdf'],
      ppt: ['pptx', 'pdf'],
      pptx: ['ppt', 'pdf'],
      txt: ['pdf', 'doc', 'docx']
    }
  },
  image: {
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico'],
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
      'image/tiff',
      'image/x-icon'
    ],
    conversions: {
      jpg: ['png', 'gif', 'bmp', 'webp', 'tiff'],
      jpeg: ['png', 'gif', 'bmp', 'webp', 'tiff'],
      png: ['jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'],
      gif: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
      bmp: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      webp: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
      svg: ['png', 'jpg', 'jpeg'],
      tiff: ['jpg', 'jpeg', 'png', 'gif']
    }
  },
  audio: {
    extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'],
    mimeTypes: [
      'audio/mpeg',
      'audio/wav',
      'audio/flac',
      'audio/aac',
      'audio/ogg',
      'audio/mp4',
      'audio/x-ms-wma'
    ],
    conversions: {
      mp3: ['wav', 'flac', 'aac', 'ogg', 'm4a'],
      wav: ['mp3', 'flac', 'aac', 'ogg', 'm4a'],
      flac: ['mp3', 'wav', 'aac', 'ogg'],
      aac: ['mp3', 'wav', 'flac', 'ogg'],
      ogg: ['mp3', 'wav', 'flac', 'aac'],
      m4a: ['mp3', 'wav', 'flac', 'aac']
    }
  },
  video: {
    extensions: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v'],
    mimeTypes: [
      'video/mp4',
      'video/x-msvideo',
      'video/x-matroska',
      'video/quicktime',
      'video/x-ms-wmv',
      'video/x-flv',
      'video/webm'
    ],
    conversions: {
      mp4: ['avi', 'mkv', 'mov', 'wmv', 'webm'],
      avi: ['mp4', 'mkv', 'mov', 'wmv', 'webm'],
      mkv: ['mp4', 'avi', 'mov', 'wmv', 'webm'],
      mov: ['mp4', 'avi', 'mkv', 'wmv', 'webm'],
      wmv: ['mp4', 'avi', 'mkv', 'mov', 'webm'],
      webm: ['mp4', 'avi', 'mkv', 'mov']
    }
  },
  archive: {
    extensions: ['zip', '7z', 'tar', 'gz', 'bz2', 'xz'],
    mimeTypes: [
      'application/zip',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/gzip',
      'application/x-bzip2',
      'application/x-xz'
    ],
    conversions: {
      zip: ['7z', 'tar', 'gz'],
      '7z': ['zip', 'tar', 'gz'],
      tar: ['zip', '7z', 'gz'],
      gz: ['zip', '7z', 'tar']
    }
  }
};

// Magic number signatures for file type detection
const MAGIC_NUMBERS = {
  // Images
  'ffd8ff': 'jpg',
  '89504e47': 'png',
  '47494638': 'gif',
  '424d': 'bmp',
  '52494646': 'webp',
  // Documents
  '25504446': 'pdf',
  'd0cf11e0': 'doc',
  '504b0304': 'docx', // Also zip-based formats
  // Audio
  'fff3': 'mp3',
  'fff2': 'mp3',
  '52494646': 'wav',
  '664c6143': 'flac',
  // Video
  '66747970': 'mp4',
  '52494646': 'avi',
  '1a45dfa3': 'mkv',
  // Archives
  '504b0304': 'zip',
  '377abcaf271c': '7z',
  '1f8b': 'gz'
};

class FileValidator {
  static getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  }

  static getFileType(file) {
    const extension = this.getFileExtension(file.name);
    
    for (const [type, config] of Object.entries(FILE_TYPES)) {
      if (config.extensions.includes(extension)) {
        return type;
      }
    }
    return null;
  }

  static async validateFileType(file) {
    const extension = this.getFileExtension(file.name);
    const fileType = this.getFileType(file);
    
    if (!fileType) {
      return {
        valid: false,
        error: `Unsupported file type: .${extension}`,
        type: null
      };
    }

    // Validate MIME type
    const expectedMimeTypes = FILE_TYPES[fileType].mimeTypes;
    if (!expectedMimeTypes.includes(file.type)) {
      // Additional check with magic numbers
      const isValidMagic = await this.validateMagicNumber(file, extension);
      if (!isValidMagic) {
        return {
          valid: false,
          error: `File type mismatch. Expected ${fileType} file but got ${file.type}`,
          type: fileType
        };
      }
    }

    return {
      valid: true,
      error: null,
      type: fileType,
      extension: extension
    };
  }

  static async validateMagicNumber(file, expectedExtension) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arr = new Uint8Array(e.target.result);
        const header = Array.from(arr.slice(0, 8))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        // Check against known magic numbers
        for (const [magic, ext] of Object.entries(MAGIC_NUMBERS)) {
          if (header.startsWith(magic.toLowerCase())) {
            resolve(ext === expectedExtension);
            return;
          }
        }
        
        // If no magic number match, allow it (some files don't have clear signatures)
        resolve(true);
      };
      reader.onerror = () => resolve(false);
      reader.readAsArrayBuffer(file.slice(0, 8));
    });
  }

  static getAvailableConversions(fileExtension) {
    for (const [type, config] of Object.entries(FILE_TYPES)) {
      if (config.extensions.includes(fileExtension)) {
        return config.conversions[fileExtension] || [];
      }
    }
    return [];
  }

  static validateConversion(fromExtension, toExtension) {
    const fromType = this.getFileTypeByExtension(fromExtension);
    const toType = this.getFileTypeByExtension(toExtension);
    
    if (fromType !== toType) {
      return {
        valid: false,
        error: `Cannot convert between different file types: ${fromType} to ${toType}`
      };
    }

    const availableConversions = this.getAvailableConversions(fromExtension);
    if (!availableConversions.includes(toExtension)) {
      return {
        valid: false,
        error: `Conversion from ${fromExtension} to ${toExtension} is not supported`
      };
    }

    return { valid: true, error: null };
  }

  static getFileTypeByExtension(extension) {
    for (const [type, config] of Object.entries(FILE_TYPES)) {
      if (config.extensions.includes(extension)) {
        return type;
      }
    }
    return null;
  }

  static getFileIcon(extension) {
    const type = this.getFileTypeByExtension(extension);
    const icons = {
      document: '📄',
      image: '🖼️',
      audio: '🎵',
      video: '🎬',
      archive: '📦'
    };
    return icons[type] || '📄';
  }
}

window.FileValidator = FileValidator;
window.FILE_TYPES = FILE_TYPES;
