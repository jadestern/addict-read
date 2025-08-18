// RSS URL 검증 관련 타입
export interface ValidationResult {
  isValid: boolean;
  error: string | null;
  cleanUrl?: string;
}

// 기본 URL 유효성 검사
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // HTTP 또는 HTTPS 프로토콜만 허용
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// RSS URL 검증
export function validateRssUrl(url: string): ValidationResult {
  // 앞뒤 공백 제거
  const cleanUrl = url.trim();
  
  // 빈 문자열 검사
  if (!cleanUrl) {
    return {
      isValid: false,
      error: 'URL을 입력해주세요',
    };
  }
  
  // URL 형식 검사
  if (!isValidUrl(cleanUrl)) {
    // 프로토콜 확인
    if (cleanUrl.includes('://') && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      return {
        isValid: false,
        error: 'HTTP 또는 HTTPS URL만 지원됩니다',
      };
    }
    
    return {
      isValid: false,
      error: '유효한 URL 형식이 아닙니다',
    };
  }
  
  return {
    isValid: true,
    error: null,
    cleanUrl,
  };
}