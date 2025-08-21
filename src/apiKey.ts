const apiKey = import.meta.env.VITE_JAZZ_API_KEY;

if (!apiKey) {
  throw new Error(
    "VITE_JAZZ_API_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인하거나 Netlify 환경 변수를 설정해주세요."
  );
}

export { apiKey };
