function removeFromArray(array, element) {
  const index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
}
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var stats = {
       games:0,
       wins:0,
       loses: 0,
       switches: 0
};
var log = [];
var gameSettings = {
       rounds: 100,
       auto: true,
       switch: true
};

function runGame(){
       for(var i=1; i<=gameSettings.rounds; i++){

              var gates = [1,2,3];

              //Wähle das Tor hinter welchem der Gewinn liegt
              var winGate = Math.floor(Math.random() * 3) +1;

              //Der Spieler wählt ein Tor aus
              var firstChoice = Math.floor(Math.random() * 3) +1;

              //Entscheidet ob der Spieler wechseln möchte
              if(gameSettings.auto){
                     var wantToSwitch = Math.floor(Math.random() * 2);
                     if(wantToSwitch == 0){
                            wantToSwitch = false;
                     }else{
                            wantToSwitch = true;
                     }
              }else{
                     var wantToSwitch = gameSettings.switch;
              }

              //Erstelle Arbeitskopien der Liste der Tore
              var avalibleGates1 = gates.slice();
              var avalibleGates2 = gates.slice();

              //Entscheide welches Tor geöffnet wird
              removeFromArray(avalibleGates1, winGate);
              removeFromArray(avalibleGates1, firstChoice);
              if(avalibleGates1.length > 1){
                     var open = avalibleGates1[Math.floor(Math.random() * avalibleGates1.length)];
              }else{
                     var open = parseInt(avalibleGates1);
              }

              //Liste der noch möglichen Tore
              removeFromArray(avalibleGates2,open);
              var avalibleGates3 = avalibleGates2.slice();
              if(wantToSwitch == true){
                     //Wechsle das Tor (Wähle das Tor aus welches der GameMaster NICHT geöffnet hat und welches der Spieler NICHT geöffnet hat)
                     removeFromArray(avalibleGates3,firstChoice);
                     var secondChoice = parseInt(avalibleGates3);
                     stats.switches++;

              }else{
                     //Bleibe beim Tor
                     var secondChoice = firstChoice;
              }

              //Überprüfe ob der Spieler gewonnen hat
              if(secondChoice == winGate){
                     var win = true;
                     stats.wins++
              }else{
                     var win = false;
                     stats.loses++
              }

              stats.games++
              log.push({winGate:winGate,firstChoice:firstChoice,openGate:open,switch:wantToSwitch,secondChoice:secondChoice,win:win});

              console.log(`[${i}] Tor mit Gewinn: ${winGate} | Erste Wahl: ${firstChoice} | Geöffnetes Tor: ${open} | Wechseln?: ${wantToSwitch} | Zweite Wahl: ${secondChoice} | Gewonnen?: ${win}`);

              //Endergebnis berechnen
              if(i==gameSettings.rounds){
                     stats.winRate = Math.round((stats.wins*100)/stats.games);
                     stats.loseRate = Math.round((stats.loses*100)/stats.games);
                     if(gameSettings.auto == true){var autosettings = "ja"}else{var autosettings = "nein"}
                     if(gameSettings.auto == false){if(gameSettings.switch == true){var switchsettings = "immer"}else{var switchsettings = "nie"}}else{switchsettings = "zufall"}
                     console.log(`\n\n[Einstellungen] Runden: ${gameSettings.rounds} | Zufällig wechseln: ${autosettings} | Wechsel: ${switchsettings}`)
                     console.log(`\n[Statistiken] Runden: ${stats.games} | Gewinne: ${stats.wins} | Verloren: ${stats.loses} | Gewinnrate: ${stats.winRate}% | Verlierrate: ${stats.loseRate}%`);

                     console.log("\nDie Statistiken wurden in einer Logdatei im selben Ordner gespeichert.\nSie können das Fenster jetzt schließen");

                     var logString=`Logdatei für die automatische generierung des "Zonk" Spiels.\n\nEinstellungen:\n- Runden: ${gameSettings.rounds}\n- Zufällig wechseln: ${autosettings}\n- Wechsel: ${switchsettings}\n\nStatistiken:\n- Runden: ${stats.games}\n\n- Gewinne: ${stats.wins}\n- Verloren: ${stats.loses}\n\n- Gewinnrate: ${stats.winRate}%\n- Verlierrate: ${stats.loseRate}%`;

                     fs.writeFileSync("Zonk Log "+Date.now()+".txt",logString);

              }

       }
}

rl.question('Wie viele Runden sollen gespielt werden (zahl)?', (rounds) => {
       if(parseInt(rounds)){

              gameSettings.rounds = rounds;

              rl.question('Soll zufällig entschieden werden, ob der Spieler das Tor wechselt oder nicht (ja/nein)? ', (playerSwitch) => {

                     playerSwitch = playerSwitch.toLowerCase();
                     if(playerSwitch == "ja"){
                            gameSettings.auto = true;
                            runGame();
                     }else if(playerSwitch == "nein"){
                            gameSettings.auto = false;
                            rl.question('Soll immer das Tor gewechselt werden oder nie gewechselt werden? (immer/nie)? ', (playerSwitch) => {

                                   playerSwitch = playerSwitch.toLowerCase();
                                   if(playerSwitch == "immer"){
                                          gameSettings.switch = true;
                                          runGame();
                                   }else if(playerSwitch == "nie"){
                                          gameSettings.switch = false;
                                          runGame();
                                   }else{
                                          console.log('Bitte nur "immer" oder "nie" angeben!');

                                   }
                            });

                     }else{
                            console.log("Bitte nur ja oder nein angeben!");

                     }
              });

       }else{
              console.log("Bitte nur Zahlen angeben!");

       }
});
