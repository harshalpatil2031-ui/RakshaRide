#  RakshaRide – Smart Women Safety Ride System

##  Problem Statement

Women face serious safety risks while traveling in cabs due to:

* Fake drivers or identity mismatch
* Route deviation without notice
* Lack of real-time monitoring
* Delayed emergency response

---

##  Our Solution

RakshaRide is a **smart safety prototype** that enhances ride security by:

*  Verifying driver before boarding (OTP + vehicle + name)
*  Tracking live journey on map
*  Detecting route deviation
*  Sending real-time alerts to emergency contacts
*  Listening for distress words like *“help”, “danger”*
* Providing AI-based safety assistance

---

##  Features

###  Driver Verification

* User enters driver name, vehicle number, and OTP
* Prevents boarding wrong vehicle

###  Live Location Tracking

* Real-time GPS tracking using map
* Route displayed from current location → destination

###  Panic Alert System

* Sends emergency email with live location
* Triggered via:

  * Panic button
  * Voice detection ("Help", "Danger")

###  Route Deviation Detection

* Detects if ride goes off expected route
* Asks user: *“Are you safe?”*
* Triggers alert if unsafe

###  Voice Assistance (Smart Feature)

* Always listening in background
* Detects distress words
* Automatically sends alert

###  AI Chatbot

* Gives safety guidance
* Helps in panic situations

---

##  Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express
* **Maps:** Leaflet + Leaflet Routing Machine
* **AI:** Gemini API
* **Email Alerts:** Nodemailer
* **Browser APIs:** Geolocation + Speech Recognition

---

##  How It Works

1. User enters journey details
2. Gets redirected to driver verification page
3. Verifies driver using OTP + vehicle
4. Journey starts:

   * Live tracking begins
   * Route is displayed
   * Voice monitoring starts
5. If:

   * Route deviates OR
   * User says "help"
     → Emergency alert is sent instantly

---

##  Demo

https://drive.google.com/drive/folders/19ppXMG5RrDSknVqDIZDaVidjnD32fL1H

---

##  Screenshots

<img width="1600" height="636" alt="image" src="https://github.com/user-attachments/assets/4823b0f4-9a44-4919-bbad-fa42e5f4d144" />
<img width="1600" height="909" alt="image" src="https://github.com/user-attachments/assets/91bde6b2-8463-4afd-90f3-1bcaa032ffd4" />



---

##  Future Scope

* Integration with cab services like Uber/Ola
* Real-time police notification system
* AI-based risk prediction
* Family live tracking dashboard

---

##  Note

This is a **prototype project** built for demonstration purposes.
Driver verification uses demo data.



