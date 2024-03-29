

/*
* (retrieve password container)
*	-hides its container when button is clicked
*	-display (retrieved password container)
*	-hides back button
*
* (retrieved password container)
*	-style
*	-display when button is clicked
*	-display end session button
*/
  function retrievePasswrod() {

    // hides retrieves password continaer
	let retrievePasswordContainer = document.querySelector('.form-container');
    retrievePasswordContainer.classList.add("hide");

    // hides button
    let backButton = document.querySelector('.back-button');
    backButton.classList.add("hide");

    // display retrieved password
    let retrievedPassword = document.querySelector('.retrieved-password-container');
    retrievedPassword.classList.add("show");

    // display end session button
    let endSssionButton = document.querySelector('.end-session-button');
    endSssionButton.classList.add("show");
}


/**
 * RETRIEVE PASSWORD HANDLER when is clicked
 */



const hintInput = document.getElementById("hint");


const retrivePasswordButtoon = document.querySelector(".retrieve-pass-button");
retrivePasswordButtoon.addEventListener("click", function(event) {
	
	 	// Prevent the default form submission
	 	event.preventDefault();

    // since the pass is string, it gets value and convert so String
		let hintValue = String(hintInput.value).trim();
   
		// Send HINT REQUEST to the (main) process with the entered password
	  window.passwordRequest.send('password:request', hintValue); //OK
});



  // Listen for the HINT REQUEST from the preload script
  window.passwordRequest.receive('password:response', (processedHint) => {
    // console message for debbuging
    console.log('Received processed hint in renderer:', processedHint);
      
    // if hint failed, display message
    if (!processedHint ) {
         console.log('Retrieved pass failed!');
         // display error in here
  
        // if success show password retrieved
      } else {
           console.log('Retrieved pass successful!', processedHint);
           retrievePasswrod();

           // append the password retrieved in the HTML
           let retriedVALUE = document.querySelector('.retrieved-password');
           retriedVALUE.innerHTML = processedHint;

              // Show the element after a delay (e.g., 1 second)
              // call TIMER WHEN button is clicked and pass retrieved
              showElement();
      }
    });

    // set timer for the password with a 10 seconds limit
    let timer = document.getElementById("timeCountDown");
    let retrievedPass = document.querySelector('.retrieved-password');
    let header = document.querySelector(".header-message");
    let expiredPass = document.getElementById("expiredPass");
    let countdown = 10;

      function showElement() {
          timer.style.display = "block";
          updateCountdown();
          var countdownInterval = setInterval(function () {
              countdown--;
              updateCountdown();
              if (countdown <= 0) {
                  clearInterval(countdownInterval);
                  hideElement();
              }
          }, 1000);
      }


      function hideElement() {
          timer.style.display = "none";
          retrievedPass.style.display = "none";
          header.style.display = "none"; 
          expiredPass.style.display = "block"
      }


      function updateCountdown() {
          timer.innerHTML = "Time left: " + countdown + " seconds";
      }

   
  