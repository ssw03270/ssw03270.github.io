---

layout: post
title: 그래픽스 파이프라인

---

> 왕복 14시간 이동 이후 출근은 할 게 못된다

-----

# Graphics Pipeline

![image](https://user-images.githubusercontent.com/62225673/150725498-e8c118c2-8564-4cb9-be1b-c92bdcc1118b.png)

## Vertex Shader

gpu에 저장된 어떠한 polygon mesh의 vertex를 vertex mesh에 저장한다. 그리고 vertex shader는 이를 한 번에 하나씩 불러와 좌표계를 변환하는 연산을 수행한다. 이는 object space로 저장된 vertex의 정보를 사용자가 보게 될 화면에 띄우기 위한 작업이다.

vertex shader의 단계에서 진행하는 작업은 아래와 같다

- World Transform: object space -> world space
- View Transform: world space -> camera space
- Projection Transform: camera space -> clip space

좌표계 변환이 끝나면 vertex shader는 index array에 삼각형을 기록한다.

-----

## Rasterizer

rasterizer는 vertex shader로부터 전달 받은 indexc array를 이용해 각 도형을 픽셀로 변경한다. 이때 vertex 사이에 빈 공간이 생기는데 이는 보간을 통해 적절하게 픽셀을 그린다. 

이외에도 카메라에 보이지 않는 부분을 자르는 clipping 작업이나 polygon의 후면 부분을 지워주는 back face culling 등의 작업도 있다.

-----

## Fragment Shader

fragment shader는 rasterize 된 픽셀들의 색상을 결정하는 단계다. 단순히 색을 정하는 것 뿐만 아니라, 빛이 그림자, 반사광 등에 의한 색 정보 또한 이 과정에서 결정된다. 