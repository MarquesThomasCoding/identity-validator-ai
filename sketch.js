let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: true, flipHorizontal: false };
let validText = document.getElementById("valid-text");
let canvas = document.querySelector("canvas#defaultCanvas0");
let isValid = false;

function preload() {
    faceMesh = ml5.faceMesh(options);
}

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO, {
        flipped: true
    });
    video.size(640, 480);
    video.hide();
    faceMesh.detectStart(video, gotFaces);
}

function draw() {
    image(video, 0, 0, width, height);
    pop();

    if (faces.length === 0) {
        isValid = false;
        validText.innerText = "Visage non détecté";
        validText.classList.remove("valid");
        validText.classList.add("invalid");
        canvas?.classList.add("invalid");
        canvas?.classList.remove("valid");
    } else {
        for (let i = 0; i < faces.length; i++) {
            let face = faces[i];
            // for (let j = 0; j < face.keypoints.length; j++) {
            //     let keypoint = face.keypoints[j];
            //     fill(0, 255, 0);
            //     noStroke();
            //     circle(width - keypoint.x, keypoint.y, 5);
            // }

            isValid = validateFace(face);
            
            if (isValid) {
                validText.innerText = "Position de visage valide";
                validText.classList.remove("invalid");
                validText.classList.add("valid");
                canvas?.classList.add("valid");
                canvas?.classList.remove("invalid");
            } else {
                validText.innerText = "Position de visage invalide";
                validText.classList.remove("valid");
                validText.classList.add("invalid");
                canvas?.classList.add("invalid");
                canvas?.classList.remove("valid");
            }
        }
    }
}

function gotFaces(results) {
    faces = results;
}

function validateFace(face) {
    let mouthOpen = distance(face.keypoints[13], face.keypoints[14]) > 5;

    let mouthSmiling = distance(face.keypoints[62], face.keypoints[292]) > 45;

    let leftEyeOpen = distance(face.keypoints[159], face.keypoints[145]) > 2;
    let rightEyeOpen = distance(face.keypoints[386], face.keypoints[374]) > 2;

    // if (face.keypoints.length < 468) return false;

    if(!mouthOpen && !mouthSmiling && leftEyeOpen && rightEyeOpen) {
        return true
    }

    return false;
}

function distance(p1, p2) {
    return dist(p1.x, p1.y, p2.x, p2.y);
}


function takePicture() {
    if(!isValid) {
        alert("Invalid Face Detected. Please try again.");
        return
    }
    let canvas = document.querySelector("canvas");
    let img = canvas.toDataURL("image/png");
    let a = document.createElement("a");
    a.href = img;
    a.download = "face.png";
    a.click();
}