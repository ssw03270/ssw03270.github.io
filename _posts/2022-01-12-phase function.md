---

layout: post
title: Phase-Functioned Neural Networks for Character Control

---

> 계단 논문에 관한 공부를 위해 읽게 된 논문이다. 발의 위상에 집중하며 지형과 관절의 위치에 기반하여 자동으로 애니메이션을 합성한다. 이에 관한 정리를 나름대로 해보려고 한다.

-----

# DATA ACQUISITION & PROCESSING

각 데이터 수집과 처리 과정에 대한 설명이다.

## Motion Capture and Control Parameters 

Animation을 합성하기에 앞서, Motion Data를 촬영해야 한다.
그리고 이를 이용해 PFNN을 합성한다.

Motion Data
* Phase of The Motion
* Semantic Labels of The Gait
* The Trajectory of The Gait
* Height Infromation of The Terrain Along The Trajectory

대략 이러한 데이터가 필요하다.
처음에 gait와 phase의 차이점이 궁금했다.

### Gait

gait는 binary vector로 표현되는 자료다.
gait가 필요한 첫 번째 이유는 빨리 걷기와 느린 조깅과 같이 언뜻 보면 유사한 것의 구별을 하기 위함이다.
그리고 두 번째는 특정 시나리오에서 특정 모션을 보여주기 위함이다.
특정 모션이라 하면, 걷기, 뛰기, 점프 등이 있다.

### Phase

phase는 0에서 2π까지의 범위를 가진다.
오른발이 땅에 닿을 때, phase는 0이다.
왼발이 땅에 닿을 때, phase는 π이다.
다시 오른발이 땅에 닿으면, phase는 2π가 된다.

### Trajectory and Terrain Height

논문을 읽다 보면, 좌표계의 중심이 되는 'root transformation'이 많이 나온다. 
이는 고관절의 중심을 투영함으로써 추출된다.
그리고 고관절 중심의 벡터와 어깨 관절 사이의 벡터를 평균화하고 위쪽 방향으로 교차곱을 하여 'facing direction'을 얻는다.

그리고 지형의 높이 같은 경우에는 캐릭터 중심과 좌우 25cm 떨어진 위치에서 계산된다.
이를 통해 지형이 캐릭터의 운동(animation)에 맞춰지는데 이는 나중에 다시 나온다. (fitting process)

## Terrain Fitting

앞서 이야기했듯이 캐릭터의 움직임에 맞춰, 적합한 지형을 만들어낼 필요가 있다.
그러나 Motion Caputre를 통해 사람의 움직임과 지형을 동시에 촬영하는 것은 어렵다.
따라서 가상의 환경 (Game, or Other Virtual Environment) 등을 추출하여 Heightmap을 만들어낸다. 

이러한 과정을 통해 3x3 크기의 지형 20,000개를 얻게 된다.
그리고 이를 무작위 위치로 샘플링한다.

이렇게 구해진 지형 중에서 Brute-Force 방법을 통해 Error Function을 최소화하는 10개의 지형을 찾는다.
이를 메시 편집 기술 중 하나인 Radial Basis Function을 이용하여 접촉 시간 동안 캐릭터의 발과 땅이 정확하게 맞닿도록 지형을 편집한다.

아래는 위에서 언급한 Error Function이다.

![image](https://user-images.githubusercontent.com/62225673/148991358-0dbfbeb9-d8fd-4fa3-be08-0ac6f610455c.png)

![image](https://user-images.githubusercontent.com/62225673/148990011-c7f27696-fad2-4084-93ec-2fd79ce1646b.png)

Terrain Fitting을 위한 Error Function이다.
세 개의 항으로 구성되어 있으며, 각각에 대한 설명을 해보려고 한다.

![image](https://user-images.githubusercontent.com/62225673/148990528-7777a5cb-0e20-4eca-b23d-f53d46c4108e.png)

첫 번째 항은 발과 지형 사이의 접촉을 보장한다. 

![image](https://user-images.githubusercontent.com/62225673/148990584-66daf8b3-2be4-44ee-babf-d2b6ce7a1652.png)

두 번째 항은 발이 항상 지형 위에 있음을 보장한다.

![image](https://user-images.githubusercontent.com/62225673/148990669-6a15ba25-5407-4520-9a57-f19531281b12.png)

마지막 항은 캐릭터가 점프를 하려고 할 때만 활성화된다.
Terrain의 높이가 l보다 커지면 이에 해당하는데 l은 논문에서 30cm로 설정되어 있다.
이를 통해 큰 장애물에서는 큰 점프를 하고, 작은 장애물에서는 부드럽게 넘어간다.

# PHASE-FUNCTIONED NEURAL NETWORK

앞서 이야기했듯이, Phase Function은 발의 위상에 기반하여 캐릭터의 애니메이션을 생성한다.
이 Phase Function은 Network의 weight를 생성하는데 Catmull-Rom Splines 함수를 통해 가능하다.
이에 관한 자세한 설명은 뒤에서 다시 하겠다.

## Neural Network Structure

![image](https://user-images.githubusercontent.com/62225673/148992770-c0d418b6-be35-403e-bf0d-e2527b861773.png)

![image](https://user-images.githubusercontent.com/62225673/148993300-f8ef2fed-5245-4977-9e03-b992a6dc0f27.png)

활성함수 ELU는 지수함수를 이용하여 입력이 0 이하일 경우, 부드럽게 깍아준다.
α는 Network의 weight다. weight에 대해서는 뒤에서 더 자세히 다루겠다.

![image](https://user-images.githubusercontent.com/62225673/148993060-320cdf16-c35d-4fab-bcd8-d99c38780225.png)

h는 hidden unit의 개수이며 512개로 설정되어 있다. 

## Phase Function

![image](https://user-images.githubusercontent.com/62225673/148993795-1e212e2d-ec98-451c-bb90-b06bb5bf565b.png)

αk와 α의 구분이 중요하다.
αk는 α의 구성 요소로 0~3까지 총 4개가 존재한다. 
각 αk값을 통해 α를 계산하며 이 과정은 아래를 통해 알 수 있다.
이렇게 가중치 α를 구하는 방법으로 Catmull-Rom Splines 함수가 쓰인다.
아래 식의 결과가 α다.

## Training

![image](https://user-images.githubusercontent.com/62225673/148994182-ba930a81-51bd-45e6-accb-567b132f399d.png)

위는 PFNN의 Cost Function이다.
Cost Function은 두 개의 항으로 이뤄져있다.

첫 번째 항은 regression 결과의 mean square error를 의미한다.
두 번째 항은 가중치가 너무 커지는 것을 방지해주는 추가적인 가중치 γ가 이용되는데 이는 0.01로 설정된다.

추가로 Stochastic Gradient Descent가 사용되어 자동으로 Cost Function을 계산한다.

![image](https://user-images.githubusercontent.com/62225673/148995009-4a28ec1b-ff37-4764-b019-1e97e4a0d82b.png)

마지막으로 위는 input과 output에 쓰이는 parameter다.

# EVALUATION

추가적으로 다른 Network와 PFNN을 비교하면서 마치겠다.

![image](https://user-images.githubusercontent.com/62225673/148995256-46e96370-622e-4937-b4d1-61eb4ac36f4a.png)

다양한 경우의 Network와 비교했다.
이때, Phase를 추가적인 input으로 줬을 때는 부자연스럽고 딱딱한 결과가 나온다.
이는 다른 parameter의 영향이 커지거나 phase의 영향이 작아지면서 생기는 문제였다.
이처럼 단순히 phase를 추가적인 input으로 줬을 때보다 phase function을 따로 줬을 때, 영향력이 50배 정도 차이난다고 한다.

Phase Function으로 Gaussian Process로 대체할 경우 유사한 효과를 보인다.
그러나 많은 데이터로부터 배우는 것이 불가능하기 때문에 결과적으로 좋지 못하다.
그리고 overfitting을 피하기 어렵다.

# Appendix

아직도 감이 안 오는 부분이 하나 있다.
뒤로 갈수록 'dying out'이라는 말이 나온다.
이거 누가 좀 대가리에 박아주면 고마울 거 같다.

빠진 부분이 많긴 한데, 넘 졸려서 그만 써야겠다.
낼도 출근해야 되니...