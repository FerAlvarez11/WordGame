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
    let eachLetterInWord; 
    let incorrectLetter = [];
    let spotsTaken = [];
    let spotsAvailable = [];
    let divPosition = [];
    let divLetter;
    var lives = 5;
    let currentLetter; 
    let positionLetter = [];

    let nextWord;

    function createModal(text) {

        let myModal = document.createElement('div');
        myModal.classList.add("modal");
        document.body.appendChild(myModal);   
        let modalContent = document.createElement('div');
        myModal.appendChild(modalContent);
        modalContent.classList.add("modal-content");
        modalContent.innerHTML = text;
        nextWord = document.createElement("button");
        nextWord.innerHTML = "Next Word";
        modalContent.appendChild(nextWord);
        nextWord.classList.add("nextWordBtn");
        myModal.style.display = "block";
    
        nextWord.addEventListener("click", function (event) {
           location.reload();
        
           if (event.key === 'Enter') {
            event.preventDefault();
            button.click();
            }
        });

        clickEnter(nextWord);
    }

    function clickEnter(button){
        nextWord.addEventListener("keyup", function(event) {
          if (event.key === 'Enter') {
            event.preventDefault();
            button.click();
          }
        });
    }
    
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
                       
            currentLetter = event.target.innerHTML;

            let positionLetter =  positionOfLetters(currentLetter);
                
            positionLetter.forEach(position => spotsTaken.push(position));

            spotsTaken.forEach(let => spotsAvailable = spotsAvailable.filter(function(item) {
                return item !== let;
            }));


            if (spotsTaken.length === word.length){
                createModal("Congratulations! I bet you feel smart now");
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

                console.log("inco", incorrectLetter);
                document.getElementById(`btn_${currentLetter}`).disabled = true;
                  
                if (incorrectLetter.includes(currentLetter)){
                  console.log("hi");  
                }
              
            }

            if (lives === 1){
                btnHint.disabled = true
            }
       
            if (lives === 0){
                createModal(`Oops! The correct word was ${word}. You should try that again!`)
            }

            putLettersOnDivs(currentLetter, positionLetter);
            
        });
     
    }

    let randomNumber;
    let rValue;

    btnHint.addEventListener("click", function () {

        getRndInteger();
        livesText.innerText = --lives; 
        btnHint.disabled = true;
        putLettersOnDivs(currentLetter, positionLetter);
        console.log(spotsAvailable);
    });

    function getRndInteger() {     
        
        for (var i = 0; i < word.length; i++) {
            eachLetterInWord = word.charAt(i);
            allLettersInWord.push(eachLetterInWord);
        }


        console.log("touse",spotsAvailable);

        randomNumber = spotsAvailable[Math.floor(Math.random()*spotsAvailable.length)];

        console.log("randomnumber", randomNumber);

        rValue = randomNumber;

        console.log("rValue", rValue);

        currentLetter = allLettersInWord[rValue];

        console.log("allletters", allLettersInWord[3]);

        console.log("currentletter",currentLetter);

        positionLetter =  positionOfLetters(currentLetter);

        positionLetter.forEach(position => spotsTaken.push(position));
       
        spotsTaken.forEach(let => spotsAvailable = spotsAvailable.filter(function(item) {
            return item !== let;
        }));  
    }

    function putLettersOnDivs(letterToFill, positionsToFill){
        positionsToFill.forEach(position => document.getElementById(`letter_${position}`).innerHTML = letterToFill); 
    
    }

    function positionOfLetters(letterToFill){

        let positionLetter = [];

        for (var i = 0; i < word.length; i++) {
            eachLetterInWord = word.charAt(i);
            allLettersInWord.push(eachLetterInWord);
           
            if (eachLetterInWord == letterToFill){
                positionLetter.push(i);    
                document.getElementById(`btn_${letterToFill}`).disabled = true;
            }
        } 
        console.log(positionLetter);
        return positionLetter;

    }    
}   
  
request.send();


