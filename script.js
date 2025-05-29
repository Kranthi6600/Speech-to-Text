const resultElement = document.getElementById("result");
let recognition;
let finalTranscript = "";
let lastFinalTranscript = "";  // To track only new final text chunks

function startConverting() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser does not support Speech Recognition.");
        return;
    }

    if (recognition) recognition.stop();

    finalTranscript = "";
    lastFinalTranscript = "";

    recognition = new webkitSpeechRecognition();
    setupRecognition();
    recognition.start();

    gsap.fromTo("#micBtn",
        { scale: 1 },
        { scale: 1.3, duration: 0.5, yoyo: true, repeat: -1, ease: "power1.inOut" }
    );
}

function stopConverting() {
    if (recognition) {
        recognition.stop();
        gsap.killTweensOf("#micBtn");
        gsap.to("#micBtn", { scale: 1, duration: 0.2 });
    }
}

function setupRecognition() {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        let interimTranscript = "";

        // Temporary holder for all finalized transcripts this event
        let newFinalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            let transcript = event.results[i][0].transcript.replace(/\n/g, "<br>");

            if (event.results[i].isFinal) {
                newFinalTranscript += transcript + " ";
            } else {
                interimTranscript += transcript;
            }
        }

        // Only add the difference to finalTranscript, to avoid duplicates
        if (newFinalTranscript.startsWith(lastFinalTranscript)) {
            // Append only the new part (difference)
            finalTranscript += newFinalTranscript.slice(lastFinalTranscript.length);
        } else {
            // If not continuous, just append everything new
            finalTranscript += newFinalTranscript;
        }
        lastFinalTranscript = newFinalTranscript;

        resultElement.innerHTML = finalTranscript + '<span class="interim">' + interimTranscript + '</span>';

        gsap.fromTo("#result",
            { opacity: 0.6, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power1.out" }
        );
    };

    recognition.onerror = function(event) {
        console.error("Speech Recognition Error:", event.error);
    };
}
