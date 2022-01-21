---

layout: post
title: 딥러닝 공부 2일차

---

> 요즘 커피 의존증이 심해지는 듯

-----

# 2. Neural Network and Logistic Regression

## Derivatives

미분에 대해 잘 알지 못하더라도 직관적인 이해만 가능하면 얼마든지 딥러닝에 적용 가능하다. f(a) = 3a 라는 식이 있다 가정하자. 이때 a가 2라면 f(a)는 당연히 6일 것이다. 그렇다면 a를 2.0001이라 한다면 f(a)는 어떻게 될까.

이때 f(a)는 6.0003이 될 것이다. 실제 미분에서는 무한소와 같이 아주 작은 값을 넣어야 되지만 지금은 직관적인 이해를 돕기 위해 적당히 작은 수를 이용했다.

그렇다면 우리는 가로 축이 0.0001 만큼 변할 때, 세로 축은 0.0003만큼 변함을 알게 된다. 이때, a의 값을 얼마나 변화시키든 1:3이라는 비율이 바뀌지 않음을 알 수 있고 기울기는 늘 3이 됨을 알게 된다.

-----

## More Derivative Examples

앞서 이야기한 예제는 기울기가 3으로 일정한 직선이었다. 그렇다면 f(a) = a^2 인 식은 어떨까. 이러한 식의 경우에는 a 값에 따라 매번 기울기가 달라짐을 볼 수 있다.

a가 2일때, f(a)는 4가 된다. 그리고 a가 2.001이면, f(a)는 4.004가 된다. 그렇다면 a가 5일 때는 어떨까. a가 5일 때 f(a)는 25가 되고, a가 5.001일 때, f(a)는 25.01이 된다. 이처럼 2일 때와 5일 때, 변하는 비율이 달라짐을 알 수 있다. 즉, 곡선 위의 점은 그 기울기가 달라진다.

이외에도 다양한 공식을 미분 했을 때, 이러한 결과가 나옴을 알 수 있다. 그리고 우리가 기억할 것은 딱 아래 두 가지다.

1. 함수의 도함수는 함수의 기울기를 의미하며 함수의 기울기는 함수의 위치에 따라 다른 값을 가질 수 있다.
2. 그리고 함수의 도함수를 구하는 다양한 공식이 존재하니 이를 잘 이용하자.

-----

## Computation Graph

이전에 정방향 전파는 신경망의 출력값을 계산하고 역전파는 경사나 도함수를 계산한다고 했다. 이 이유를 이제부터 설명할 computation graph를 보면 쉽게 이해할 수 있다.

computation graph에 대한 설명에 앞서, J(a, b, c) = 3(a + b * c) 라는 cost function이 있다고 가정해보자. 이때 우리는 b * c = u 라는 식을 하나 만들 수 있고, a + u = v 라는 식 하나와 J = 3 * v라는 식, 이렇게 총 세 가지를 새롭게 만들 수 있다.

그렇다면 이를 하나의 그래프로 나타내면 어떨까.

![image](https://user-images.githubusercontent.com/62225673/150474469-6c09afda-4b67-4575-a89c-b96f619755f4.png)

위와 같은 형태의 그래프가 나옴을 알 수 있다. 그래프의 왼쪽부터 하나씩 계산을 하게 되면 자연스럽게 출력값이 나옴을 알 수 있다. 그리고 오른쪽부터 역산하게 되면 a와 b 그리고 c를 구할 수 있을 거라는 직감을 얻을 수 있다. 이에 관한 조금 더 자세한 내용은 다음 강의에 다룬다.

## Derivatives With Computation Graph

직전에 이야기 한 것처럼 이번엔 역산하는 과정을 보여보자. 우선 v에 대한 J의 도함수를 구해야 하는데 이는 간단히 3임을 알 수 있다. 이렇게 우리는 역전파의 한 단계를 끝냈다. 

그렇다면 a에 대한 J의 도함수는 어떻게 될까. 이전에 미분에 대해 공부하면서 0.001씩 아주 작게 더하는 방법이 있었다. 이를 a에 적용시켜보면 v의 값이 a의 값의 변화만큼 변한다는 것을 알 수 있고 v의 도함수가 3이었기 때문에 a의 도함수도 3이 됨을 알 수 있다. 

미적분에는 연쇄 법칙이라는 것이 있다. 이를 지금의 상황에 대입해서 설명을 해보겠다. a의 변화에 대한 v의 변화에 v의 변화에 대한 J의 변화를 곱한 것은 a의 변화에 대한 J의 변화와 동일하다. 미적분에서 이를 연쇄 법칙이라 부른다. 그리고 이를 통해 a에 대한 v의 도함수는 1임을 알 수 있다.

> 여담이지만 코드에서 이러한 최종 출력값 J에 대한 도함수를 나타낼 때, 편의를 위해 dvar이라고 변수명을 정한다. 여기서 var란 var의 변화에 대한 J의 도함수에서 var를 의미하며 dJ/da일 경우에 dvar는 da가 된다.

다시 본론으로 돌아와서 이번엔 du를 구하면 da와 같은 3임을 알 수 있다. 그렇다면 db는 얼마일까. 이를 위해서는 b의 변화량에 대한 u의 도함수를 알아야 하고 이는 c의 값이 2이기 때문에 2임을 알 수 있다. 따라서 우리는 db는 연쇄법칙에 의해 2 * 3이 되어 6임을 알게 된다. 그리고 dc는 3 * 3 = 9임을 쉽게 유추할 수 있다.

-----

## Logistic Regression Gradient Descent

이번엔 computation graph를 이용해 logistic regression의 gradient descent를 설명해보겠다. 

![image](https://user-images.githubusercontent.com/62225673/150477724-1c5fdbb1-fbcc-4c8f-b72b-a17415cb0b6b.png)

![image](https://user-images.githubusercontent.com/62225673/150477786-03eec018-25dc-4cb7-81ee-35bf1bfa72f4.png)

위와 같은 logistic regression이 있다 가정해보자. logistic regression이란 예측한 y값을 이용해 loss function을 줄이고 최종적으로 w와 b를 적절하게 조정하는 것이다. 그러면 이제 x가 2개의 feature를 가지고 있다 생각해보고 이를 computation graph로 나타내봤다.

역전파를 이용해 a에 대한 L의 도함수를 구해보자. L의 식은 위에 있기 때문에 이를 간단한 공식을 이용해 미분해보면 -(y/a) + ((1-y) * (1-a)) 가 됨을 알 수 있고 이것이 da가 된다.

![image](https://user-images.githubusercontent.com/62225673/150479010-59c262df-fe26-480f-af93-e35c14ce27ae.png)

이제 dz를 구해보고자 한다. dz =  dL/dz = dL(a, y)/dz = dL/da * da/dz 가 된다. 여기서 a는 z를 시그모이드 함수에 넣은 것이기 때문에 da/dz = a(1-a)가 된다. 그렇기 때문에 위에서 구한 도함수 식과 방금 구한 도함수 식을 곱하면 dz가 되고 이는 a - y가 된다. 

이제 역전파의 마지막 단계를 해보려고 하는데 이는 dw1, dw2, db를 구하는 것이다. 그리고 앞서 도함수 dz를 구했기 때문에 dw1 = dz * x1, dw2 = dz * x2, db = dz 임을 알 수 있다. 

- w1 := w1 - a * dw1
- w2 := w2 - a * dw2
- b := b - a * db

이것은 단일 샘플에 대한 gradient descent이다. 하지만 logistic regression은 단일 샘플이 아닌 m개의 훈련용 샘플을 가지고 있다. 이후에 이 m개의 샘플을 이용한 학습을 이야기해보겠다.

-----

## Gradient Descent on m Examples

> cost function J(W, b)은 loss function L에 대한 평균이다.

이를 통해 우리는 w에 대한 cost function J의 도함수가 m개의 데이터만큼 존재하는 dw의 합임을 알 수 있다. 아직까지는 아리까리한 부분이 있기 때문에 logistic regression의 gradient descent에 대해 처음부터 생각해보자.

![image](https://user-images.githubusercontent.com/62225673/150481518-ddf42584-7122-4e4e-9904-1b3b0a3942c8.png)

우선 J = 0, dw1 = 0, dw2 = 0, db = 0으로 초기화하자. 그리고 1부터 m까지의 훈련용 데이터에 대한 loss를 계산하고 이 과정에서 나온 결과물을 각각에 더해보자. 그러면 초기에 0으로 초기화했던 파라미터들은 다른 값으로 바뀌게 될 것이다. 모든 데이터를 다 더했다면 이제 m으로 나눠 평균을 구한다. 

dw1을 예로 들면, dw1 = dJ/dw1이 되었다. 그리고 각각의 파라미터는 아래와 같은 식을 가지게 된다.

- w1 := w1 - a * dw1
- w2 := w2 - a * dw2
- b := b - a * db

하지만 이런 방식에는 두 가지 약점이 존재한다. 

1. for문이 두 개 사용된다. 첫 번째 for문은 m개의 학습 데이터를 위해 사용되고 두 번째 for문은 데이터의 feature의 개수 n번 만큼 반복된다. 
2. ??? 분명 두 개라고 했는데 두 번째 이유는 안나온다. 뭐지.

이처럼 명시적인 for문의 사용은 딥러닝 알고리즘의 속도를 저하시킨다. 이를 해결하는 방법에는 벡터화가 있으며 이는 명시적인 for문을 제거해준다. 

-----

# 3. Python & Vectorization

## Vectorization

vectorization은 간단히 말해 코드에서 for문을 없에주는 방법이다. 이러한 방법이 필요한 이유는 딥러닝에서는 많은 데이터가 필요하고 이러한 데이터의 개수가 늘어남에 따라 계산 시간이 오래 걸리게 되기 때문이다.

python의 numpy에서는 np.dot(w, x)를 이용해 wT * x를 손쉽게 계산한다. 즉, z = np.dot(w, x) + b가 된다. 이를 python에서 직접 구현해 비교해보면 대략 300배 정도 차이가 생김을 확인 할 수 있다.

-----

## More Vectorization Examples

이번 주제는 python numpy에 있는 다양한 내장 함수를 이용해 vectorization하는 걸 보여준다. 

- u = np.exp(v): 행렬 v에 지수함수를 적용시킨 것으로 u = e ^ v가 된다.
- u = np.log(v): 마찬가지로 log를 적용시킨다.
- u = np.abs(v): 절대값을 알려준다.
- u = np.max(v, 0): 둘 중 큰 값을 반환한다.
- u = v ** 2: 모든 원소를 제곱한 값을 반환한다.
- u = 1 / v: 원소를 역수로 바꿔준다.

지금까지는 각 원소를 vectorization하여 계산하는 방법을 배웠지만 이후에 훈련 샘플에 대해서도 vectorization하는 방법을 배울 것이다.

-----

## Vectorization Logistic Regression

앞서 우리는 m개의 훈련 셈플을 vectorization하여 계산을 하자고 했다. 이는 z = wT * x + b에서 각 요소를 행렬로 여기며 계산하면 해결된다. 이를 python 코드로 표현하면 Z = np.dot(wT, X) + b 가 된다. 이때 b는 1*1 인 실수인데 이러한 연산을 취해주면 자동으로 1 * m 행렬로 바꿔준다. 이를 python에서는 broadcasting 이라고 한다.

그렇다면 z에 시그모이드 함수를 적용한 형태인 a는 어떻게 vectorization 하게 구할 수 있을까. 이는 이후 백터 값을 가지는 시그모이드 함수를 구현하여 해결하도록 하자. 여기까지 정방향 전파의 계산을 vectorization 하는 방법을 알아봤다. 이후에 역전파에 대한 vectorization을 알아보도록 하자.

-----

## Vectorizing Logistic Regression's Gradient Computation

dz_1 = a_1 - y_1 이고 dZ = [dz_1, dz_2, ... dz_m], A = [a_1, a_2, ... a_m], Y = [y_1, y_2, ... y_m] 이라 하자. 이때, dZ = A - Y = [a_1 - y_1, a_2 - y_2, ... a_m - y_m] 이 되고, 이는 처음에 정의한 식의 반복임을 알 수 있다.

우리는 vectorization을 배우기 전, dw = x * dz 이고 db = dz 임을 알게 되었다. 그렇다면 간단한 db부터 vectorization 해보자.

- db = 1/m * np.sum(dZ)
- dw = 1/m(X * dZ)

이제 여태까지 배운 것을 합쳐 logistic regression의 구현을 vectorization 하게 해보자.

- Z = wT * X + b = np.dot(wT, x) + b
- A = 시그모이드 함수(Z)
- dZ = A - Y
- dw = 1/m * X *dZT
- db = 1/m * np.sum(dZ)
- w = w - learning rate * dw
- b = b - learing rate * db

이제 이러한 gradient descent를 여러 번 반복하고 싶다면 위 코드를 원하는 횟수만큼 반복하면 된다.

