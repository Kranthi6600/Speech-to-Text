const resultElement = document.getElementById("result");
let recognition;
let finalTranscript = "";  // Global to persist recognized text

function setupRecognition() {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = function (event) {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            let transcript = event.results[i][0].transcript;
            transcript = transcript.replace(/\n/g, "<br>");

            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        resultElement.innerHTML = finalTranscript + '<span class="interim">' + interimTranscript + '</span>';

        // Animate result text on update
        gsap.fromTo("#result", 
            { opacity: 0.6, y: 10 }, 
            { opacity: 1, y: 0, duration: 0.4, ease: "power1.out" }
        );
    };

    recognition.onerror = function (event) {
        console.error("Speech Recognition Error:", event.error);
    };
}

function startConverting() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        setupRecognition();
        recognition.start();

        // Animate mic button (infinite pulsing)
        gsap.fromTo("#micBtn", 
            { scale: 1 }, 
            { scale: 1.3, duration: 0.5, yoyo: true, repeat: -1, ease: "power1.inOut" }
        );
    } else {
        alert("Your browser does not support Speech Recognition.");
    }
}

function stopConverting() {
    if (recognition) {
        recognition.stop();

        // Stop mic animation
        gsap.killTweensOf("#micBtn");
        gsap.to("#micBtn", { scale: 1, duration: 0.2 });
    }
}

