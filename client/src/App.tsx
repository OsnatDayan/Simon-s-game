import React, { useState, useEffect } from 'react';
import './App.css';
import ColorButton from './components/ColorButton';
import { NewPlayModel } from './components/Models/NewPlayModel';
import timeOut from './Helpers';

function App() {
  const colorsList = ['red', 'green', 'yellow', 'blue'];
  const [flash, setFlash] = useState<string>('');
  const playObject:NewPlayModel = {
    isOn: false,
    computerSteps: [],
    isDisplay: false,
    score: 0,
    highestScore: 0,
    userPlay: false,
    userColor: []
  }
  useEffect(() => {
    fetch('/api/score')
      .then(res => res.json())
      .then(resj => setPlay({ ...play, highestScore: resj.score }))
  }, []);
  async function setRecord(record: number) {
    return fetch('/api/setScore', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "score": record })
    }).then(res => console.log(res)
    )
  }
  const [play, setPlay] = useState<any>(playObject);

  async function randomColor() {
    return fetch('/api/randomcolor').then(res => res.text());
  }
  const onStartclick = () => {
    setPlay({ ...play, isOn: true });
  }

  useEffect(() => {
    if (play.isOn)
      setPlay({ ...play, isDisplay: true });

    else
      setPlay({ ...play, isDisplay: false })
  }, [play.isOn])

  useEffect(() => {
    if (play.isOn && play.isDisplay) {
      const copyColorArr = [...play.computerSteps];
      randomColor().then(res => {
        copyColorArr.push(res);
        setPlay({ ...play, computerSteps: copyColorArr })
      })
      console.log(copyColorArr);
    }
  }, [play.isOn, play.isDisplay])

  useEffect(() => {
    if (play.isOn && play.isDisplay && play.computerSteps.length) {
      FlashColors();
    }

  }, [play.isOn, play.isDisplay, play.computerSteps.length])

  async function FlashColors() {
    await timeOut(1000);
    console.log(play.computerSteps);
    for (let i = 0; i < play.computerSteps.length; i++) {
      setFlash(play.computerSteps[i]);
      await timeOut(500);
      setFlash("");
      await timeOut(500);

      if (i === play.computerSteps.length - 1) {
        const copyColors = [...play.computerSteps];
        setPlay({
          ...play,
          isDisplay: false,
          userPlay: true,
          userColor: copyColors.reverse()
        })

      }
    }
  }

  async function onColorClicked(color: any) {
    if (!play.isDisplay && play.userPlay) {
      const copyUserColor: string[] = [...play.userColor];//מעתיק את הצבעים
      const currentColor = copyUserColor.pop();//לוקח את הצבא האחרון
      setFlash(color);//מדליק את הצבע
      if (color === currentColor) {//בודק אם הצבעים זהים
        if (copyUserColor.length !== 0) {//בודק אם זה הצבע האחרון
          setPlay({
            ...play,
            userColor: copyUserColor
          })//אם לא אז ממשיכים לצבע הבא

        }
        else {//אם זה הצבע האחרון
          await timeOut(500);//נגמר הסיבוב
          setPlay({
            ...play,
            userPlay: false,
            isDisplay: true,
            score: play.score + 1,
            userColor: []
          });
        }
      }
      else {//במקרה של פסילה
        if (play.score > play.highestScore) {
          await timeOut(500);
          setPlay({
            ...play,
            computerSteps: [],
            isDisplay: true,
            highestScore: play.score,
            score: 0,
            userPlay: false,
            userColor: []

          })
        }
        else {
          await timeOut(500);
          setPlay({
            ...play,
            computerSteps: [],
            isDisplay: true,
            score: 0,
            userPlay: false,
            userColor: []

          })
        }
      }
      await timeOut(500);
      setFlash('');
    }
  }
  const ouitGeme = () => {
    setRecord(play.highestScore)
    setPlay({
      ...play,
      isOn: false,
      isDisplay: false,
      score: 0,
      userPlay: false,
    });

  }
  return (
    <div className='app' style={{ backgroundColor: 'black' }}>
      <div className='buttonsWrapwer'>
        {colorsList &&
          colorsList.map((c: any, i: any) => <ColorButton onclick={() => {
            // event.preventDefault();
            onColorClicked(c)
          }} key={i} color={c} flash={flash == c}></ColorButton>)
        }
      </div>
      {
        !play.isOn ? <button className='startButton' onClick={onStartclick}>START</button> : <></>}
      {
        play.isOn ? <div className='score'>SCORE:{play.score}</div> : <></>}
      {
        play.isOn ? <div className='score'>HIGHEST:{play.highestScore}</div> : <></>}
      {
        play.isOn ? <button onClick={ouitGeme} className='Quit'>Quit</button> : <></>}
    </div>
  );
}

export default App;
