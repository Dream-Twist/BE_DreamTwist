# 🐛 꿈틀 Dream Twist

-   AI 기반 동화 제작 서비스

## 프로젝트 구성 안내

## 1. 프로젝트 소개

-   프로젝트 주제 : 아이들의 창의성과 상상력을 키우기 위한 AI 기반 디지털 맞춤형 동화 제작 웹 서비스
-   기술 스택

<table>
  <tr>
    <td>&nbsp;</td>
    <td>기술</td>
  </tr>
  <tr>
    <td>프론트엔드</td>
    <td> 
        <img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"/>
        <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"/>
        <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/>
        <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=Tailwind CSS&logoColor=white"/>
    </td>
  </tr>
  <tr>
    <td>백엔드</td>
    <td>
        <img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"/>
        <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>
        <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white"/>
        <img src="https://img.shields.io/badge/TypeORM-FE0803?style=flat-square&logo=TypeORM&logoColor=white"/>
        <img src="https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=Swagger&logoColor=white"/>
        <img src="https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=Postman&logoColor=white"/>
    </td>
  </tr>
  <tr>
    <td>AI</td>
    <td>
        <img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white" />
        <img src="https://img.shields.io/badge/Jupyter-F37626?style=flat&logo=jupyter&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td>DB</td>
    <td>
        <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white" />
        <img src="https://img.shields.io/badge/AWS RDS-527FFF?style=flat&logo=amazonrds&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td>배포</td>
    <td> 
        <img src="https://img.shields.io/badge/AWS EC2-FF9900?style=flat&logo=amazonec2&logoColor=white" /> 
        <img src="https://img.shields.io/badge/NGINX-009639?style=flat&logo=nginx&logoColor=white" /> 
        <img src="https://img.shields.io/badge/PM2-2B037A?style=flat&logo=pm2&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td>협업툴</td>
    <td> 
        <a href = "https://www.notion.so/UrbanOasis-1c60ad804a404c90be8f61756057e46c#8146753b80b24b9f9dfa73e39b5aa77a">
            <img src="https://img.shields.io/badge/Notion-FFFFFF?style=flat&logo=notion&logoColor=black" /> 
        </a>
        <img src="https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white" />
        <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat&logo=figma&logoColor=white" /> 
        <img src="https://img.shields.io/badge/Gitlab-FC6D26?style=flat&logo=gitlab&logoColor=white" />
    </td>
  </tr>
</table>

## 2. 프로젝트 목표

-   동화는 아이들의 창의성과 상상력을 키우는 데 중요한 역할을 한다. 최근 디지털 시대에 맞춰 온라인 도서 플랫폼의 수요가 증가하고 있으며, 이에 따라 다양한 형태의 디지털 도서 및 동화 콘텐츠가 제공되고 있다.
-   그러나 단순히 기존 동화를 디지털화하는 것보다는 사용자 참여형 동화 창작 플랫폼이 더 효과적이라는 결론을 내렸다. 이는 아이들과 성인 모두에게 창의적 표현의 기회를 제공하고, 협업을 통한 학습 효과를 높일 수 있기 때문이다.
-   특히, 동화 창작의 질을 높이기 위해 AI 기술의 활용에 주목하였고, AI와 인간의 협업을 통한 동화 창작이 중요하다고 판단하였다. 이를 위해 AI 지원 스토리 생성, 이미지 생성이 필요하다고 생각한다.
-   이에 AI 기반 맞춤형 동화 생성 플랫폼인 ‘꿈틀’을 통해 AI 지원 동화 창작, 멀티미디어 동화 제작 등의 서비스를 제공하여, 최종적으로 창의적 동화 창작 문화를 조성하고 디지털 시대의 새로운 문학 경험을 제공하고자 한다.

## 3. 프로젝트 기능 설명

**웹서비스의 유용성, 편의성 및 실용성에 대한 설명**

-   주요 기능 (주된 활용성) 및 서브 기능

    > **동화 기능**

    - **동화 스토리 생성**

        - **사용자가 직접 생성**

            - **직접 줄거리 생성**

                - **금지어 설정**

                    _사용자가 동화 직접 입력하는 경우, 금지어 설정_

            - **직접 이미지 생성**

            - **동화 이미지 업로드 기능**
        
            - **그림판 기능**
            
        _중간 저장 기능_

    - **AI 생성**

        _키워드 또는 문장 입력 시_

        - **AI가 동화 모든 내용 생성**

        - **AI가 동화 일부분 내용만 생성**
            
            _사용자가 나머지 내용을 창의성을 발휘해서 작성_
        
        - **AI가 주제 또는 제목만 추천**

        - **AI 이미지 생성**

        _중간 저장 기능_

        _동화 생성 완료 후, 공개 유무 선택_



    - **동화 공유 게시판**

        - **동화 조회수 및 정렬 기능**



    - **동화 상세 게시판**

        - **좋아요 기능**

        - **댓글 기능**



    > **동화 외 기능**
        
    - **회원**

        - **회원가입 및 로그인**

            - 소셜 회원가입 및 로그인
                
                - 구글
    
        - **마이페이지**
    
            - **회원정보 수정**
    
            - **프로필 이미지**
    
            - **회원탈퇴**
    
            - **로그아웃**
    
        - **나의 활동**
            
            - 나의 동화

            - 나의 댓글

            - 나의 좋아요

            - 나의 결제 내역

    - **결제 기능**
    
        - 포인트

            - 가입 포인트
        
            - 포인트 충전 형식
    
                - 간편 결제: [토스페이먼츠](https://www.tosspayments.com/)
        
            - 환불 기능

-   프로젝트만의 차별점, 기대 효과

    - 발표 차후 맘카페에 사이트를 홍보하여 더욱 많은 아이들의 참여와 전반적 유저 확장에 힘쓰고자 한다.

    - 추가로 학교, 교육업계, 출판업계에 서비스를 제공하여 AI 기반 제작 플랫폼의 영향력을 더욱 펼치고자 한다.

## 4. 프로젝트 구성도

-   [정보구조도 IA - Miro](https://miro.com/app/board/uXjVKxtN1EY=/)

-   [플로우차트 - Miro](https://miro.com/app/board/uXjVKxtN1EY=/)

-   [와이어프레임, 스토리보드](https://www.figma.com/design/EKyJtBhALfgNG5ER5EZ06U/%ED%85%9C%ED%94%8C%EB%A6%BF?node-id=0-1&t=QGnAZrg5JL0Mo28S-1)

-   [ERD - DBdiagram.io](https://dbdiagram.io/d/DreamTwist-6698be188b4bb5230eab0f64)

## 5. 프로젝트 팀원 역할 분담

| 이름   | 담당 업무                               |
| ------ | --------------------------------------- |
| 박수정 | 팀장/백엔드 개발/동화 스토리 직접 생성/금지어 크롤링 및 설정/동화 이미지 업로드/회원 기능/PPT 작성 및 발표 |
| 강민규 | 백엔드 개발/동화 스토리 조회,수정,삭제/동화 좋아요,동화 조회수/전체 동화 정렬/동화 검색 기능 |
| 원경혜 | 백엔드 개발/AI 학습/동화 생성 모델 학습 및 api 작성/프롬프트 번역 및 이미지 생성/이미지 생성 AI api 연동/댓글 생성,조회,수정,삭제 |
| 이유민 | 백엔드 개발/ AI 학습/동화 생성 모델 학습 및 api 작성/주제 및 제목 생성/동화 생성 AI api 연동/결제 및 포인트 기능/백엔드, AI 배포                   |
| 임도헌 | 프론트엔드 개발/동화 생성 기능/동화 편집 기능/그림판 기능/프론트엔드 배포 |
| 나경윤 | 프론트엔드 개발/동화 검색/동화 게시판 및 동화 삭제/회원 기능/댓글 생성,조회,수정,삭제 |
| 김민규 | 프론트엔드 개발/AI 학습/동화 AI 생성 기능/결제 및 포인트 기능 |

**멤버별 responsibility**

1. 팀장

-   기획 단계: 구체적인 설계와 지표에 따른 프로젝트 제안서 작성
-   개발 단계: 팀원간의 일정 등 조율 + 백엔드 개발
-   수정 단계: 기획, 스크럼 진행, 코치님 피드백 반영해서 수정, 발표 준비

2. 프론트엔드

-   기획 단계: 큰 주제에서 문제 해결 아이디어 도출, 와이어프레임 작성
-   개발 단계: 와이어프레임을 기반으로 구현, 시각화 담당, UI 디자인 완성
-   수정 단계: 피드백 반영해서 프론트 디자인 수정

3.  백엔드 & AI 담당

-   기획 단계: 기획 AI 모델을 통해 해결하고자 하는 문제를 정의
-   개발 단계: 웹 서버 사용자가 직접 백엔드에 저장할수 있는 기능 구현, 데이터 베이스 구축 및 API 활용, AI 실전 개념 총동원하기
-   수정 단계: 코치님 피드백 반영해서 분석/ AI 학습 방식 수정

## 6. 버전

-   프로젝트의 버전 기입

## 7. FAQ

-   자주 받는 질문 정리
