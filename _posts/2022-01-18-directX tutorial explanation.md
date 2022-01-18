---

layout: post
title: DirectX Tutorial Explanation

---

> 참고 영상: https://www.youtube.com/watch?v=NTvhVxSC_80

-----

# DirectX Tutorial Explanation

## Tutorial 02

> This application displays a triangle using Direct3D 11

## 1. Peek Message & Get message

Peek Message 함수는 Message 가 있을 경우에는 true 를 반환하고, 그렇지 않을 경우에는 false 를 반환한다.

그러나 Get Message 함수의 경우에는 Message 가 없을 경우, Message 가 생길 때까지 기다린다. 

사용자가 입력을 주기 전까지 가만히 있는 게임을 사람들이 원하지는 않는다. 즉, 게임의 경우에는 Peek Message 를 사용해야 한다.

    // Main message loop
    MSG msg = {0};
    while( WM_QUIT != msg.message )
    {
        // peek -> 쓱 본다. 메시지가 있나 없나. 메시지가 없더라도 block에 걸리지 않는다.
        // get -> 가져온다. 메시지가 있으면 가져오고, 없으면 block
        if( PeekMessage( &msg, nullptr, 0, 0, PM_REMOVE ) )     // 메시지가 있냐?
        {
            TranslateMessage( &msg );
            DispatchMessage( &msg );
        }
        else                                                    // 메시지가 없냐?
        {
            Render();
        }
    }

Quit Message가 들어오지 않는 동안, 게임 Loop는 계속 돌아간다.

## 2. Macro

몇 가지 Macro 함수가 있다. 

    if( FAILED( InitWindow( hInstance, nCmdShow ) ) )
        return 0;

    if( FAILED( InitDevice() ) )
    {
        CleanupDevice();
        return 0;
    }

위 코드를 보면 FAILED 라는 Macro 함수가 있다. 

이는 내부에서 실행된 값이 무엇이냐에 따라 실행되며, 위 코드의 경우에는 FAILED 가 통과되면 프로그램이 종료된다. 

추가로 FAILED의 파라메터는 HRESULT다.

## 3. Device

Device는 DirectX의 몸체라고 생각하면 된다. Device에 관한 다양한 함수가 있다.

### InitDevice()

    HRESULT InitDevice()

InitDevice() 함수의 경우에는 Device의 초기값을 설정하는 함수다.
반환 값은 위에도 나왔던 HRESULT다.

    RECT rc;
    GetClientRect( g_hWnd, &rc );
    UINT width = rc.right - rc.left;
    UINT height = rc.bottom - rc.top;

InitDevice() 함수를 보면 이런 방법을 이용해 윈도우 사이즈를 rc 라는 변수에 저장한다.

좌표계는 좌상단 기준이다.

        UINT createDeviceFlags = 0;
    #ifdef _DEBUG
        createDeviceFlags |= D3D11_CREATE_DEVICE_DEBUG;

이는 DirectX를 Debug 모드로 바꾸겠다는 뜻이다. 게임을 개발 할 때, 문제점을 찾기 위해 사용한다고 함.

    D3D_DRIVER_TYPE driverTypes[] =
    {
        D3D_DRIVER_TYPE_HARDWARE,
        D3D_DRIVER_TYPE_WARP,
        D3D_DRIVER_TYPE_REFERENCE,
    };

REFERENCE 는 100 퍼센트 소프트웨어 기반으로 작동하는 Driver Type 이다. 
즉, 매우 느리다. 
그러나 GPU 가 없는 장치에서도 돌아간다. 

WARP 같은 경우에는 CPU 기반으로 돌아가는 놈이다.

HARDWARE의 경우에는 100 퍼센트 GPU 기반으로 돌아가는 놈으로 당연히 제일 빠르다.

    D3D_FEATURE_LEVEL featureLevels[] =
    {
        D3D_FEATURE_LEVEL_11_1,
        D3D_FEATURE_LEVEL_11_0,
        D3D_FEATURE_LEVEL_10_1,
        D3D_FEATURE_LEVEL_10_0,
    };

이는 feature level 을 검사하기 위함 친구다. 
최우선 적으로 11.1 이 있는지를 확인하고 순차적으로 낮은 단계의 level 을 찾는다.

> ??? : 이것도 없어...? 그럼 이거는... 어? 이것도 없네.

### SwapChain

    DXGI_SWAP_CHAIN_DESC1 sd = {};
    sd.Width = width;
    sd.Height = height;
    sd.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
    sd.SampleDesc.Count = 1;
    sd.SampleDesc.Quality = 0;
    sd.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
    sd.BufferCount = 1;

Swap Chain 이란 사용자에게 프레임을 표시하기 위한 버퍼 컬렉션이다. 
새 프레임을 표시 하려고 할 때마다, Sawp Chain 의 첫 번째 버퍼가 화면에 표시된 버퍼를 대신한다.
이러한 프로세스를 교환 혹은 대칭 이동이라 한다.

### RenderTargetView

    // Create a render target view
    ID3D11Texture2D* pBackBuffer = nullptr;
    hr = g_pSwapChain->GetBuffer( 0, __uuidof( ID3D11Texture2D ), reinterpret_cast<void**>( &pBackBuffer ) );
    if( FAILED( hr ) )
        return hr;

화면에 texture를 그리기 위해서는 render target view, 읽으려고 한다면 shader resource view 를 이용한다고 한다. 

이 이야기를 한 이유는, 위에서 Swap Chain 이 가지고 있는 buffer를 가지고 오는데 이는 back buffer 다. 
이 buffer 에는 기본 texture 가 들어 있는데 이것의 type 은 ID3D11Texture2D 이다.
이제 이를 담아서 hr 에 전달하고 실패하면 탈출한다.

이외에도 hr 에 관한 부분이 많은데 너무 많으니 몇 개는 패스.

나머지는 내일...

    hr = g_pd3dDevice->CreateRenderTargetView( pBackBuffer, nullptr, &g_pRenderTargetView );
    pBackBuffer->Release();
    if( FAILED( hr ) )
        return hr;

위의 코드에서 이야기한 pBackBuffer를 SwapChain으로부터 얻어와 원천으로 하여 넣어준다. 
그리고 이를 넣어주는 곳이 마지막 파라메터가 뜻하는 ID3D11RenderTargetView가 된다. 

코드를 자세히 살펴보면 BackBuffer를 바로 해제하려는 것을 확인 할 수 있다.
이는 해당 변수에 대해 더 이상 신경을 쓰고 싶지 않기 때문이다.
CreateRenderTargetView를 하면서 RenderTargetView가 BackBuffer를 참조하게 되고, 이로 인해 내부적으로 BackBuffer의 Reference Count가 2 혹은 3 쯤으로 증가하게 된다.
즉, 해제한다고 해서 당장 메모리에서 지워지는 것이 아니며 Reference Count가 줄어든다고 생각하면 된다.
리소스 관리를 위해 Reference Count 관리를 해준 것이다.

    g_pImmediateContext->OMSetRenderTargets( 1, &g_pRenderTargetView, nullptr );

Context는 화면의 alpha blending 상태를 바꾸는 등의 그래픽스에 관련된 일만 한다. 
자세히 보면 RenderTarget 뒤에 s가 붙어 있다.
동시에 여러 친구를 변경하는 것이 가능하다.
그러나 당장 우리는 RenderTargetView 하나만 할 것이기 때문에 1이라고 써져있다.

OM이 앞에 붙어있는데 이는 Output Manager의 약자다.
그래픽 버퍼에 써놓고 하는 등의 작업을 하는 친구들이 주로 앞에 OM이 붙는다.

### ViewPort

이제 기본적으로 렌더링 할 준비가 끝났다.
ViewPort를 이제 써야 되는데 이는 화면의 어느 부분에 얼마까지 그릴지를 설정한다.

    D3D11_VIEWPORT vp;
    vp.Width = (FLOAT)width;
    vp.Height = (FLOAT)height;
    vp.MinDepth = 0.0f;
    vp.MaxDepth = 1.0f;
    vp.TopLeftX = 0;
    vp.TopLeftY = 0;
    g_pImmediateContext->RSSetViewports( 1, &vp );

위는 ViewPort에 대한 설정을 하는 것이다.
그리고 설정한 ViewPort를 RSSetViewports를 통해 넣어준다.
여기서 RS는 Rasterizer Stage의 약자다.

### Vertex Shader

    ID3DBlob* pVSBlob = nullptr;
    hr = CompileShaderFromFile( L"Tutorial02.fxh", "VS", "vs_4_0", &pVSBlob );
    if( FAILED( hr ) )
    {
        MessageBox( nullptr,
                    L"The FX file cannot be compiled.  Please run this executable from the directory that contains the FX file.", L"Error", MB_OK );
        return hr;
    }

Tutorial0.fxh라는 파일로부터 VertexShader를 만드는데 이때, VertexShader 모델의 버전은 4.0이다.
여하튼 컴파일을 마치게 되면, pVSBlob이라는 곳에 Shader의 바이너리 코드가 들어가게 된다.

    hr = g_pd3dDevice->CreateVertexShader( pVSBlob->GetBufferPointer(), pVSBlob->GetBufferSize(), nullptr, &g_pVertexShader );
	if( FAILED( hr ) )
	{	
		pVSBlob->Release();
        return hr;
	}

위에서 컴파일한 VertexShader를 이제 생성할 차례다.
생성하는 것과 관련된 모든 일은 Device에서 처리하기 때문에 g_pd3dDevice->CreateVertexShader 라고 되어있는 것이 당연하다.
Blob에 있는 Buffer를 가져와 이를 VertexShader에 넣어준다. 

### Layout

    D3D11_INPUT_ELEMENT_DESC layout[] =
    {
        { "POSITION", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, 0, D3D11_INPUT_PER_VERTEX_DATA, 0 },
    };
	UINT numElements = ARRAYSIZE( layout );

Layout이란 GPU에 전달할 vertex가 어떤 타입이며 구성요소가 어떻게 되는지를 알려주는 역할이다.

여담이지만, 코드 가운데에 'POSITION'이라고 적힌 것을 확인할 수 있다.
이는 D3D에 있는 Semantics라고 하는 개념이며, 문자열이 아니다.

    hr = g_pd3dDevice->CreateInputLayout( layout, numElements, pVSBlob->GetBufferPointer(),
                                          pVSBlob->GetBufferSize(), &g_pVertexLayout );
	pVSBlob->Release();
	if( FAILED( hr ) )
        return hr;

위는 Layout을 생성하는 코드다. 
앞으로도 계속 나오게 되는 주의해야 되는 점이 있다.
바로 뭔가를 생성하고 나면 반드시 Release를 해야 된다는 점이다.

    g_pImmediateContext->IASetInputLayout( g_pVertexLayout );

이는 input layout을 설정하는 과정이다.
Layout을 현재 렌더링 스테이트에 세팅을 한 것이다.
IA는 Input Assembly의 약자다.

### Pixel Shader

	ID3DBlob* pPSBlob = nullptr;
    hr = CompileShaderFromFile( L"Tutorial02.fxh", "PS", "ps_4_0", &pPSBlob );
    if( FAILED( hr ) )
    {
        MessageBox( nullptr,
                    L"The FX file cannot be compiled.  Please run this executable from the directory that contains the FX file.", L"Error", MB_OK );
        return hr;
    }

Pixel Shader를 컴파일하는 과정이며, 이는 위에서 VertexShader를 컴파일 할 때와 유사하다.
Tutorial02.fxh 라는 파일을 불러와 PS라는 이름의 함수를 컴파일 할 것이고 이를 pPSBlob에 넣어준다.
그리고 ps 모델 4.0을 이용한다.

사실 4.0은 다렉 10에서 쓰는 것이고 11의 경우에는 5.0을 이용한다.
그러나 이 예제에서 4.0을 쓰는 이유는 당시 하드웨어의 한계 때문이다.

	hr = g_pd3dDevice->CreatePixelShader( pPSBlob->GetBufferPointer(), pPSBlob->GetBufferSize(), nullptr, &g_pPixelShader );
	pPSBlob->Release();
    if( FAILED( hr ) )
        return hr;

마찬가지로 컴파일 된 Pixel Shader의 바이너리 코드는 pPSBlob에 들어가있을 것이다.
이를 이용해 pixel shader를 생성하고 마지막 파라메터에 넣어준다.
그리고 Release 해주면서 메모리를 해제한다.
    
### Create Vertex Buffer

    SimpleVertex vertices[] =
    {
        XMFLOAT3( 0.0f, 0.5f, 0.5f ),
        XMFLOAT3( 0.5f, -0.5f, 0.5f ),
        XMFLOAT3( -0.5f, -0.5f, 0.5f ),
    };
    D3D11_BUFFER_DESC bd = {};
    bd.Usage = D3D11_USAGE_DEFAULT;
    bd.ByteWidth = sizeof( SimpleVertex ) * 3;
    bd.BindFlags = D3D11_BIND_VERTEX_BUFFER;
	bd.CPUAccessFlags = 0;

    D3D11_SUBRESOURCE_DATA InitData = {};
    InitData.pSysMem = vertices;
    hr = g_pd3dDevice->CreateBuffer( &bd, &InitData, &g_pVertexBuffer );
    if( FAILED( hr ) )
        return hr;

이제 Vertex Buffer를 생성하는 단계다.
기본적으로 좌표를 설정할 때, x와 y는 -1에서 1까지가 범위이고 z는 0에서 1까지라고 한다.
그래서 이에 대한 변환 과정이 있어야 하는데 본 예제는 간단한 것이기 때문에 그냥 진행한다.

> 추가적으로 알아둬야 할 사항

Usage

    typedef 
    enum D3D11_USAGE
        {
            D3D11_USAGE_DEFAULT	= 0,
            D3D11_USAGE_IMMUTABLE	= 1,
            D3D11_USAGE_DYNAMIC	= 2,
            D3D11_USAGE_STAGING	= 3
        } 	D3D11_USAGE;

- DEFAULT: 일반적으로 많이 쓰임 
- IMMUTABLE: 생성할 당시에 그 버퍼에 들어갈 값을 포인터로 전달함. 전달 후에는 절대 건드리지 않음
- DYNAMIC: 쓸 때마다 락을 걸어저야 한다. 최대한 GPU 메모리 안에 위치함. 내용이 변경 가능하다는 뜻. 시스템 메모리에서 썼다가 GPU 메모리로 돌아가는 형태로 쓰임.
- STAGING: GPU 리소스가 아님. 이를 쓰는 이유는 같은 방법으로 COPY 할 때 호환성 유지를 위해 쓰이며 100% 시스템 메모리에 쓰임. 

BindFlags

    typedef 
    enum D3D11_BIND_FLAG
    {
        D3D11_BIND_VERTEX_BUFFER	= 0x1L,
        D3D11_BIND_INDEX_BUFFER	= 0x2L,
        D3D11_BIND_CONSTANT_BUFFER	= 0x4L,
        D3D11_BIND_SHADER_RESOURCE	= 0x8L,
        D3D11_BIND_STREAM_OUTPUT	= 0x10L,
        D3D11_BIND_RENDER_TARGET	= 0x20L,
        D3D11_BIND_DEPTH_STENCIL	= 0x40L,
        D3D11_BIND_UNORDERED_ACCESS	= 0x80L,
        D3D11_BIND_DECODER	= 0x200L,
        D3D11_BIND_VIDEO_ENCODER	= 0x400L
    } 	D3D11_BIND_FLAG;

- D3D11_BIND_UNORDERED_ACCESS: Computer Shader를 쓸 때 
- D3D11_BIND_SHADER_RESOURCE: Texture
- D3D11_BIND_STREAM_OUTPUT: Vertex Buffer를 지정하고 Shader 안에서 처리한 결과는 Pixel Shader에 넘기는 것이 아닌 어떤 메모리에 써놓을 때 쓰임

다시 본론으로 돌아와서, CreateBuffer를 이용해 Vertex Buffer를 만든다.
이 함수는 어떤 Buffer 든지 간에 생성할때는 무조건 쓰인다.

    UINT stride = sizeof( SimpleVertex );
    UINT offset = 0;
    g_pImmediateContext->IASetVertexBuffers( 0, 1, &g_pVertexBuffer, &stride, &offset );

이제 Vertex Buffer를 설정한다.
현재 Context에다가 Vertex Buffer를 묶어준다. 
0번부터 시작하고 개수가 1임을 의미한다.
stride는 Vertex 한 칸 사이의 간격이고 12바이트로 설정되어 있다.
3 * 4바이트 = 12바이트.

    g_pImmediateContext->IASetPrimitiveTopology( D3D11_PRIMITIVE_TOPOLOGY_TRIANGLELIST );

이는 그려지는 객체의 타입을 지정하는 과정이다.
TRIANGLELIST로 해뒀기 때문에 들어오는 Vertex를 세 개씩 묶어서 그린다.

## 4. Render

    void Render()
    {
        // Clear the back buffer 
        g_pImmediateContext->ClearRenderTargetView( g_pRenderTargetView, Colors::MidnightBlue );

        // Render a triangle
        g_pImmediateContext->VSSetShader( g_pVertexShader, nullptr, 0 );
        g_pImmediateContext->PSSetShader( g_pPixelShader, nullptr, 0 );
        g_pImmediateContext->Draw( 3, 0 );

        // Present the information rendered to the back buffer to the front buffer (the screen)
        g_pSwapChain->Present( 0, 0 );
    }

> 그래픽 API 관련된 것들은 Context로 들어간다.

현재 화면을 칠하는 것이 첫 번째 줄의 내용이다.

렌더링을 하기 위해서는 최소한으로 vertex shader와 pixel shader가 필요하다. 

그리고 Draw를 통해 그릴 vertex의 개수를 넘겨준다.

마지막 줄은 뭔 내용인지 잘 모르겠다.

## 5. Quit

만약 사용자가 종료 버튼을 누르게 되면 WMDestroy가 발생한다.
이는 CallBack 함수에서 PostQuitMessage( 0 ); 를 호출한다.
그러면 WM_QUIT 메시지가 날라가게 되고, while 문을 탈출하면서 CleanupDevice(); 가 호출된다.
그리고 메모리를 전부 해제한다.

