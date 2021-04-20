import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

export const colors = ["green", "blue", "red", "yellow", "orange", "gray"];
const GameWrapper = styled.div`
  margin: 10px auto;
  height: 320px;
  width: 350px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  justify-content: center;
  align-items: center;
`;

const Bulb = styled.div`
  width: 100px;
  height: 100px;
  border: 3px solid black;
  border-radius: 50%;
  justify-self: center;
  background: ${(props) => props.backgroundColor};
`;

const getRandNum = () => Math.floor(Math.random() * 6);
const pointesAddition = 10;

const defaultState = {
  displayTurn: false,
  playerTurn: false,
  randomColors: [],
  userColors: [],
  gameOver: false,
  gameOn: false,
  score: 0,
};
function App() {
  const [game, setGame] = useState(defaultState);
  const [colorToShow, setColorToShow] = useState("");

  const handleGameStart = () => {
    setGame({
      ...game,
      gameOn: true,
      displayTurn: true,
      randomColors: [],
      userColors: [],
    });
  };
  const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const displayColorsToPlayer = useCallback(async (newRandomColors) => {
    for (let i = 0; i < newRandomColors.length; i++) {
      setColorToShow(newRandomColors[i]);
      await timeout(1500);
      setColorToShow("");
    }

    await timeout(1500);
    setGame((prevGame) => ({
      ...prevGame,
      displayTurn: false,
      playerTurn: true,
      randomColors: newRandomColors,
      userColors: [...newRandomColors],
    }));
  }, []);

  useEffect(() => {
    if (game.gameOn) {
      if (game.displayTurn) {
        const updatedRandomColors = [
          ...game.randomColors,
          colors[getRandNum()],
        ];
        displayColorsToPlayer(updatedRandomColors);
      }
    }
  }, [game, displayColorsToPlayer]);

  const handleClick = async (playerPickedColor) => {
    if (!game.playerTurn || game.displayTurn) {
      return;
    }
    let userColorsCopy = [...game.userColors];
    setColorToShow(playerPickedColor); //paint
    const colorCompareTo = userColorsCopy.shift(); //extract from the copy userColors array
    await timeout(1500);
    if (colorCompareTo === playerPickedColor) {
      if (!userColorsCopy.length) {
        setGame((prevGameState) => ({
          ...prevGameState,
          displayTurn: true,
          playerTurn: false,
          userColors: [],
          score: prevGameState.score + pointesAddition,
        }));
      } else
        setGame((prevGameState) => ({
          ...prevGameState,
          userColors: userColorsCopy,
        }));
    } else if (colorCompareTo !== playerPickedColor)
      setGame((prevGameState) => ({ ...prevGameState, gameOver: true }));
    await timeout(400);
    setColorToShow("");
  };

  return (
    <div>
      <button onClick={handleGameStart}>start game</button>
      <GameWrapper>
        {colors.map((color, idx) => {
          return (
            <Bulb
              onClick={() => handleClick(color)}
              backgroundColor={color === colorToShow ? colorToShow : "none"}
              key={idx}
            />
          );
        })}
      </GameWrapper>
    </div>
  );
}

export default App;
