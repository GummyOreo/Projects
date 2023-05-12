const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");
const transcript = document.getElementById("transcript");

let recognition;
let isRecording = false;

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = function (event) {
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        transcript.innerHTML += event.results[i][0].transcript.replace(/\.|\?|\!/g, "$&<br>") + "<br>";
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
  };
} else {
  alert("Your browser does not support the Web Speech API");
}

startBtn.addEventListener("click", () => {
  if (!isRecording) {
    recognition.start();
    isRecording = true;
  }
});

stopBtn.addEventListener("click", () => {
  if (isRecording) {
    recognition.stop();
    isRecording = false;
  }
});

downloadBtn.addEventListener("click", () => {
  const formattedText = transcript.innerHTML.replace(/<br>/g, "\n");
  const blob = new Blob([formattedText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date();
  const timestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

  a.href = url;
  a.download = `transcript_${timestamp}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

clearBtn.addEventListener("click", () => {
  transcript.innerHTML = "";
});
