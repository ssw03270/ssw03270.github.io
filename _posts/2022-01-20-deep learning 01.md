---

layout: post
title: 딥러닝 공부 1일차

---

> 한글의 소중함을 깨달음

-----

# 1. Introduction

## What is Neural Network

우리가 집값 예측을 하는 인공지능을 만든다고 생각해보자. 필요한 입력값은 뭐가 있을까. 우선 집의 크기와 침실의 개수가 있을 것이다. 그리고 우편번호가 있고 동네의 재력에 관한 부분도 있을 것이다. 

앞의 두 입력값을 통해 우리는 몇인 가구가 살 집인지 짐작할 수 있다. 그리고 우편번호를 통해 산책하기 괜찮은지를 알 수 있고 이를 재력과 합해 인근 학교의 우수한 정도를 알 수 있다.

그러나 딥러닝에서는 모든 입력값이 모든 유닛으로 연결된다. 이때 이 유닛을 은닉 유닛이라 부르고 이 유닛들이 모여서 만든 값이 결과값인 y가 된다. 즉, 충분하고 적합한 입력값을 준다면 이러한 과정을 통해 결과값을 잘 도출할 수 있다.

여담으로 이러한 유닛에는 ReLU와 같은 다양한 활성 함수가 자리 잡아 적합한 값을 만들어준다.

-----

## Supervised Learning with a Neural Network

지도 학습은 일상 생활 속 다양한 부분에서 쓰인다. 앞서 이야기한 집값 문제와 광고 알고리즘 문제는 일반적인 Neural Network를 통해 해결 가능하다. 그리고 Computer Vision은 주로 CNN이라고 부르는 합성곱 신경망이 쓰인다. 그리고 시간의 흐름에 따라 재생되는 음성과 글자에 순서가 있는 번역 등은 1차원의 시계열로 되어있는 시퀀스 데이터이며 이들은 RNN을 통해 학습이 진행된다. 

데이터의 종류는 크게 구조적 데이터와 비구조적 데이터로 이루어져 있다. 

- 구조적 데이터: 데이터베이스로 표현된 데이터 (사용자 나이, 침실 개수와 같이 열로 나타내는 것이 가능한 특징들)
- 비구조적 데이터: 음성 파일이나 인식하고자 하는 이미지 혹은 텍스트 데이터를 의미

본래 이러한 비구조적 데이터를 컴퓨터가 해석하는 것은 어려운 일이지만, 딥러닝의 등장으로 비교적 쉽게 해석 가능해졌다.

-----

## Why is deep learning taking off

딥러닝의 급부상에는 세 가지 요인이 있다.

- 데이터 양 증가
- 컴퓨터 성능 향상
- 알고리즘 개선

앞의 두 개는 너무나도 당연한 이야기니 마지막 알고리즘 개선의 예시를 들어보겠다. 과거 딥러닝에서 활성함수로 시그모이드 함수를 사용했으나 현재에 와서는 ReLU 함수를 많이 사용한다. 

이는 경사하강법 때문인데 시그모이드 함수의 경우, 기울기가 0으로 수렴하는 부분에서 학습이 느려진다는 문제점이 있다. 그러나 ReLU는 양수일 때 1의 기울기를 가지기 때문에 이러한 문제에 빠지지 않는다. 

조금 더 수학적으로 접근하면 시그모이드 함수의 경우 미부한 값을 그래프로 나타냈을 때, 정규분포한 그래프의 형태가 나타난다. 즉, 양 끝단의 값이 매우 작아진다. 하지만 ReLU의 경우, 양수에 한해 미분 값이 1을 가지게 된다.

-----

# 2. Neural Network and Logistic Regression

## Binary Classification

고양이 사진을 보고 이것이 고양이인지, 아닌지를 판별하는 것을 분류라고 한다. 사람은 이를 손쉽게 할 수 있지만 기계는 이를 학습하는 과정을 통해 가능하게 해줘야 한다. 이때, 기계를 학습하기 위해서는 input이 필요한데 지금의 경우에는 고양이 사진이 필요할 것이다.

사진은 R, G, B라는 세 가지 픽셀 값을 가진다. 사진의 크기를 약 64 * 64라고 가정해보자. 그렇다면 우리는 R이라는 64 * 64 행렬과 G라는 64 * 64 행렬 그리고 B라는 64 * 64 행렬을 가지게 된다. 이를 컴퓨터에 저장을 한다면 아주 긴 벡터에 이를 순서대로 나열하게 될 것이다. 이는 12288개가 될 것이고 이는 벡터의 차원 수 n이 된다.

그렇다면 우리에게 고양이 사진이 무수히 많다고 가정해보자. 이는 우리가 고양이인지 아닌지 판별하는데 학습할 데이터가 될 것이다. 이 데이터는 총 m개가 있다고 해보자.

입력값인 x는 총 n개의 특성값을 가질 것이다. 출력값인 y는 고양이 여부이니 0 혹은 1이 된다. 훈련 데이터는 m개가 되고 이를 행렬 X로 나타내면 n * m 크기의 행렬이 만들어질 것이다.쉽게 생각하면 앞서 만든 긴 한 줄 짜리 행렬이 m개 생겼다고 생각하면 된다.

-----

## Logistic Regression

x를 고양이 사진으로 만들어진 input 데이터, y를 주어진 사진이 고양이 일 확률이라 가정하자. 따라서 x는 n차원의 벡터이며 y는 0과 1의 값을 가진다.

추가로 파라미터 w와 b를 만들었다. w와 x는 동일한 차원수를 가지며 b는 실수다. 이때 식을 나타내면 y = w의 전치 행렬 * x + b가 될 것이다. 

선형 회귀를 하는 것이 목적이라면 이 식을 선택할 것이다. 그러나 우리가 하려는 것은 이진 분류고 이를 위해서는 y의 값이 0과 1 사이의 확률이어야 한다.

하지만 로지스틱 회귀에서 y의 예측값은 시그모이드 함수를 통해 도출된다. 따라서 위 식의 값을 시그모이드 함수에 넣어주면 우리가 원하는 0과 1사이의 값을 얻을 수 있다. 

다음 강의에서 w와 b를 정의하기 위해 cost 함수에 대해 알아보겠다.

-----

## Logistic Regression Cost Function

파라미터 w와 b를 학습시키기 위해서는 cost 함수가 필요하다. 이때 예측된 y와 실제 y 사이의 제곱 오차의 절반으로 loss function을 사용하기도 하지만 logistic regression에서 사용하지는 않는다. 왜냐하면 이러한 방법은 optimization function이 여러 개의 극점을 가지게 만들고 이는 경사 하강법이 최적의 정답을 찾는데 방해를 한다. 

따라서 optimiziation function이 볼록한 형태를 취하는 cost function을 정의해야 한다. logistic regression에서 주로 사용하는 cost function은 아래와 같다

- -(y * log(예측한 y) + (1 - y) * log(1 - 예측한 y))

만약 제곱 오차 절반의 값을 이용해 optimization을 한다면 그 오차를 최소화하려고 할 것이다. 마찬가지로 우리는 위 식을 최소화해야 한다. 

이는 두 가지 관점에서 바라볼 수 있다.

1. y = 1, -log(예측한 y)만 남게 되고 시그모이드 함수가 들어가기 때문에 우리는 예측한 y가 가능한 커지길 바란다. 
2. y = 0, -log(1-예측한 y)만 남게 되고 시그모이드 함수가 들어가기 때문에 우리는 예측한 y가 가능한 작아지길 바란다.

추가로 우리는 m개의 훈련 데이터가 있고 따라서 loss function을 통해 나온 값 m개에 대한 평균인 비용 함수 J를 만들어야 한다. 따라서 logistic regression 모델을 학습한다는 것은 방금 이야기한 cost function J를 최소화하는 w와 b를 찾는 것이다. 

-----

## Gradient Descent

앞서 우리는 cost function J를 최소화하는 w와 b를 찾아야 한다고 이야기했다. 예를 들어, w와 b가 각각 가로와 세로 축이고 높이는 J인 3차원 그래프가 있다고 가정하자. 그렇다면 그래프는 마치 공이 들어있는 천을 네 방향에서 붙잡은 형태를 취할 것이다. 여기서 가장 최하단에 해당하는 J를 w와 b를 이용해 찾는 것이 우리의 과제이자 gradient descent이다. 

우리는 w와 b의 초기값을 설정해야 하는데 일반적으로 logistic regression에서는 무작위 값이 아닌 0으로 설정한다. 하지만 위의 cost function은 여러 개의 극점을 가지고 있지 않으며 아래로 볼록하기 때문에 사실 무얼 초기값으로 삼아도 똑같다. 

gradient descent에 대한 설명이 없었는데 이는 초기점에서 시작해 가장 경사가 가파른 내리막으로 나아가는 것이다. 이를 반복하다보면 전역 최적값이나 그 근사치에 도달하게 된다.

> := 이 기호는 값을 갱신한다는 뜻이다

여하튼 b 값을 무시하고 단순히 2차원 그래프로 나타내면 gradient descent는 w := w - a * dJ / dw 가 된다. 여기서 a는 learning rate로 추후에 이야기하고 뒷편의 미붑계수에 대해 더 자세히 짚어보려고 한다. (관습적으로 코딩을 할 때 dJ / dw의 변수명을 편하게 dw라고 쓴다)

미분계수는 J의 기울기에 접하는 삼각형의 세로/가로에 해당한다. (그냥 기울기다) 따라서 미분계수와 learning rate를 곱한 값을 빼면서 점차 극점으로 나아가게 된다. 

- w := w - a * dJ(w, b)/dw
- b := b - a * dJ(w, b)/db

여담이지만 미분하는 변수가 하나라면 단순히 d를 적으면 되지만 그렇지 않다면 편미분 기호 (d의 다른 폰트 형태)를 사용해 표기해야 한다.