export const viewScore = (playersArray) => {
  const table = document.querySelector(".score-table");
  
  if (!table.hasChildNodes()) {
    playersArray.forEach((player, index) => {
      if (index < 10) {
        const li = document.createElement("li");
        li.innerHTML = `${player.nick}: ${player.score}`;
        table.append(li);
      }
    });
  } else {
    let lis = document.querySelectorAll("li");
    const sortedPlayersArray = playersArray.sort((a, b) => b.score - a.score);

    sortedPlayersArray.forEach((player, index) => {
      if (index < 10) {
        if (lis[index].innerHTML !== `${player.nick}: ${player.score}`) {
          lis[index].innerHTML = `${player.nick}: ${player.score}`;
        }
      }
    });
  }
};
