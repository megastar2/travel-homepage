// 하늘여행 홈페이지 접근을 아이디·비밀번호로 잠그는 Vercel 라우팅 미들웨어 (HTTP Basic 인증)

// 아이디는 여기서 고정. 비밀번호는 Vercel 환경변수 SITE_PASS 에서 읽음(코드·깃에는 저장하지 않음).
const USER = 'sky';

export default function middleware(request) {
  const expectedPass = process.env.SITE_PASS;

  // 비밀번호(SITE_PASS)가 아직 설정 안 됐으면 전부 차단 — 안전 우선.
  if (!expectedPass) {
    return new Response('사이트 준비 중입니다. (관리자: Vercel 환경변수 SITE_PASS 를 설정하세요.)', {
      status: 503,
    });
  }

  const auth = request.headers.get('authorization');
  if (auth && auth.startsWith('Basic ')) {
    const decoded = atob(auth.slice(6)); // "아이디:비밀번호"
    const sep = decoded.indexOf(':');
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (user === USER && pass === expectedPass) {
      return; // 통과 → 홈페이지를 보여줌
    }
  }

  // 인증 실패 → 브라우저 로그인 창을 띄움.
  return new Response('인증이 필요합니다.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Sky Travel", charset="UTF-8"',
    },
  });
}
