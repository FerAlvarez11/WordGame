function startWordGame(gameContainerElement){
    gameContainerElement.innerHTML = 
`
<div class="definitionContainer">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-auto"><p class="definitionP">Definition:</p></div> 
        </div>  
        <div class="row justify-content-center">  
            <div class="col-auto" id="definitionDiv"></div> 
        </div>      
        <div class="row justify-content-center">
            <div class ="col-auto" id="letterDiv"></div>

        
        <div class="row justify-content-center">
            <div class="col" id="incorrectLettersContainer"> 
                <div class="incorrectLetters">Wrong letters:</div>
                <div id="incorrectLetters">-</div>
            </div>
        </div>
     
        <div class="row justify-content-center">   
        <div class="banner-div">          
            <div class="col-auto" id="btnHintDiv"></div>  
            <div class="col-auto livesContainer">
                <img class="heartImage" src="img/heart.png" alt="heart">
                <div class="lives">Lives</div>
                <div class="numberOfLives" id="intro">5</div>
            </div>    
        </div>    
    </div>
</div>

<div class="container">
    <div class="row justify-content-center">    
        <div class="btnLettersContainer">
            <div class="col-auto" id="btnLettersDiv"></div>
            </div>
        </div>
        </div>
    </div> 
</div> 

<footer class="text-center text-white fixed-bottom" style="background-color: #fff; border-style: 1px solid black">
<div class="col-auto"><img class="logo"src="img/logo.png" alt="Word Play"></div>
  <!-- Grid container -->
</footer>`;


    const letterDiv = document.getElementById('letterDiv');
    const definitionDiv = document.getElementById('definitionDiv');
    const btnLettersDiv = document.getElementById('btnLettersDiv');
    const btnHintDiv = document.getElementById('btnHintDiv');

    var request = new XMLHttpRequest()
    request.open('GET', 'https://random-words-api.vercel.app/word', true);

    request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);

        if (request.status >= 400){
            console.log("error");
            return;
        }
    
        var dictionary = data [0];
        var s = dictionary.word;
        word = s.toUpperCase();
        console.log(word);

        if (word.includes("-") || word.length>14){
            location.reload();
        }

        pDef = document.createElement('p');
        def = document.createTextNode(dictionary.definition);
        definitionDiv.appendChild(def);

        let btnHint = document.createElement('button');
        btnHint.innerHTML = "Hint";
        btnHintDiv.appendChild(btnHint);
        btnHint.classList.add("btnHint");

        const livesText = document.querySelector('#intro');
        const showIncorrectLetters = document.querySelector('#incorrectLetters');

        let allLettersInWord = [];
        let incorrectLetter = [];
        let spotsTaken = [];
        let spotsAvailable = [];
        let divPosition = [];
        let divLetter;
        var lives = 5;
    
        
        for (var i = 0; i < word.length; i++) {
            divLetter = document.createElement('div');
            divLetter.classList.add("divLetter");
            letterDiv.appendChild(divLetter);
            divPosition.push(i);
            spotsAvailable.push(i);
            divLetter.id = "letter_" + i;
        }
 

        let letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

        
        for (var i = 0; i < letters.length; i++) {
            let btn = document.createElement("button");
            btn.classList.add("btnLetter");
            btnLettersDiv.appendChild(btn);
            btn.id = "btn_" + letters[i];
            btn.innerHTML = letters[i];


            document.getElementById(`btn_${letters[i]}`).addEventListener("click", function (event) {                        
                let currentLetter = event.target.innerHTML;

                let positionLetter =  positionOfLetters(currentLetter, allLettersInWord);
                    
                positionLetter.forEach(position => spotsTaken.push(position));

                spotsTaken.forEach(let => spotsAvailable = spotsAvailable.filter(function(item) {
                    return item !== let;
                }));


                if (spotsTaken.length === word.length){
                    createModal("modal-content-win", `Congratulations! The correct word was ${word}. I bet you feel smart now!`);    
                }
                
                if (!allLettersInWord.includes(currentLetter)) {
                    incorrectLetter.push(currentLetter);
                    livesText.innerText = --lives;
                    let incorrectLettersText ="";

                    incorrectLetter.forEach(letter =>{
                        incorrectLettersText = incorrectLettersText + letter.toUpperCase() + ", ";
                    });
                    
                    incorrectLettersText = incorrectLettersText.slice(0,-2);

                    showIncorrectLetters.innerText = incorrectLettersText;

                    document.getElementById(`btn_${currentLetter}`).disabled = true;
                    document.getElementById(`btn_${currentLetter}`).style.hover = "none";            
                }

              
                if (incorrectLetter.length > 0){
                    document.getElementById("incorrectLettersContainer").style.display = "block";
                }

                if (lives === 1 || spotsAvailable.length === 1){
                    btnHint.disabled = true
                }
        
                if (lives === 0){
                    createModal("modal-content-loose", `Oops! The correct word was ${word}. You should try that again!`)
                }

            

                putLettersOnDivs(currentLetter, positionLetter);
                
            });
        
        }

        btnHint.addEventListener("click", function () {
            let currentLetter =  getRndInteger(allLettersInWord, spotsAvailable, spotsTaken);
            livesText.innerText = --lives; 
            btnHint.disabled = true;
            let positionLetter = positionOfLetters(currentLetter, allLettersInWord);
            putLettersOnDivs(currentLetter, positionLetter);
        });
    
    } 
    
    request.send();

}

function createModal(className, text) {
    let myModal = document.createElement('div');
    myModal.classList.add("modal");
    document.body.appendChild(myModal);   
    let modalContent = document.createElement('div');
    myModal.appendChild(modalContent);
    modalContent.classList.add(`${className}`);
    modalContent.innerHTML = text;
    let nextWord = document.createElement("button");
    nextWord.innerHTML = "Next Word";
    modalContent.appendChild(nextWord);
    nextWord.classList.add("nextWordBtn");
    myModal.style.display = "block";

    nextWord.addEventListener("click", function (event) {
       location.reload();
    });

    clickEnter(nextWord);
}

function clickEnter(button){
    window.addEventListener("keypress", function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        button.click();
      }
    });
}

function getRndInteger(allLettersInWord, spotsAvailable, spotsTaken) {             
    for (var i = 0; i < word.length; i++) {
        const eachLetterInWord = word.charAt(i);
        allLettersInWord.push(eachLetterInWord);
    }

    const randomNumber = spotsAvailable[Math.floor(Math.random()*spotsAvailable.length)];
    
    const rValue = randomNumber;

    const currentLetter = allLettersInWord[rValue];

    const positionLetter =  positionOfLetters(currentLetter, allLettersInWord);

    positionLetter.forEach(position => spotsTaken.push(position));
  
    spotsTaken.forEach(let => spotsAvailable = spotsAvailable.filter(function(item) {
        return item !== let;
    }));  

    return currentLetter;
}

function putLettersOnDivs(letterToFill, positionsToFill){
    positionsToFill.forEach(position => document.getElementById(`letter_${position}`).innerHTML = letterToFill);    
}

function positionOfLetters(letterToFill, allLettersInWord){
    let positionLetter = [];

    for (var i = 0; i < word.length; i++) {
        let eachLetterInWord = word.charAt(i);
        allLettersInWord.push(eachLetterInWord);
       
        if (eachLetterInWord == letterToFill){
            positionLetter.push(i);    
            document.getElementById(`btn_${letterToFill}`).disabled = true;
        }
    } 
   
    return positionLetter;

}  

