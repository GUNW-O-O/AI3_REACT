### JWT Spring Security
1. 테이블 생성
    - users         : 회원
    - user_auth     : 회원 권한

2. User 도메인 세팅
    - User.java
    - UserAuth.java
    - UserMapper.xml
    - UserMapper.java
    - UserService.java
    - UserServiceImpl.java

3. JWT 관련 프로세스
    - JWT 인증 필터 : JwtAuthenticationFIlter.java
    - JWT 요청 필터 : JwtRequestFilter.java


4.  Spring Security 설정
    - 폼기반 로그인 등 비활성화
    - JWT 필터 설정
        - JWT 인증 필터
        - JWT 요청 필터
    - 사용자 정의 인증 설정
    - 암호화 방식 빈등록 ( Bcrypt )

5. 엔드포인트 설정 (Controller)
    - /login : 로그인 인증 후, 💍 jwt 응답
    - /user  : 💍jwt 헤더 검증, 유저 정보 응답