document.addEventListener('DOMContentLoaded', function() {
    let iterationCount = 0;
    const maxIterations = 40;
    let selectedImages = new Array(maxIterations).fill('Null');
    let correctSelections = new Array(maxIterations).fill(false); // 올바른 선택 여부를 저장할 배열
    let currentShape; // 현재 반복에서 선택해야 하는 도형
    let autoAdvanceTimeout;
    const imageElements = [
        '<img src="./image/cir.png" class="grid-image" id="circle">',
        '<img src="./image/cross.png" class="grid-image" id="cross">',
        '<img src="./image/penta.png" class="grid-image" id="penta">',
        '<img src="./image/rep.png" class="grid-image" id="reptangle">',
        '<img src="./image/star.png" class="grid-image" id="star">',
        '<img src="./image/tri.png" class="grid-image" id="triangle">'
    ];

    // 도형과 이미지 ID 매핑
    const shapeToImageIdMap = {
        '원': 'circle',
        '삼각형': 'triangle',
        '사각형': 'reptangle',
        '오각형': 'penta',
        '별': 'star',
        '십자가': 'cross'
    };

    const shapes = ['원', '삼각형', '사각형', '오각형', '별', '십자가'];

    function getRandomShape() {
        const randomIndex = Math.floor(Math.random() * shapes.length);
        return shapes[randomIndex];
    }

    function updateSelectImageMessage() {
        currentShape = getRandomShape();
        document.getElementById('select-image-message').innerHTML = `2초 후 6가지 도형이 표시됩니다.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${currentShape} 모형을 클릭해주세요.`;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function updateImageGrid() {
        shuffleArray(imageElements);
        const imageGrid = document.querySelector('.image-grid');
        imageGrid.innerHTML = imageElements.join('');
    }

    function startExperiment() {
        if (iterationCount < maxIterations) {
            document.getElementById('start-message').style.display = 'none';
            updateSelectImageMessage(); // 메시지 업데이트
            updateImageGrid(); // 이미지 그리드 업데이트
            document.getElementById('select-image-message').style.display = 'flex';
            setTimeout(showImageGrid, 2000);
        } else {
            finishExperiment();
        }
    }

    function showImageGrid() {
        document.getElementById('select-image-message').style.display = 'none';
        document.querySelector('.image-grid').style.display = 'grid';
        autoAdvance();
    }

    function autoAdvance() {
        clearTimeout(autoAdvanceTimeout);
        autoAdvanceTimeout = setTimeout(function() {
            if (selectedImages[iterationCount] === 'Null') {
                correctSelections[iterationCount] = false;
            }
            iterationCount++;
            if (iterationCount < maxIterations) {
                updateSelectImageMessage(); // 메시지 업데이트
                updateImageGrid(); // 이미지 그리드 업데이트
                document.getElementById('select-image-message').style.display = 'flex';
                document.querySelector('.image-grid').style.display = 'none';
                setTimeout(showImageGrid, 2000);
            } else {
                finishExperiment();
            }
        }, 2000); // 2초 후에 자동 진행
    }

    function finishExperiment() {
        document.querySelector('.image-grid').style.display = 'none';
        document.getElementById('experiment-end-message').style.display = 'flex';
        document.getElementById('download-button').style.display = 'block';
    }

    document.querySelector('.image-grid').addEventListener('click', function(event) {
        if (event.target.tagName === 'IMG') {
            selectedImages[iterationCount] = event.target.id;
            // 올바른 선택인지 확인
            correctSelections[iterationCount] = event.target.id === shapeToImageIdMap[currentShape];
            clearTimeout(autoAdvanceTimeout);
            iterationCount++;
            if (iterationCount < maxIterations) {
                updateSelectImageMessage(); // 메시지 업데이트
                updateImageGrid(); // 이미지 그리드 업데이트
                document.getElementById('select-image-message').style.display = 'flex';
                document.querySelector('.image-grid').style.display = 'none';
                setTimeout(showImageGrid, 2000);
            } else {
                finishExperiment();
            }
        }
    });

    document.getElementById('download-button').addEventListener('click', function() {
        const text = selectedImages.map((image, index) => {
            const correct = correctSelections[index] ? 'True' : 'False';
            return `${index + 1}번째 반복에서 선택된 이미지: ${image}, 올바른 선택: ${correct}`;
        }).join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'selected-images.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    });

    setTimeout(startExperiment, 5000);
});
