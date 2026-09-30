# Quote Card Studio

Unsplash 사진에 한글·영문 명언을 담아 PNG 카드로 저장하는 교육용 MVP입니다.

## 기술 구성

- React + Vite + JavaScript
- 일반 CSS
- Unsplash API
- HTML Canvas
- localStorage

라우터, 외부 상태 관리 및 UI 라이브러리는 사용하지 않습니다.

## 설치 및 실행

Node.js 20.19 이상(또는 22.12 이상)과 pnpm을 준비하세요.

```bash
pnpm install
```

프로젝트 최상위 폴더에서 `.env.example`을 복사하여 **`.env` 파일**을 만드세요. `.env`는 폴더가 아니며 `package.json`과 같은 위치에 있어야 합니다.

```bash
cp .env.example .env
```

`.env`에 본인의 Unsplash Access Key를 입력하세요.

```env
VITE_UNSPLASH_ACCESS_KEY=YOUR_ACCESS_KEY
```

`YOUR_ACCESS_KEY`를 실제 Access Key로 바꾼 뒤 실행합니다.

```bash
pnpm dev
```

터미널에 표시되는 주소(기본값 `http://localhost:5173`)를 브라우저에서 여세요. 키를 변경했다면 개발 서버를 다시 실행하세요.

npm을 사용하려면 `npm install`, `npm run dev`로 실행할 수도 있습니다. 이 프로젝트에 포함된 잠금 파일은 pnpm용입니다.

### 프로덕션 빌드

```bash
pnpm build
pnpm preview
```

빌드 결과는 `dist` 폴더에 생성됩니다. 배포 환경에서도 빌드 전에 `VITE_UNSPLASH_ACCESS_KEY`를 설정해야 합니다. 환경변수를 바꾸면 다시 빌드하세요.

## 사용 방법

1. `autumn` 등의 검색어를 입력하고 **Search** 버튼을 누릅니다.
2. 검색된 사진 중 하나를 선택합니다.
3. 샘플 명언과 언어를 선택하거나 문구를 직접 입력합니다.
4. 필요하면 저자명을 입력합니다.
5. 출력 비율, 정렬, 글자 크기, 어두운 오버레이를 조절합니다.
6. **Download PNG**를 눌러 카드를 다운로드합니다.

샘플 명언을 고르면 검색어 입력란도 해당 명언의 추천 키워드로 바뀝니다. 사진 검색은 Search 버튼을 눌러야 실행됩니다.

## 주요 기능

- 검색 버튼으로만 Unsplash 사진 검색: 기본 12장, 같은 검색어는 메모리 캐시 재사용
- 사진 선택 및 사진가·Unsplash 출처 링크 표시
- 로컬 샘플 명언 24개: 한국어·영어 지원
- 사용자 문구 및 저자 입력
- 출력 크기: 1:1(1080×1080), 4:5(1080×1350), 9:16(1080×1920)
- 왼쪽·가운데·오른쪽 정렬, 글자 크기 및 오버레이 슬라이더
- 사진 대표색의 밝기에 따라 검정·흰색 글자 자동 선택
- Canvas 미리보기 및 PNG 내보내기
- 가운데 기준 cover 크롭, 기본 줄바꿈 및 긴 문구 자동 축소
- 즐겨찾는 명언, 마지막 편집 설정, 내보낸 최근 작업 최대 10개 저장
- 최근 작업을 선택하여 다시 편집
- 기본 반응형 다크 인터페이스

## Unsplash API 및 키

검색 요청은 다음 주소를 사용합니다.

```text
GET https://api.unsplash.com/search/photos?query=autumn&per_page=12
```

요청 헤더:

```js
Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
'Accept-Version': 'v1'
```

사진 검색 및 다운로드 추적에 **Access Key만** 사용합니다. Secret Key는 입력하지 마세요.

PNG 생성 후 실제 다운로드를 시작하기 전에 선택한 사진의 `links.download_location`에 내보내기당 한 번 요청합니다. 추적 요청이 실패하면 오류를 표시하고 다운로드를 중단합니다.

`.env`는 `.gitignore`로 제외되어 있습니다. 저장소에는 예시 파일 `.env.example`만 올리세요. `VITE_` 환경변수는 브라우저 코드에 포함되므로 Access Key가 사용자에게 보이지 않는 서버 비밀값은 아닙니다.

## 저장 데이터

localStorage에는 아래 세 종류만 저장합니다.

- `quote-card-studio:recent`: 최근 내보낸 작업 최대 10개(사진 URL·출처 정보와 편집 설정)
- `quote-card-studio:favorites`: 즐겨찾는 문구와 저자
- `quote-card-studio:settings`: 마지막 편집 설정과 문구

PNG나 base64 이미지 데이터는 저장하지 않습니다. 저장 데이터는 브라우저와 사이트 주소별로 분리되며, 브라우저 데이터를 삭제하면 사라집니다. 검색 결과 캐시는 새로고침하면 초기화됩니다.

## 파일 구조

```text
src/
  App.jsx                 # 상태 관리, 검색·내보내기 및 최근 작업
  main.jsx                # React 진입점
  styles.css              # 전체 스타일
  api/
    unsplash.js           # 검색, 캐시, 다운로드 추적, 출처 링크
  components/
    SearchBar.jsx         # 검색 입력과 버튼
    PhotoGrid.jsx         # 사진 목록, 선택 및 출처 표시
    Editor.jsx            # 명언·즐겨찾기와 편집 옵션
    CardPreview.jsx       # Canvas 미리보기
  data/
    quotes.json           # 한글·영문 샘플 명언
  utils/
    canvas.js             # 이미지 로드, 크롭, 줄바꿈, PNG 생성
    color.js              # 대표색 밝기로 글자색 선택
    storage.js            # localStorage 읽기·쓰기
.env.example              # 환경변수 예시
.gitignore                # 키·설치 파일·빌드 결과 제외
index.html                # HTML 진입점
package.json              # 의존성 및 실행 명령
pnpm-lock.yaml            # 의존성 잠금 파일
pnpm-workspace.yaml       # esbuild 설치 스크립트 허용 설정
```

## 확인한 동작

- 프로덕션 빌드 성공
- 실제 Unsplash `autumn` 검색 결과 12장 표시
- 사진 선택 및 한글 명언 미리보기 표시
- PNG 생성, 다운로드 요청 및 최근 작업 저장
- 로컬 테스트 이미지로 세 가지 출력 크기의 PNG 생성 확인
- 즐겨찾기 및 마지막 편집 설정의 새로고침 후 복원

브라우저에서 다운로드 요청이 완료된 상태까지 확인했으며, 실제 다운로드 폴더에 파일이 저장되었는지는 별도로 검증하지 않았습니다.

## 문제 해결 및 제한사항

- **API 키 없음:** `.env`가 파일인지, 변수 이름이 정확한지 확인하고 서버를 재시작하세요.
- **Unsplash 요청 실패:** Access Key, 인터넷 연결 및 Unsplash API 사용 한도를 확인하세요.
- **검색 결과 없음:** 다른 검색어를 입력하고 Search를 누르세요.
- **다운로드 버튼 비활성화:** 먼저 사진을 선택하세요.
- **Canvas 내보내기 실패:** 사진을 다시 선택하고 재시도하세요. 이미지 네트워크·CORS 문제로 실패할 수 있습니다.
- 검색은 첫 12개 결과만 제공하며 페이지 이동은 지원하지 않습니다.
- 문구는 최대 1,500자, 저자는 최대 160자입니다. 긴 문구는 자동 축소되며 극단적으로 많은 줄바꿈은 카드 영역에서 잘릴 수 있습니다.
- 글꼴은 기기의 시스템 글꼴을 사용하므로 환경에 따라 모양이 달라질 수 있습니다.
- 자동 글자색은 사진 전체의 대표색만 사용하므로 모든 사진과 오버레이 설정에서 최적 대비를 보장하지 않습니다.
- 브라우저 간 데이터 동기화, 사용자 계정, 서버 저장 기능은 없습니다.

## Git에 올리기

ZIP을 풀고 `quote-card-studio` 폴더 안의 소스 파일을 저장소에 올리세요. 숨김 파일인 `.gitignore`와 `.env.example`도 포함해야 합니다.

실제 키가 있는 `.env`, `.env` 백업, `node_modules`, `dist`는 올리지 마세요. 다른 환경에서 실행할 때는 의존성을 다시 설치하고 본인의 `.env`를 설정하면 됩니다.
