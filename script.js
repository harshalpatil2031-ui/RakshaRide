// ================= STEP 1: GO TO VERIFY PAGE =================
function startJourney() {
    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("emergencyemail").value.trim();
    const mode = document.getElementById("travelMode").value;
    const destination = document.getElementById("destination").value.trim();

    if (!name || !email || !mode || !destination) {
        showToast("Please fill all ride details!");
        return;
    }

    localStorage.setItem("userName", name);
    localStorage.setItem("emergencyContact", email);
    localStorage.setItem("mode", mode);
    localStorage.setItem("destination", destination);

    window.location.href = "verify.html";
}

// ================= VERIFY RIDE =================
// ================= VERIFY RIDE =================
function verifyRide() {
    const driverName = document.getElementById("driverName").value.trim();
    const vehicle = document.getElementById("vehicleNumber").value.trim();
    const otp = document.getElementById("otp").value.trim();

    const name = localStorage.getItem("userName");
    const emergency = localStorage.getItem("emergencyContact");

    if (!driverName || !vehicle || !otp) {
        showToast("Please fill all driver verification details!");
        return;
    }

    const validRide = { driver: "Raj", vehicle: "MH12AB1234", otp: "1234" };
    if (driverName !== validRide.driver || vehicle !== validRide.vehicle || otp !== validRide.otp) {
        showToast("🚨 Driver verification failed! Do NOT board this ride.");
        return;
    }

    localStorage.setItem("driverName", driverName);
    localStorage.setItem("vehicle", vehicle);
    localStorage.setItem("rideVerified", "true");

    showToast("✅ Driver verified successfully!");

    // Send journey started email with live location
    navigator.geolocation.getCurrentPosition(
        async function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const response = await fetch("http://localhost:3000/start-alert", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, emergency, lat, lon })
                });

                if (!response.ok) throw new Error("Failed to send alert");

                // ✅ Show toast and wait for 3 seconds before redirect
                showToast("📍 Journey started alert sent to emergency contact!");
                setTimeout(() => {
                    window.location.href = "journey.html";
                }, 3000); // 3 seconds delay

            } catch (error) {
                console.error("Start alert error:", error);
                showToast("Server not connected.");
            }
        },
        function () {
            showToast("Please allow location access.");
        }
    );
}
// ================= SMOOTH PANIC ALERT =================
async function panicAlert() {
    const emergency = localStorage.getItem("emergencyContact");
    const name = localStorage.getItem("userName");

    if (!emergency) {
        showToast("No emergency contact found!");
        return;
    }

    showToast("🚨 Panic alert triggered! Sending...");

    navigator.geolocation.getCurrentPosition(
        async function (position) {
            try {
                const res = await fetch("http://localhost:3000/panic-alert", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,
                        emergency,
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    })
                });

                if (!res.ok) throw new Error("Server failed to confirm alert");

                showToast("📣 Panic alert has reached emergency contact!");
            } catch (err) {
                console.error("Panic alert error:", err);
                showToast("⚠️ Failed to send panic alert.");
            }
        },
        async function () {
            try {
                const res = await fetch("http://localhost:3000/panic-alert", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, emergency, lat: null, lon: null })
                });

                if (!res.ok) throw new Error("Server failed to confirm alert");

                showToast("📣 Panic alert sent without location, emergency notified!");
            } catch (err) {
                console.error("Panic alert error:", err);
                showToast("⚠️ Failed to send panic alert.");
            }
        }
    );
}

// ================= SIMPLE TOAST FUNCTION =================
function showToast(msg) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.style.position = "fixed";
        toast.style.top = "20px";  // ✅ top of screen
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%) translateY(-20px)";
        toast.style.background = "#ff4d4d";
        toast.style.color = "#fff";
        toast.style.padding = "12px 24px";
        toast.style.borderRadius = "8px";
        toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
        toast.style.fontSize = "16px";
        toast.style.zIndex = 9999;
        toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        toast.style.opacity = 0;
        toast.style.pointerEvents = "none";
        document.body.appendChild(toast);
    }

    toast.innerText = msg;
    toast.style.opacity = 1;
    toast.style.transform = "translateX(-50%) translateY(0)";

    setTimeout(() => {
        toast.style.opacity = 0;
        toast.style.transform = "translateX(-50%) translateY(-20px)";
    }, 3000);
}

// ================= END JOURNEY =================
// ================= END JOURNEY =================
function endJourney() {
    const btn = document.querySelector("button[onclick='endJourney()']");
    btn.disabled = true;
    btn.innerText = "Ending journey...";

    const emergency = localStorage.getItem("emergencyContact");
    const name = localStorage.getItem("userName");

    if (!emergency) {
        showToast("No emergency contact found!");
        btn.disabled = false;
        btn.innerText = "✅ End Journey Safely";
        return;
    }

    // Step 1: Immediate feedback
    showToast("⏳ Ending journey...");

    // Step 2: Send end-alert email in background
    navigator.geolocation.getCurrentPosition(
        function (position) {
            fetch("http://localhost:3000/end-alert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    emergency,
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                })
            })
            .then(() => console.log("End alert sent"))
            .catch(err => console.error("End alert error:", err));
        },
        function () {
            console.warn("Location access denied. Ending journey anyway.");
        }
    );

    // Step 3: Smooth UX: wait 2 seconds then show success and redirect
    setTimeout(() => {
        showToast("✅ Journey ended successfully!");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500); // wait 1.5 sec for user to see success toast
    }, 2000); // wait 2 sec before showing success
}

// ================= CHAT =================
async function sendMessage() {
    const input = document.getElementById("userMessage");
    const message = input.value.trim();
    if (!message) return;

    addUserMessage(message);
    input.value = "";

    try {
        const reply = await getAIReply(message);
        addBotMessage(reply);
    } catch {
        addBotMessage("AI not responding.");
    }
}

function addUserMessage(msg) {
    const div = document.createElement("p");
    div.className = "userMsg";
    div.innerText = msg;
    document.getElementById("chatMessages").appendChild(div);
}

function addBotMessage(msg) {
    const div = document.createElement("p");
    div.className = "botMsg";
    div.innerText = msg;
    document.getElementById("chatMessages").appendChild(div);
}

async function getAIReply(message) {
    const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });
    const data = await response.json();
    return data.reply;
}

// ================= CHAT TOGGLE =================
function toggleChat() {
    const chatbox = document.getElementById("chatbox");
    chatbox.style.display = (chatbox.style.display === "block") ? "none" : "block";
}
async function getAIReply(message) {
    try {
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        return data.reply;
    } catch (err) {
        console.error("AI fetch error:", err);
        return "⚠️ AI is busy right now. Please try again in a moment.";
    }
}
// ================= MAP + SMART VOICE =================
document.addEventListener("DOMContentLoaded", async function () {
    if (!document.getElementById("map") || typeof L === "undefined") return;

    const destinationText = localStorage.getItem("destination");
    if (!destinationText) { showToast("Enter destination before starting journey."); return; }

    let map, marker, routeCoords = [], routeDeviationHandled = false;
    let isListeningResponse = false, recognitionStarted = false, deviationLine = null;

    function speak(text) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.rate = 1; msg.pitch = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = function (event) {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();

            if (transcript.includes("help") || transcript.includes("save me") || transcript.includes("danger") || transcript.includes("distress")) {
                speak("Emergency alert triggered.");
                panicAlert();
                return;
            }

            if (isListeningResponse) {
                if (transcript.includes("no") || transcript.includes("problem") || transcript.includes("danger")) {
                    speak("Emergency alert triggered.");
                    panicAlert();
                } else if (transcript.includes("yes") || transcript.includes("fine") || transcript.includes("safe")) {
                    speak("Okay, route marked safe.");
                }
                isListeningResponse = false;
            }
        };

        recognition.onend = function () { if (recognitionStarted) recognition.start(); };
        recognition.start(); recognitionStarted = true;
        speak("Voice safety monitoring started.");
    }

    navigator.geolocation.getCurrentPosition(async function (position) {
        const startLat = position.coords.latitude;
        const startLon = position.coords.longitude;

        map = L.map("map").setView([startLat, startLon], 14);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors"
        }).addTo(map);

        let geoData;
        try {
            const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinationText)}`);
            geoData = await geoResponse.json();
        } catch (err) { console.error(err); showToast("Failed to fetch destination."); return; }

        if (!geoData.length) { showToast("Destination not found!"); return; }

        const destLat = parseFloat(geoData[0].lat);
        const destLon = parseFloat(geoData[0].lon);

        const routingControl = L.Routing.control({
            waypoints: [L.latLng(startLat, startLon), L.latLng(destLat, destLon)],
            routeWhileDragging: false,
            createMarker: () => null,
            show: false,
            lineOptions: { styles: [{ color: "blue", weight: 5 }] },
            router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' })
        }).addTo(map);

        routingControl.on("routesfound", function (e) {
            routeCoords = e.routes[0].coordinates.map(c => ({ lat: c.lat, lng: c.lng }));
        });

        marker = L.marker([startLat, startLon]).addTo(map);

        navigator.geolocation.watchPosition(function (pos) {
            const liveLat = pos.coords.latitude;
            const liveLon = pos.coords.longitude;

            marker.setLatLng([liveLat, liveLon]);
            map.panTo([liveLat, liveLon]);

            if (routeCoords.length) {
                let minDistance = Infinity;
                routeCoords.forEach(point => {
                    const dist = Math.hypot(point.lat - liveLat, point.lng - liveLon);
                    minDistance = Math.min(minDistance, dist);
                });

                if (minDistance > 0.01 && !routeDeviationHandled) {
                    routeDeviationHandled = true;
                    deviationLine = L.polyline([[liveLat, liveLon], [destLat, destLon]], {
                        color: "red",
                        dashArray: "8,8",
                        weight: 5
                    }).addTo(map);

                    showToast("🚨 Route deviation detected!");
                    speak("Your ride seems off route. Are you okay?");
                    isListeningResponse = true;
                }
            }
        });
    }, function () {
        showToast("Please allow location access.");
    });
});