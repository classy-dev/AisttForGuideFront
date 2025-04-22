# AisttForGuideFront

## 개요

이 프로젝트는 처음 피자 제조하는 교육자를 대상으로 AI쪽 컴퓨팅과 통신을 통해서 Vision에서 측정된 Segmentation 데이터와 Detection 데이터를 받아서 등록된 레시피 데이터와 결합하여 피자 제조를 가이드 및 티칭을 해주는 시스템의 Front Visualization과 관련된 레포지토리입니다.

## 브랜치 전략

이 레포지토리는 main, develop, stage의 세 가지 주요 브랜치로 구성됩니다.

- main: 프로덕션 환경에 배포되는 코드를 담고 있습니다.
- develop: 개발 환경에서 사용되는 코드를 담고 있습니다. 새로운 기능 개발이 이루어지는 브랜치입니다.
- stage: 스테이징 환경에서 사용되는 코드를 담고 있습니다. develop 브랜치에서 검증된 코드가 이 브랜치로 병합됩니다.
- store/gwanghwamun: 브랜치는 광화문 매장을 위한 레시피북 기능 코드를 담고있으며 유지를 위해 별도로 관리됩니다.

## 설치 및 실행 방법

1. 레포지토리를 클론합니다: git clone https://github.com/gopizza/AisttForGuideFront.git
2. 디렉토리로 이동합니다: cd AisttForGuideFront
3. 의존성을 설치합니다: npm install 또는 yarn install
4. 애플리케이션을 실행합니다: npm start 또는 yarn start

## 프로젝트 구조

```
├── docs/                      # 문서
│   └── menu.md               # 메뉴 가이드 문서
├── public/                    # 정적 파일
├── src/                       # 소스 코드
│   ├── api/                  # API 관련
│   ├── asset/                # 이미지, 폰트 등 자산
│   ├── component/            # 재사용 컴포넌트
│   ├── hook/                 # Custom Hooks
│   ├── interface/            # TypeScript 인터페이스
│   ├── pages/                # 페이지 컴포넌트
│   ├── slice/                # Redux 슬라이스
│   ├── store/                # Redux 스토어
│   ├── style/                # 스타일 관련
│   ├── utils/                # 유틸리티 함수
│   ├── Layout.tsx            # 레이아웃 컴포넌트
│   ├── main.tsx              # 진입점
│   ├── Router.tsx            # 라우터 설정
│   ├── setupTests.ts         # 테스트 설정
│   └── vite.env.d.ts         # Vite 환경변수 타입
├── .env                      # 환경변수
├── .eslintrc.json           # ESLint 설정
├── .gitignore               # Git 무시 파일 목록
├── .prettierrc.cjs          # Prettier 설정
├── index.html               # HTML 템플릿
├── package.json             # 프로젝트 설정 및 의존성
├── postcss.config.cjs       # PostCSS 설정
├── README.md                # 프로젝트 문서
├── tailwind.config.cjs      # Tailwind CSS 설정
├── tsconfig.json            # TypeScript 설정
├── vercel.json             # Vercel 배포 설정
├── vite.config.ts          # Vite 설정
└── yarn.lock               # Yarn 의존성 잠금 파일
```

## 참고문서

- [제조가이드 토핑테이블 통신 API 문서](https://docs.google.com/spreadsheets/d/1xp7F-GrCEsXE-O7HRdqWsUhzf38kZ7fYXCZcFFxS9ew/edit?gid=1700799232#gid=1700799232)
- [메뉴 등록 가이드](./docs/menu.md)
- [태블릿 세팅 가이드](./docs/tablet-install.md)
